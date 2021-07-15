import parseenv from "parseenv";
import koa from "koa";
import bodyParser from "koa-bodyparser";
import crossOrigin from "./middleware/crossOrigin.mjs";
import notfound from "./middleware/notfound.mjs";
import base from "./routers/base.mjs";
import machine from "./routers/machine.mjs";
import admin from "./routers/admin.mjs";
import requestLog from "./middleware/requestLog.mjs";
import { __dirname } from "./utils/util.mjs";

Object.assign(process.env, parseenv(__dirname(import.meta.url) + "/../env/run.env"), process.env);
const srv = new koa();

srv.use(crossOrigin);
srv.use(bodyParser());
srv.use(requestLog);
srv.use(base.routes());
srv.use(machine.routes());
srv.use(admin.routes());
srv.use(notfound);

srv.listen(process.env.SRV_PORT, () => {
    console.log(`${process.env.PROJECT_TITLE} [${process.env.RUN_MODE === "development" ? "开发模式" : "线上模式"}] 运行在${process.env.SRV_PORT}端口...`);
});