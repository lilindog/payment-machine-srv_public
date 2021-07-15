import logger from "./log.mjs";
import path from "path";
import os from "os";

/**
 * 统一处理返回数据
 * 
 * @param  {any} data 区分Error实例或其他值
 * @param  {Number} status
 * @return {Object}
 */
export function json (data, status = 0) {
    if (data instanceof Error) {
        logger.error(data.message + "\n" + data.stack);
        const message = process.env.RUN_MODE === "development" ? data.message : data instanceof ParamError ? data.message : "服务器在划水，请稍后再试试呢！";
        return {
            success: false,
            status,
            message,
            data: null
        };
    } else {
        return {
            success: true,
            status: 0,
            message: "",
            data
        };
    }
}

/**
 * 生成订单号 
 */
export function orderNumber () {
    return getDate("", "", "") + ((Math.random() * 100000000) | 0);
}

/**
 * 生成支付编号
 */
export function payNumber () {
    return "PAY" + getDate("", "", "") + ((Math.random() * 100000000) | 0);
}

/**
 * 获取日期 
 */
export function getDate (dateSpacing = "-", centerSpacing = " ", timeSpacing = ":") {
    const d = new Date;
    let str = "";
    ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds"].forEach((k, i) => {
        let v = d[k]();
        if (k === "getMonth") str += v + 1 < 10 ? "0" + (v + 1) : v + 1;
        else str += v < 10 ? "0" + v : v;
        if (i < 2) str += dateSpacing;
        else if (i > 2) str += timeSpacing;
        else str += centerSpacing;
    });
    return str.slice(0, -1);
}

/**
 * 参数错误类 
 */
export class ParamError extends Error {
    static of (message) {
        return new ParamError(message);
    }
    constructor (message) {
        super(message);
    }
}

/**
 * 睡眠函数 
 */
export async function sleep (ms = 1000) {
    return new Promise(r => {
        setTimeout(r, ms);
    });
}

/**
 * 替代cjs模式下的__dirname
 */
export function __dirname (importUrl) {
    importUrl = path.dirname(importUrl);
    importUrl = os.platform() === "win32" ? importUrl.replace("file:///", "") : importUrl.replace("file:", "");
    return importUrl + "/";
}