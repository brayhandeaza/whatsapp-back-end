"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const messagesDataValidation_1 = require("../auth/messagesDataValidation");
const models_1 = require("../models");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const { pageSize, page } = await messagesDataValidation_1.MessagesConversationValidationQueryParams.validateAsync(req.query);
        const limit = pageSize ? +pageSize : 10;
        const offset = limit * (page ? +page - 1 : 1);
        // const messages = await MessageModel.find({}, {}, { limit, skip, sort: { createdAt: -1 } }).populate("conversationId")
        const messages = await models_1.Messages.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [models_1.Conversations]
        });
        res.status(200).json({
            data: messages
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.get('/unread/conversation/:id', async (req, res) => {
    try {
        const { lastSeenDate } = await messagesDataValidation_1.UnReadMessagesConversationValidationQueryParams.validateAsync(req.query);
        const unReadMessages = await models_1.Messages.count({
            where: {
                [sequelize_1.Op.and]: [
                    { conversationId: req.params.id },
                    {
                        createdAt: {
                            [sequelize_1.Op.gt]: lastSeenDate
                        }
                    }
                ]
            }
        });
        res.status(200).json({
            data: unReadMessages
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
        const message = await models_1.Messages.findByPk(req.params.id, {
            include: [models_1.Conversations]
        });
        res.status(200).json({
            data: message
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.get('/conversation/:id', async (req, res) => {
    try {
        const { pageSize, page } = await messagesDataValidation_1.MessagesConversationValidationQueryParams.validateAsync(req.query);
        const limit = pageSize ? +pageSize : 10;
        const offset = limit * (page ? +page - 1 : 1);
        const messages = await models_1.Messages.findAll({
            where: { conversationId: req.params.id },
            limit,
            offset,
            order: [['createdAt', 'ASC']],
        });
        res.status(200).json({
            data: messages
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.get('/unread/conversation/:id', async (req, res) => {
    try {
        const unReadMessages = await models_1.Messages.count({
            where: {
                [sequelize_1.Op.and]: [
                    { conversationId: req.params.id },
                    { read: false }
                ]
            }
        });
        res.status(200).json({
            data: unReadMessages
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
        const data = await messagesDataValidation_1.MessageValidationSchema.validateAsync(req.body);
        const message = await models_1.Messages.create(data);
        const conversation = await models_1.Conversations.findByPk(data.conversationId);
        await conversation?.update({
            unReadMessagesCount: conversation.getDataValue("unReadMessagesCount") + 1
        });
        console.log(conversation?.getDataValue("unReadMessagesCount"));
        res.status(200).json({
            data: message
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
        const data = await messagesDataValidation_1.MessageUpdateValidationSchema.validateAsync(req.body);
        const message = await models_1.Messages.findByPk(req.params.id);
        if (!message) {
            throw new String("Message not found");
        }
        await message.update(data);
        res.status(200).json({
            data: message
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
        const message = await models_1.Messages.findByPk(req.params.id);
        if (!message) {
            throw new String("Message not found");
        }
        await message.destroy();
        res.status(200).json({
            data: message
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
exports.default = router;
