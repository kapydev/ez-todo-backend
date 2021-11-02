import { EzModel, Type } from "@ezbackend/common"

export const workspace = new EzModel("Workspace", {
    users: {
        type: Type.MANY_TO_MANY,
        target: "User",
        inverseSide: "workspaces",
        joinTable: true
    },
    name: {
        type: Type.VARCHAR,
        default: "My Workspace"
    },
    todos: {
        type: Type.ONE_TO_MANY,
        target: "Todo",
        onDelete: "CASCADE",
        inverseSide: "workspace"
    }
})

//URGENT TODO: Add security rule such that only users in the workspace can access the values
workspace.get('/:workspaceId/users', async (req) => {
    const workspaceRepo = workspace.getRepo()
    const curWorkspace = await workspaceRepo.findOne(
        req.params['workspaceId'],
        {
            relations: ['users']
        })
    return curWorkspace
})

workspace.post('/:workspaceId/add-user/:userId', async (req) => {
    //TODO: Make into single query
    const workspaceRepo = workspace.getRepo()
    const curWorkspace = await workspaceRepo.findOne(
        req.params['workspaceId'],
        {
            relations: ['users']
        })
    curWorkspace.users = [
        ...curWorkspace.users,
        {
            id: req.params['userId']
        }
    ]
    await workspaceRepo.save(curWorkspace)
    return curWorkspace
})