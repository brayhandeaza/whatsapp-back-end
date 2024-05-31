"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const userDataValidation_1 = require("../auth/userDataValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const { pageSize, page, search } = await userDataValidation_1.UserValidationQueryParams.validateAsync(req.query);
        const limit = pageSize ? +pageSize : 10;
        const offset = limit * (page ? +page - 1 : 1);
        if (search) {
            const users = await models_1.Users.findAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                where: {
                    fullName: {
                        [sequelize_1.Op.like]: `%${search}%`
                    }
                }
            });
            res.status(200).json({
                data: users,
                page,
                pageSize: users.length || 0
            });
        }
        else {
            const users = await models_1.Users.findAll({ limit, offset, order: [['createdAt', 'DESC']] });
            res.status(200).json({
                data: users,
                page,
                pageSize: users.length || 0
            });
        }
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.get('/search', async (req, res) => {
    try {
        const { pageSize, page, search, userId } = await userDataValidation_1.UserSearchValidationQueryParams.validateAsync(req.query);
        const limit = pageSize ? +pageSize : 10;
        const offset = limit * (page ? +page - 1 : 1);
        const users = await models_1.Users.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            where: {
                [sequelize_1.Op.and]: [
                    {
                        id: {
                            [sequelize_1.Op.not]: userId
                        }
                    },
                    {
                        fullName: {
                            [sequelize_1.Op.like]: `%${search}%`
                        }
                    }
                ]
            }
        });
        res.status(200).json({
            data: users,
            page,
            pageSize: users.length || 0
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
        const { lastSeen } = await userDataValidation_1.UserValidationWithLastSeenQueryParams.validateAsync(req.query);
        const user = await models_1.Users.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: models_1.Conversations,
                    as: "conversations",
                    attributes: ['id', 'archivedBy'],
                    through: {
                        attributes: [],
                    },
                    include: [
                        {
                            model: models_1.ConversationsLastSeen,
                            as: "lastSeens",
                            limit: 1,
                            order: [['createdAt', 'DESC']],
                            where: {
                                [sequelize_1.Op.and]: [
                                    { userId: req.params.id },
                                    {
                                        lastSeen: {
                                            [sequelize_1.Op.gt]: lastSeen
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            model: models_1.Messages,
                            as: "messages",
                            order: [['createdAt', 'DESC']],
                            limit: 1
                        },
                        {
                            model: models_1.Users,
                            as: "users",
                            through: {
                                attributes: [],
                                where: {
                                    [sequelize_1.Op.not]: { ["userId"]: req.params.id }
                                }
                            }
                        }
                    ]
                }
            ]
        });
        // where: {
        //     id: sequelize.literal(`(
        //       SELECT id FROM Addresses
        //       WHERE Addresses.UserId = User.id
        //       LIMIT 1
        //     )`)
        //   }
        res.status(200).json({
            data: user
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = await userDataValidation_1.UserLoginValidationSchemaUpdate.validateAsync(req.body);
        const user = await models_1.Users.findOne({
            where: {
                email
            }
        });
        if (!user) {
            throw new String("email or password incorrect");
        }
        const match = await bcrypt_1.default.compare(password, user.getDataValue("password"));
        if (!match) {
            throw new String("email or password incorrect");
        }
        res.status(200).json({
            data: user
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
        const data = await userDataValidation_1.UserValidationSchema.validateAsync(req.body);
        const userExists = await models_1.Users.findOne({
            where: { email: data.email }
        });
        if (userExists) {
            throw new String("User already exists");
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const password = await bcrypt_1.default.hash(data.password, salt);
        const user = await models_1.Users.create(Object.assign({}, data, { password }));
        res.status(200).json({
            data: user
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
        const data = await userDataValidation_1.UserValidationSchemaUpdate.validateAsync(req.body);
        if (data.password) {
            const salt = await bcrypt_1.default.genSalt(10);
            data.password = await bcrypt_1.default.hash(data.password, salt);
        }
        const user = await models_1.Users.findOne({
            where: { id: req.params.id }
        });
        if (!user) {
            throw new String("User not found");
        }
        await user.update(data);
        res.status(200).json({
            data: user
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
        const user = await models_1.Users.findOne({
            where: { id: req.params.id }
        });
        if (!user) {
            throw new String("User not found");
        }
        await user.destroy();
        res.status(200).json({
            data: user
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.toString()
        });
    }
});
exports.default = router;
