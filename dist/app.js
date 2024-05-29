"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const routes_1 = require("./routes");
const ws_1 = require("./ws");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
exports.app = (0, express_1.default)();
const server = http_1.default.createServer(exports.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    }
});
// initialize socket.io
(0, ws_1.ws)(io);
// Middleware
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({ origin: '*' }));
// Database connection
config_1.db.authenticate().then(() => {
    console.log('SQLite connected successfully');
    config_1.db.sync();
});
// Router
exports.app.use("/users", routes_1.usersRouter);
exports.app.use("/conversations", routes_1.conversationRouter);
exports.app.use("/messages", routes_1.messagesRouter);
exports.app.get('/seed', async (_, res) => {
    // createConversations();
    res.json({
        message: 'Seeded successfully'
    });
});
exports.app.use('*', (_, res) => {
    res.json({
        message: 'Unauthorized Routes'
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});
