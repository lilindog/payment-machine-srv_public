import db from "../utils/db.mjs";
import { ParamError } from "../utils/util.mjs";

/**
 * 插入退款记录 
 */
export async function insertRefund ({
    orderNumber,
    msg
}) {
    if (!orderNumber || typeof orderNumber !== "string") throw ParamError.of("orderNumber 参数缺失或者类型错误！");
    if (!msg || typeof msg !== "string") throw ParamError.of("msg 参数缺失或者类型错误！");
    const con = await db.getConnection();
    try {
        let sql = "insert into refund (order_number, msg) values (?, ?)", params = [ orderNumber, msg ];
        const [ { affectedRows } ] = await con.query(sql, params);
        con.release();
        return affectedRows;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 查询指定订单的退款记录 
 */
export async function getRefundLog ({ orderNumber }) {
    if (!orderNumber || typeof orderNumber !== "string") throw ParamError.of("orderNumber 参数缺失或者类型错误！");
    const con = await db.getConnection();
    try {
        let sql = "select * from refund where order_number = ?", params = [ orderNumber ];
        const [ logs ] = await con.query(sql, params);
        con.release();
        return logs;
    } catch (err) {
        con.release();
        throw err;
    }
}