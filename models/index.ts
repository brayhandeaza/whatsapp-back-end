import { Users } from "./Users";
import { Conversations, ConversationsParticipants, ConversationsLastSeen } from "./Conversations";
import { Messages } from "./Messages";

Users.hasMany(Messages)

Conversations.hasMany(Messages)

Messages.belongsTo(Conversations)
Messages.belongsTo(Users)


Users.belongsToMany(Conversations, { through: 'user-conversation' });
Conversations.belongsToMany(Users, { through: 'user-conversation' });

ConversationsLastSeen.belongsTo(Conversations)
ConversationsLastSeen.belongsTo(Users)
Conversations.hasMany(ConversationsLastSeen)


export {
    Users,
    Conversations,
    ConversationsParticipants,
    Messages,
    ConversationsLastSeen
}