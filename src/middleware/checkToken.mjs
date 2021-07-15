import jwt from "jsonwebtoken";
import { json, ParamError } from "../utils/util.mjs";

/**
 * token检测
 * 
 * @param {Array<String>} ignorePaths 需要忽略的url路径
 */
export default function (ignorePaths = []) {
    return async function (ctx, next) {
        if (ignorePaths.includes(ctx.path)) return await next();
        const tokenStr = ctx.req.headers["Authorization"] || ctx.req.headers["authorization"];
        const error = () => json(ParamError.of("没有api请求授权"), 403);
        if (!tokenStr) return ctx.body = error();
        let token = null;
        try {
            token = jwt.verify(tokenStr, process.env.SRV_TOKEN_SECRET);
        } catch (err) {
            return ctx.body = error();
        }
        ctx.token = token;
        await next();
    };
}