import Router from "koa-router";
import koaSend from "koa-send";
import { __dirname } from "../utils/util.mjs";

const router = new Router();
export default router;

/**
 * 静态文件服务
 */
router.get("/static/(.*)", async ctx => {
    try {
        await koaSend(ctx, ctx.params["0"], { root: __dirname(import.meta.url) + "../../" + process.env.SRV_UPLOAD_DIR });
    } catch (err) {
        ctx.body = "没有找到：" + ctx.params["0"];
    }
});

/**
 * 文档
 */
router.get("/doc(.*)", async ctx => {
    try {
        if (!ctx.params["0"].startsWith("/")) {
            ctx.res.writeHead(301, {
                "Location": "/doc/"
            });
        }
        await koaSend(ctx, ctx.params["0"].slice(1) || "index.html", { root: __dirname(import.meta.url) + "../../doc" });
    } catch (err) {
        ctx.body = "没有找到：" + ctx.params["0"];
    }
});