"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conversationsDataValidation_1 = require("../auth/conversationsDataValidation");
const models_1 = require("../models");
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const { pageSize, page } = await conversationsDataValidation_1.ConversationValidationQueryParams.validateAsync(req.query);
        const limit = pageSize ? +pageSize : 10;
        const offset = limit * (page ? +page - 1 : 1);
        const conversations = await models_1.Conversations.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: models_1.Users,
                    as: "users",
                    through: { attributes: [] }
                }
            ]
        });
        res.status(200).json({
            data: conversations,
            page,
            pageSize: conversations.length || 0
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const conversation = await models_1.Conversations.findOne({
            where: {
                uuid: req.params.id
            },
            include: [
                {
                    model: models_1.Users,
                    as: "users",
                    through: { attributes: [] }
                },
                {
                    model: models_1.Messages,
                    as: "messages",
                    order: [['createdAt', 'DESC']],
                }
            ]
        });
        res.status(200).json({
            data: conversation
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.get('/archived/user/:userId', async (req, res) => {
    try {
        const { userId } = await conversationsDataValidation_1.ArchivedConversationValidationQueryParams.validateAsync(req.params);
        const conversation = await models_1.Conversations.findAll({
            where: {
                archivedBy: {
                    [sequelize_1.Op.contains]: userId
                }
            },
            include: [
                {
                    model: models_1.Messages,
                    as: "messages",
                    order: [['createdAt', 'DESC']],
                    limit: 1
                },
                {
                    model: models_1.Users,
                    where: {
                        [sequelize_1.Op.not]: {
                            id: userId
                        }
                    },
                    as: "users",
                    through: { attributes: [] }
                },
                {
                    model: models_1.ConversationsLastSeen,
                    as: "lastSeens",
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    where: {
                        [sequelize_1.Op.and]: [
                            { userId: userId },
                            {
                                lastSeen: {
                                    [sequelize_1.Op.gt]: new Date()
                                }
                            }
                        ]
                    }
                }
            ]
        });
        res.status(200).json({
            data: conversation
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.get('/user/:id', async (req, res) => {
    try {
        const { pageSize, page } = await conversationsDataValidation_1.ConversationValidationQueryParams.validateAsync(req.query);
        const limit = pageSize ? +pageSize : 10;
        const offset = limit * (page ? +page - 1 : 1);
        const conversations = await models_1.Conversations.findAll({
            limit,
            offset,
            where: {
            // userId: req.params.id
            },
            include: []
        });
        res.status(200).json({
            data: conversations
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const { userId, participantId } = await conversationsDataValidation_1.ConversationValidationSchema.validateAsync(req.body);
        const conversation = await models_1.Conversations.create({});
        await models_1.ConversationsParticipants.create({
            conversationId: conversation.dataValues.id,
            userId,
        });
        await models_1.ConversationsParticipants.create({
            conversationId: conversation.dataValues.id,
            userId: participantId,
        });
        res.status(200).json({
            data: conversation
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.post('/lastSeen', async (req, res) => {
    try {
        const { userId, conversationId } = await conversationsDataValidation_1.UserConversationLastSeenValidation.validateAsync(req.body);
        const lastSeen = await models_1.ConversationsLastSeen.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    { userId },
                    { conversationId }
                ]
            }
        });
        if (!lastSeen) {
            await models_1.ConversationsLastSeen.create({
                userId,
                conversationId
            });
        }
        else {
            await lastSeen.update({
                lastSeen: new Date()
            });
        }
        res.status(200).json({
            data: lastSeen
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.patch('/:id', async (req, res) => {
    try {
        const { archivedBy } = await conversationsDataValidation_1.ConversationValidationUpdateSchema.validateAsync(req.body);
        const conversation = await models_1.Conversations.findOne({ where: { id: req.params.id } });
        if (!conversation) {
            throw new String("Conversation not found");
        }
        const idsToArchive = new Set(conversation.getDataValue("archivedBy"));
        if (idsToArchive.has(archivedBy))
            idsToArchive.delete(archivedBy);
        else
            idsToArchive.add(archivedBy);
        await conversation.update({
            archivedBy: [...idsToArchive]
        });
        res.status(200).json({
            data: conversation
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const conversation = await models_1.Conversations.findOne({ where: { id: req.params.id } });
        if (!conversation) {
            throw new String("Conversation not found");
        }
        await conversation.destroy();
        res.status(200).json({
            data: conversation
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
exports.default = router;
