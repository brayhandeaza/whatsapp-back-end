"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const routes_1 = require("./routes");
const index_1 = require("./ws/index");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cleanupEmptyChildNamespaces: true,
    allowEIO3: true,
    cors: {
        origin: "*",
    }
});
// initialize socket.io
(0, index_1.ws)(io);
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
// Database connection
config_1.db.authenticate().then(() => {
    console.log('SQLite connected successfully');
    config_1.db.sync();
});
// Router
app.use("/users", routes_1.usersRouter);
app.use("/conversations", routes_1.conversationRouter);
app.use("/messages", routes_1.messagesRouter);
app.get('/seed', async (_, res) => {
    // createConversations();
    res.json({
        message: 'Seeded successfully'
    });
});
app.use('*', (_, res) => {
    res.status(401).json({
        message: 'Route not Authorized'
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});
exports.default = app;
