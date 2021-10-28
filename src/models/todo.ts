import { EzModel, Type } from "@ezbackend/common";

export enum PriorityEnum {
    LOW = 'low',
    MED = 'med',
    HIGH = 'high'
}

export const todo = new EzModel("Todo", {
    summary: {
        type: Type.VARCHAR,
        default: ""
    },
    desc: {
        type: Type.VARCHAR,
        default: ""
    },
    priority: {
        type: Type.ENUM,
        enum: PriorityEnum,
        default: PriorityEnum.MED
    },
    creator: {
        type: Type.MANY_TO_ONE,
        target: "User",
        joinColumn: true
    },
    creatorId: Type.INT,
    
    assignees: {
        type: Type.MANY_TO_MANY,
        target: "User",
        inverseSide: "assignedTodos",
        joinTable: true
    },
    workspace: {
        type: Type.MANY_TO_ONE,
        target: "Workspace",
        eager: true,
        inverseSide: "todos"
    },
    workspaceId: Type.INT,
    deadline: {
        type: Type.DATE,
        nullable: true
    },
    completed: {
        type: Type.BOOL,
        default: false
    }

})