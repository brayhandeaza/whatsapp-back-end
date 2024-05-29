import Joi from "joi";


export const MessagesConversationValidationQueryParams = Joi.object({
    page: Joi.number().integer().required(),
    pageSize: Joi.number().integer().required(),
})

export const UnReadMessagesConversationValidationQueryParams = Joi.object({
    lastSeenDate: Joi.date().required(),
})


export const MessageValidationSchema = Joi.object({
    body: Joi.string().optional(),
    mediaUrl: Joi.string().optional(),
    conversationId: Joi.number().integer().required(),
    userId: Joi.number().integer().required()
})

export const MessageUpdateValidationSchema = Joi.object({
    body: Joi.string().optional(),
    mediaUrl: Joi.string().optional(),
})


