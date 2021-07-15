import { json, ParamError } from "../utils/util.mjs";

const allowMachines = [
    "xxxx"
];

export default async function (ctx, next) {
    const authorization = ctx.req.headers["Authorization"] || ctx.req.headers["authorization"] || "";
    if (!authorization || !allowMachines.includes(authorization)) {
        return ctx.body = json(ParamError.of("机器没有授权！"));
    }
    await next();
}