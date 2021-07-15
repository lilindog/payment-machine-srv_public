export default async function (ctx, next) {
    const reqHeader = ctx.req.headers;
    ctx.res.setHeader("Access-Control-Allow-Origin", reqHeader.referer ? reqHeader.referer.slice(0, -1) : reqHeader.host ?? "*");
    ctx.res.setHeader("Access-Control-Allow-Credentials", "true");
    ctx.res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    ctx.res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
    await next();
}