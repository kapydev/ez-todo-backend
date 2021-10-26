import {EzModel, Type} from "@ezbackend/common"

export const workspace = new EzModel("Workspace",{
    users: {
        type: Type.MANY_TO_MANY,
        target: "User",
        inverseSide: "workspaces"
    }
})