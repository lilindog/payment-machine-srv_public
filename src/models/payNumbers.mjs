import db from "../utils/db.mjs";
import { ParamError } from "../utils/util.mjs";

/**
 * 获取指定订单号的支付编码 
 */
export async function queryPayNumbersByOrderNumber ({ orderNumber }) {
    if (!orderNumber) return ParamError.of("参数orderNumber缺失！");
    if (!/^\d+$/.test(orderNumber)) return ParamError.of("参数orderNumber不合法！");
    const con = await db.getConnection();
    try {
        const [ payNumbers ] = await con.query("select * from pay_numbers where order_number = ?", [ orderNumber ]);
        con.release();
        return payNumbers || [];
    } catch (err) {
        con.release();
        throw err;
    }
}