import { ArchivedConversationValidationQueryParams, ConversationValidationQueryParams, ConversationValidationSchema, ConversationValidationUpdateSchema, UserConversationLastSeenValidation } from "../auth/conversationsDataValidation";
import { Conversations, ConversationsParticipants, ConversationsLastSeen, Users, Messages } from "../models";
import { Router, Request, Response } from "express";
import { Op, literal } from "sequelize";

const router: Router = Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        const { pageSize, page } = await ConversationValidationQueryParams.validateAsync(req.query)
        const limit = pageSize ? +pageSize : 10
        const offset = limit * (page ? +page - 1 : 1)

        const conversations = await Conversations.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Users,
                    as: "users",
                    through: { attributes: [] }
                }
            ]
        })

        res.status(200).json({
            data: conversations,
            page,
            pageSize: conversations.length || 0
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.get('/:id', async (req: Request, res: Response) => {
    try {
        const conversation = await Conversations.findOne({
            where: {
                uuid: req.params.id
            },
            include: [
                {
                    model: Users,
                    as: "users",
                    through: { attributes: [] }
                },
                {
                    model: Messages,
                    as: "messages",
                    order: [['createdAt', 'DESC']],

                }
            ]
        })

        res.status(200).json({
            data: conversation

        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})

router.get('/archived/user/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = await ArchivedConversationValidationQueryParams.validateAsync(req.params)

        const conversation = await Conversations.findAll({
            where: {
                archivedBy: {
                    [Op.contains]: userId
                }
            },
            include: [
                {
                    model: Messages,
                    as: "messages",
                    order: [['createdAt', 'DESC']],
                    limit: 1
                },
                {
                    model: Users,
                    where: {
                        [Op.not]: {
                            id: userId
                        }
                    },
                    as: "users",
                    through: { attributes: [] }
                },
                {
                    model: ConversationsLastSeen,
                    as: "lastSeens",
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    where: {
                        [Op.and]: [
                            { userId: userId },
                            {
                                lastSeen: {
                                    [Op.gt]: new Date()
                                }
                            }
                        ]
                    }
                }
            ]
        })

        res.status(200).json({
            data: conversation

        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.get('/user/:id', async (req: Request, res: Response) => {
    try {
        const { pageSize, page } = await ConversationValidationQueryParams.validateAsync(req.query)
        const limit = pageSize ? +pageSize : 10
        const offset = limit * (page ? +page - 1 : 1)

        const conversations = await Conversations.findAll({
            limit,
            offset,
            where: {
                // userId: req.params.id
            },
            include: [
                
            ]
        })

        res.status(200).json({
            data: conversations
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})

router.post('/', async (req: Request, res: Response) => {
    try {
        const { userId, participantId } = await ConversationValidationSchema.validateAsync(req.body)
        const conversation = await Conversations.create({})

        await ConversationsParticipants.create({
            conversationId: conversation.dataValues.id,
            userId,
        })

        await ConversationsParticipants.create({
            conversationId: conversation.dataValues.id,
            userId: participantId,
        })

        res.status(200).json({
            data: conversation
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})

router.post('/lastSeen', async (req: Request, res: Response) => {
    try {
        const { userId, conversationId } = await UserConversationLastSeenValidation.validateAsync(req.body)

        const lastSeen = await ConversationsLastSeen.findOne({
            where: {
                [Op.and]: [
                    { userId },
                    { conversationId }
                ]
            }
        },)

        if (!lastSeen) {
            await ConversationsLastSeen.create({
                userId,
                conversationId
            })

        } else {
            await lastSeen.update({
                lastSeen: new Date()
            })
        }

        res.status(200).json({
            data: lastSeen
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})

router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { archivedBy } = await ConversationValidationUpdateSchema.validateAsync(req.body)
        const conversation = await Conversations.findOne({ where: { id: req.params.id } })

        if (!conversation) {
            throw new String("Conversation not found")
        }

        const idsToArchive = new Set(conversation.getDataValue("archivedBy"))

        if (idsToArchive.has(archivedBy))
            idsToArchive.delete(archivedBy)

        else
            idsToArchive.add(archivedBy)

        await conversation.update({
            archivedBy: [...idsToArchive]
        })

        res.status(200).json({
            data: conversation
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const conversation = await Conversations.findOne({ where: { id: req.params.id } })

        if (!conversation) {
            throw new String("Conversation not found")
        }

        await conversation.destroy()

        res.status(200).json({
            data: conversation
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})

export default router