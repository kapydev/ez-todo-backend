import { EzUser } from "@ezbackend/auth";
import { Type } from "@ezbackend/common";
import { todo } from './todo'
import { workspace } from './workspace'

export const user = new EzUser("User", ['google'], {
    assignedTodos: {
        type: Type.MANY_TO_MANY,
        target: "Todo",
        inverseSide: "assignees",
        nullable: true
    },
    workspaces: {
        type: Type.MANY_TO_MANY,
        target: "Workspace",
        inverseSide: "users",
        nullable: true
    }
})

user.get('/cur-user', async (req) => {
    return { user: req.user }
})

user.get('/todos', async (req) => {
    const todoRepo = todo.getRepo()
    return await todoRepo.find({
        where: [
            { creatorId: req.user.id }
        ]
    })
})