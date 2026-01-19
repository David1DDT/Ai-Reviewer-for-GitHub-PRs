import { getModelForClass, prop } from "@typegoose/typegoose"


export class User {
    @prop({ required: true, unique: true })
    public githubId!: string

    @prop({ required: true, unique: true })
    public username!: string

    @prop()
    public email!: string

    @prop()
    public avatarUrl!: string

    @prop()
    public accessToken?: string

}

export const userModel = getModelForClass(User, {
    schemaOptions: {
        timestamps: true,
    },
})