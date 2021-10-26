import { EzBackend, EzModel, Type } from '@ezbackend/common'
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

app.addApp(user, {prefix: 'user'})
app.addApp(todo, {prefix: 'todo'})
app.addApp(workspace, {prefix: 'workspace'})

app.start({
    auth: {
        successRedirectURL: "http://localhost:5000"
    },
    orm: {
        type: "better-sqlite3",
        database: "db.sqlite",
        synchronize: true
    }
})