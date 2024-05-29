import Joi from "joi";

export const UserValidationSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const UserValidationSchemaUpdate = Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional()
})

export const UserValidationQueryParams = Joi.object({
    page: Joi.number().integer().required(),
    pageSize: Joi.number().integer().required(),
    userId: Joi.number().integer().required(),
    search: Joi.string().optional()
})

export const UserSearchValidationQueryParams = Joi.object({
    page: Joi.number().integer().required(),
    pageSize: Joi.number().integer().required(),
    userId: Joi.number().integer().required(),
    search: Joi.string().required()
})

export const UserValidationWithLastSeenQueryParams = Joi.object({
    lastSeen: Joi.date().required(),
})

