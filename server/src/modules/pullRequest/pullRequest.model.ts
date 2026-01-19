import { getModelForClass, prop } from "@typegoose/typegoose"


export class PullRequest {
    @prop({ required: true })
    public repoOwnerUsername!: string

    @prop({ required: true })
    public prAuthorUsername!: string

    @prop({ required: true })
    public prJson!: string

    @prop({ required: true, unique: true })
    public githubId!: string

}

export const pullRequestModel = getModelForClass(PullRequest, {
    schemaOptions: {
        timestamps: true,
    },
})