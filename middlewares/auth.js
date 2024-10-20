import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

const auth = (request, response, next) => {
    const token = request.headers.authorization

    if(!token) {
        return response.status(401).json({ message: 'Acesso Negado.' })
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)
    } catch (error) {
        return response.status(401).json({ message: 'Token Inválido.' })
    }
    next();
}

export default auth