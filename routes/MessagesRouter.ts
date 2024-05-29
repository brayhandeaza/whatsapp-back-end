import { Op } from "sequelize";
import { MessageUpdateValidationSchema, MessageValidationSchema, MessagesConversationValidationQueryParams, UnReadMessagesConversationValidationQueryParams } from "../auth/messagesDataValidation";
import { Conversations, Messages, Users } from "../models";
import { Router, Request, Response } from "express";


const router: Router = Router()


router.get('/', async (req: Request, res: Response) => {
    try {
        const { pageSize, page } = await MessagesConversationValidationQueryParams.validateAsync(req.query)
        const limit = pageSize ? +pageSize : 10
        const offset = limit * (page ? +page - 1 : 1)

        // const messages = await MessageModel.find({}, {}, { limit, skip, sort: { createdAt: -1 } }).populate("conversationId")
        const messages = await Messages.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [Conversations]
        })

        res.status(200).json({
            data: messages
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.get('/unread/conversation/:id', async (req: Request, res: Response) => {
    try {
        const { lastSeenDate } = await UnReadMessagesConversationValidationQueryParams.validateAsync(req.query)

        const unReadMessages = await Messages.count({
            where: {
                [Op.and]: [
                    { conversationId: req.params.id },
                    {
                        createdAt: {
                            [Op.gt]: lastSeenDate
                        }
                    }
                ]
            }
        })

        res.status(200).json({
            data: unReadMessages
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })

    }
})



router.get('/:id', async (req: Request, res: Response) => {
    try {
        const message = await Messages.findByPk(req.params.id, {
            include: [Conversations]
        })

        res.status(200).json({
            data: message
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.get('/conversation/:id', async (req: Request, res: Response) => {
    try {
        const { pageSize, page } = await MessagesConversationValidationQueryParams.validateAsync(req.query)
        const limit = pageSize ? +pageSize : 10
        const offset = limit * (page ? +page - 1 : 1)


        const messages = await Messages.findAll({
            where: { conversationId: req.params.id },
            limit,
            offset,
            order: [['createdAt', 'ASC']],
        })


        res.status(200).json({
            data: messages
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.get('/unread/conversation/:id', async (req: Request, res: Response) => {
    try {
        const unReadMessages = await Messages.count({
            where: {
                [Op.and]: [
                    { conversationId: req.params.id },
                    { read: false }
                ]
            }
        })

        res.status(200).json({
            data: unReadMessages
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.post('/', async (req: Request, res: Response) => {
    try {
        const data = await MessageValidationSchema.validateAsync(req.body)

        const message = await Messages.create(data)

        const conversation = await Conversations.findByPk(data.conversationId)
        await conversation?.update({
            unReadMessagesCount: conversation.getDataValue("unReadMessagesCount") + 1
        })

        console.log(conversation?.getDataValue("unReadMessagesCount"));


        res.status(200).json({
            data: message
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const data = await MessageUpdateValidationSchema.validateAsync(req.body)
        const message = await Messages.findByPk(req.params.id)

        if (!message) {
            throw new String("Message not found")
        }

        await message.update(data)

        res.status(200).json({
            data: message
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const message = await Messages.findByPk(req.params.id)

        if (!message) {
            throw new String("Message not found")
        }

        await message.destroy()

        res.status(200).json({
            data: message
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


export default router