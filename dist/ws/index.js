"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ws = void 0;
const ws = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        socket.on("joinRoom", (id) => {
            console.log({ id });
            socket.join(id);
        });
        socket.on('last-seen', (data) => {
            console.log({ data }, "last-seen");
            socket.to(data.sentTo).emit('last-seen', data);
        });
        socket.on('last-seen-answer', (data) => {
            socket.to(data.sentTo).emit('last-seen-answer', data);
        });
        socket.on('new-message', (data) => {
            socket.to(data.sentTo).emit('new-message', data);
            socket.to(data.sentTo).emit('new-message-received', data);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
    });
};
exports.ws = ws;
