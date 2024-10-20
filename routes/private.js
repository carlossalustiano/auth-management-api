import express from 'express';
import { PrismaClient } from '@prisma/client';
import e from 'express';

const router = express.Router();
const prisma = new PrismaClient();

export default router;

// Retornando um ou todos os usuários.

router.get('/listar-usuarios', async (request, response) => {
    try {
        // Vai omitir o password do usuário.
        const users = await prisma.userFIXIA.findMany({ select: {
            id: true,
            name: true,
            email: true,
            password: false
        } }); 
        response.status(200).json({ message: 'Usuários listados com sucesso', users })
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Falha no servidor.' })
    }
  });