import { EzBackend, EzBackendOpts } from '@ezbackend/common'
import { EzOpenAPI } from "@ezbackend/openapi";
import { EzDbUI } from "@ezbackend/db-ui";
import { EzCors } from "@ezbackend/cors";
import { user, todo, workspace } from './models'
import { EzAuth } from '@ezbackend/auth';

const app = new EzBackend()

//---Plugins---
//Everything is an ezapp in ezbackend
app.addApp(new EzOpenAPI())
app.addApp(new EzDbUI())
app.addApp(new EzCors())
app.addApp(new EzAuth())
//---Plugins---

app.addApp(user, { prefix: 'user' })
app.addApp(todo, { prefix: 'todo' })
app.addApp(workspace, { prefix: 'workspace' })

let ormConfig = undefined

if (process.env.DATABASE_URL) {
    ormConfig = {
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        extra: {
            ssl: {
                rejectUnauthorized: false
            }
        },
    }
}

app.start({
    address: "0.0.0.0",
    auth: {
        successRedirectURL: "http://localhost:5000"
    },
    orm: ormConfig ? ormConfig : {
        type: "better-sqlite3",
        synchronize: true,
        database: "db.sqlite",
        // database: ":memory:",
        // logging: true
    }
})