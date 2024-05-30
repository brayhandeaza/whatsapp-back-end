import express, { Request, Response } from 'express';
import { db } from './config';
import { conversationRouter, messagesRouter, usersRouter } from './routes';
import { ws } from './ws/index';
import cors from 'cors';
import http from 'http';
import { Server } from "socket.io";
import { createConversations } from './seeds';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cleanupEmptyChildNamespaces: true,
    allowEIO3: true,
    cors: {
        origin: "https://whatapp-front-end.vercel.app/",
    }
});


// initialize socket.io
ws(io)

// Middleware
app.use(express.json());
app.use(cors({
    origin: "https://whatapp-front-end.vercel.app/",
}));

// Database connection
db.authenticate().then(() => {
    console.log('SQLite connected successfully');
    db.sync();
})


// Router
app.use("/users", usersRouter)
app.use("/conversations", conversationRouter)
app.use("/messages", messagesRouter)


app.get('/seed', async (_: Request, res: Response) => {
    // createConversations();
    res.json({
        message: 'Seeded successfully'
    });
})

app.use('*', (_: Request, res: Response) => {
    res.status(401).json({
        message: 'Alicia01'
    });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});

export default app