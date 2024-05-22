import { faker } from '@faker-js/faker';
import { Conversations, Messages, Users } from "../models";

export const createConversations = async () => {
    for (let i = 0; i < 10; i++) {
        await Conversations.create({
            participants: [
                i,
                i + 1 > 10 ? 9 : i + 1
            ],
            archivedBy: []
        })
    }
}

export const createMessages = async () => {
    for (let i = 0; i < 10; i++) {
        await Messages.create({
            mediaUrl: faker.image.avatar(),
            body: faker.lorem.sentence(),
            conversationId: 1,
            userId: 1
        })
    }
}


export const createUsers = async () => {
    for (let i = 0; i < 10; i++) {
        await Users.create({
            fullName: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        })
    }
}


