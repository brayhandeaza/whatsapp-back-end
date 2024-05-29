"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsers = exports.createMessages = exports.createConversations = void 0;
const faker_1 = require("@faker-js/faker");
const models_1 = require("../models");
const createConversations = async () => {
    for (let i = 0; i < 10; i++) {
        await models_1.Conversations.create({
            participants: [
                i,
                i + 1 > 10 ? 9 : i + 1
            ],
            archivedBy: []
        });
    }
};
exports.createConversations = createConversations;
const createMessages = async () => {
    for (let i = 0; i < 10; i++) {
        await models_1.Messages.create({
            mediaUrl: faker_1.faker.image.avatar(),
            body: faker_1.faker.lorem.sentence(),
            conversationId: 1,
            userId: 1
        });
    }
};
exports.createMessages = createMessages;
const createUsers = async () => {
    for (let i = 0; i < 10; i++) {
        await models_1.Users.create({
            fullName: faker_1.faker.name.fullName(),
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password()
        });
    }
};
exports.createUsers = createUsers;
