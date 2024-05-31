import { Router, Request, Response } from "express";
import { Conversations, ConversationsLastSeen, Messages, Users } from "../models";
import { UserLoginValidationSchemaUpdate, UserSearchValidationQueryParams, UserValidationQueryParams, UserValidationSchema, UserValidationSchemaUpdate, UserValidationWithLastSeenQueryParams } from "../auth/userDataValidation";
import bcrypt from "bcrypt";
import { Op, literal } from "sequelize";

const router: Router = Router()

router.get('/', async (req: Request, res: Response) => {

    try {
        const { pageSize, page, search } = await UserValidationQueryParams.validateAsync(req.query)
        const limit = pageSize ? +pageSize : 10
        const offset = limit * (page ? +page - 1 : 1)

        if (search) {
            const users = await Users.findAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                where: {
                    fullName: {
                        [Op.like]: `%${search}%`
                    }
                }
            })

            res.status(200).json({
                data: users,
                page,
                pageSize: users.length || 0
            })

        } else {
            const users = await Users.findAll({ limit, offset, order: [['createdAt', 'DESC']] })
            res.status(200).json({
                data: users,
                page,
                pageSize: users.length || 0
            })
        }

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.get('/search', async (req: Request, res: Response) => {
    try {
        const { pageSize, page, search, userId } = await UserSearchValidationQueryParams.validateAsync(req.query)
        const limit = pageSize ? +pageSize : 10
        const offset = limit * (page ? +page - 1 : 1)

        const users = await Users.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            where: {
                [Op.and]: [
                    {
                        id: {
                            [Op.not]: userId
                        }
                    },
                    {
                        fullName: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ]
            }
        })
        res.status(200).json({
            data: users,
            page,
            pageSize: users.length || 0
        })
    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { lastSeen } = await UserValidationWithLastSeenQueryParams.validateAsync(req.query)
        const user = await Users.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Conversations,
                    as: "conversations",
                    attributes: ['id', 'archivedBy'],
                    where: {
                        [Op.not]: {
                            archivedBy: {
                                [Op.contains]: 5
                            }
                        }
                    },
                    through: {
                        attributes: [],
                    },
                    include: [
                        {
                            model: ConversationsLastSeen,
                            as: "lastSeens",
                            limit: 1,
                            order: [['createdAt', 'DESC']],
                            where: {
                                [Op.and]: [
                                    { userId: req.params.id },
                                    {
                                        lastSeen: {
                                            [Op.gt]: lastSeen
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            model: Messages,
                            as: "messages",
                            order: [['createdAt', 'DESC']],
                            limit: 1
                        },
                        {
                            model: Users,
                            as: "users",
                            through: {
                                attributes: [],
                                where: {
                                    [Op.not]: { ["userId"]: req.params.id }
                                }
                            }
                        }
                    ]
                }
            ]
        })


        // where: {
        //     id: sequelize.literal(`(
        //       SELECT id FROM Addresses
        //       WHERE Addresses.UserId = User.id
        //       LIMIT 1
        //     )`)
        //   }


        res.status(200).json({
            data: user
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = await UserLoginValidationSchemaUpdate.validateAsync(req.body)
        const user = await Users.findOne({
            where: {
                email
            }
        })

        if (!user) {
            throw new String("email or password incorrect")
        }

        const match = await bcrypt.compare(password, user.getDataValue("password"))

        if (!match) {
            throw new String("email or password incorrect")
        }

        res.status(200).json({
            data: user
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.post('/', async (req: Request, res: Response) => {
    try {
        const data = await UserValidationSchema.validateAsync(req.body)
        const userExists = await Users.findOne({
            where: { email: data.email }
        })

        if (userExists) {
            throw new String("User already exists")
        }

        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(data.password, salt)

        const user = await Users.create(Object.assign({}, data, { password }))
        res.status(200).json({
            data: user
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const data = await UserValidationSchemaUpdate.validateAsync(req.body)

        if (data.password) {
            const salt = await bcrypt.genSalt(10)
            data.password = await bcrypt.hash(data.password, salt)
        }

        const user = await Users.findOne({
            where: { id: req.params.id }
        })

        if (!user) {
            throw new String("User not found")
        }

        await user.update(data)

        res.status(200).json({
            data: user
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const user = await Users.findOne({
            where: { id: req.params.id }
        })

        if (!user) {
            throw new String("User not found")
        }

        await user.destroy()

        res.status(200).json({
            data: user
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.toString()
        })
    }
})


export default router


