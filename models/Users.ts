import { db } from "../config";
import { STRING } from "sequelize";


export const Users = db.define("users", {
    fullName: {
        type: STRING
    },
    imageUrl: {
        type: STRING,
        defaultValue: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    email: {
        type: STRING,
        allowNull: false,
        unique: true,

    },
    password: {
        type: STRING,
        allowNull: false
    }
})
