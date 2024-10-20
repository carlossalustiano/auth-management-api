// npm install bcrypt -> Criptografar senhas.
// Token JWT -> Autenticação
// npm install jsonwebtoken
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" -> Criar uma JWT_SECRET
// Middlewares -> Uma ação que vai ocorrer no "meio" da requisição. (JWT)

import express, { request, response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET // Acessar o .env

// Criando usuário.

export default router;

router.post('/cadastro', async (request, response) => {
  try {
      const salt = await bcrypt.genSalt(10); // Nível da incriptação
      const hashPassword = await bcrypt.hash(request.body.password, salt); // Criando a senha criptografada.

    await prisma.userFIXIA.create({
      data: {
        name: request.body.name,
        email: request.body.email,
        password: hashPassword,
      },
    });
    response.status(201).send("Usuário criado com sucesso.");
  } catch (error) {
    response.status(500).json({ message: "Error no Servidor, tente novamente." });
  }
});

// Rota de Login

router.post('/login', async (request, response) => {
  try {
    const userInfo = request.body
    // findUnique -> apenas um unico usuário.
    const user = await prisma.userFIXIA.findUnique({
      where: {
        email: userInfo.email
      }
    })

    if(!user) {
      return response.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const isMatch = await bcrypt.compare(userInfo.password, user.password); // Está comparando as senhas e vai validá-los.

    if(!isMatch) {
      return response.status(400).json({ message: 'Senha inválida.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' })
    
    response.status(200).json(token);
  } catch (error) {
    response.status(500).json({ message: "Error no Servidor, tente novamente." });
  }
})