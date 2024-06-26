import Joi from "joi";

export const ConversationValidationSchema = Joi.object({
    participantId: Joi.number().integer().required(),
    userId: Joi.number().integer().required()
})

export const ConversationValidationUpdateSchema = Joi.object({
    archivedBy: Joi.number().integer().required()
})


export const ConversationValidationQueryParams = Joi.object({
    page: Joi.number().integer().required(),
    pageSize: Joi.number().integer().required(),
})

export const ArchivedConversationValidationQueryParams = Joi.object({
    userId: Joi.number().integer().required()
})

export const UserConversationValidationQueryParams = Joi.object({
    page: Joi.number().integer().required(),
    pageSize: Joi.number().integer().required(),
})

export const UserConversationLastSeenValidation = Joi.object({
    userId: Joi.number().integer().required(),
    conversationId: Joi.number().integer().required(),
})