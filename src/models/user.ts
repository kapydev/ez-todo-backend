import { EzUser } from "@ezbackend/auth";
import { Type } from "@ezbackend/common";
import { todo } from './todo'
import { workspace } from './workspace'

import Boom from "@hapi/boom"

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
        nullable: true,
        eager: true
    }
})

const checkLoggedIn = async (req) => {
    if (!req.user) {
        throw Boom.unauthorized()
    }
}

user.post('/create-workspace', { preHandler: checkLoggedIn },
    async (req) => {
        const workspaceRepo = workspace.getRepo()
        const newWorkspace = workspaceRepo.create()
        newWorkspace.users = [{ id: req.user.id }]
        await workspaceRepo.save(newWorkspace)
        return newWorkspace
    }
)

user.get('/workspaces', { preHandler: checkLoggedIn },
    async (req) => {
        const workspaceRepo = workspace.getRepo()
        return await workspaceRepo
            .createQueryBuilder('workspace')
            .leftJoin("workspace.users", "user", "user.id = :userId", { userId: req.user.id })
            .getMany()
    })

user.get('/cur-user',
    async (req) => {
        return { user: req.user }
    })



user.get('/todos', { preHandler: checkLoggedIn },
    async (req) => {
        //URGENT TODO: Prevent double query to reduce chance of race conditions
        const todoRepo = todo.getRepo()

        const workspaceRepo = workspace.getRepo()
        const userWorkspaces = await workspaceRepo
            .createQueryBuilder("workspace")
            .innerJoin("workspace.users", "user")
            .where("user.id = :userId", { userId: req.user!.id })
            .getMany()

        const workspaceIds = userWorkspaces.map(workspace => workspace.id)

        const userTodos = await todoRepo
            .createQueryBuilder('todo')
            .innerJoinAndSelect("todo.workspace", "workspace")
            .where("workspace.id IN (:...workspaceIds)", { workspaceIds })
            .getMany()

        return userTodos
    })