import logger from "../utils/log.mjs";

export default async function (ctx, next) {
    const 
        path = ctx.path,
        method = ctx.request.method,
        body = ctx.request.body || {},
        query = ctx.query || {};
    logger.info(
        `${method} ${path} 请求参数：\n` +
        `json:\n` +
        `${JSON.stringify(body, null, 4)}\n` +
        `query:\n` +
        `${JSON.stringify(query, null, 4)}` 
    );
    await next();
}