import db from "../utils/db.mjs";
import { ParamError } from "../utils/util.mjs";
import orderConst from "../utils/orderStatusConstant.mjs";

/**
 * 创建订单 
 */
export async function createOrder ({
    orderNumber,
    payAmount,
    createDate, 
    orderStatus,
    products
}) {
    // 开启事务
    // 检查库存
    // 先生成订单，获得定订单id，
    // 再按照订单id，插入商品id到订单商品详情表
    // 结束事务
    const con = await db.getConnection();
    try {
        await con.query(`begin`);
        
        // 检查库存
        let sql = "", params = [];
        sql = "select * from product where id in (";
        products.forEach(({ id }) => {
            sql += "?,";
            params.push(id);
        });
        sql = sql.slice(0, -1) + ")";
        const [ queryProducts ] = await con.query(sql, params);
        for (let i = 0; i < queryProducts.length; i++) {
            const item = products[i], prod = queryProducts[i];
            if (prod.del !== 0) throw ParamError.of(`商品"${prod.title}"已下架！`);
            if (prod.stock < item.count) throw ParamError.of(`商品"${prod.title}"库存不足！`);
        }
        // 插入订单
        await con.query(`insert into orders (order_number, status, pay_amount, create_date) values (?, ?, ?, ?)`, [ orderNumber, orderStatus, payAmount, createDate ]);
        // 获取订单id
        const [[{ orderId }]] = await con.query(`select last_insert_id() as "orderId"`);
        // 插入订单详情
        sql = `insert into order_products (order_id, product_id, count, pay_amount) values `;
        params = [];
        products.forEach(({ id, count, payAmount: amount }) => {
            sql += `(?, ?, ?, ?),`;
            params.push(orderId, id, count, amount);
        });
        await con.query(sql.slice(0, -1), params);
        // 减产品库存
        for (let { id, count } of products) {
            await con.query("update product set stock = stock - ? where id = ?", [ count, id ]);
        }
    } catch (err) {
        con.query(`rollback`);
        con.release();
        throw err;
    }
    con.query(`commit`);
    con.release();
}

/**
 * 查询订单 
 */
export async function queryOrders ({
    status,
    page = 1,
    limit = 10,
    orderNumber = ""
}) {
    const con = await db.getConnection();
    try {
        
        let sql = "", params = [], rowCount = 0, list = [];

        sql = `select sql_calc_found_rows * from orders `;
        if (status) {
            sql += ` where status = ? `;
            params.push(status);
            if (orderNumber) {
                sql += " && order_number like ? ";
                params.push("%" + orderNumber + "%");
            }
        } 
        else if (orderNumber) {
            sql += " where order_number like ? ";
            params.push("%" + orderNumber + "%");
        }
        sql += ` order by id desc limit ?, ?`;
        params.push((page - 1) * limit, Number(limit));
        
        [ list ] = await con.query(sql, params);
        [[ { rowCount } ]] = await con.query("select found_rows() as rowCount");

        let products = [];
        if (list && list.length > 0) {
            sql = "select * from (select * from order_products where order_id in (";
            params = [];
            list.forEach(({ id }) => {
                sql += "?,";
                params.push(id);
            });
            sql = sql.slice(0, -1);
            sql += ")) as order_products inner join product on product.id = order_products.product_id";
            [ products ] = await con.query(sql, params);
        }

        con.release();
        return { list, rowCount, products };
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 查询指定订单号的订单 
 */
export async function getOrderByOrderNumber ({ orderNumber }) {
    const con = await db.getConnection();
    try {
        const [[ order ]] = await con.query("select * from orders where order_number = ?", [ orderNumber ]);
        con.release();
        return order;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 设置订单状态 
 */
export async function updateOrderStatus ({ orderNumber, status, payDate }) {
    const con = await db.getConnection();
    try {
        let sql = "update orders set status = ? ", params = [ status ];
        if (payDate) {
            sql += ", pay_date = ? ";
            params.push(payDate);
        }
        sql += "where order_number = ?";
        params.push(orderNumber);
        const [ { affectedRows } ] = await con.query(sql, params);
        con.release();
        return affectedRows;
    } catch (err) {
        con.release();
        throw err; 
    }
}

/**
 * 插入支付编号 
 */
export async function addPayNumber ({ orderNumber, payNumber }) {
    const con = await db.getConnection();
    try {
        await con.query("insert into pay_numbers (order_number, pay_number) values (?, ?)", [ orderNumber, payNumber ]);
        con.release();
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 获取订单的支付记录 
 */
export async function getPaylog ({ orderNumber }) {
    const con = await db.getConnection();
    try {
        const [ result ] = await con.query("select * from pay_numbers where order_number = ? ", [ orderNumber ]);
        con.release();
        return result;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 设置支付状态 
 */
export async function updatePayNumberStatus ({ payNumber, msg }) {
    const con = await db.getConnection();
    try {
        const [ { affectedRows } ] = await con.query("update pay_numbers set msg = ? where pay_number = ?", [ msg, payNumber ]);
        con.release();
        return affectedRows;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 查询订单总数 
 */
export async function getOrderCount () {
    const con = await db.getConnection();
    try {
        const [[ { count } ]] = await con.query("select count(*) count from orders");
        con.release();
        return count;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 查询订订单成交总金额
 */
export async function getTotalTransactionAmount () {
    const con = await db.getConnection();
    try {
        const [[ { total } ]] = await con.query("select sum(pay_amount) as total from orders where status = ?", [ orderConst["已支付"] ]);
        con.release();
        return total || 0;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 查询未支付订单数量
 */
export async function getUnpaidOrderCount () {
    const con = await db.getConnection();
    try {
        const [[ { count } ]] = await con.query("select count(*) count from orders where status = ?", [ orderConst["未支付"] ]);
        con.release();
        return count;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 查询指定订单id的购买商品 
 */
export async function getProductsByOrderId ({ orderId }) {
    const con = await db.getConnection();
    try {
        let 
            sql = `
            select * from (select * from order_products where order_id = ?) as order_products 
            inner join product on product.id = order_products.product_id;
            `,
            params = [ orderId ];
        const [ products ] = await con.query(sql, params);
        con.release();
        return products;
    } catch (err) {
        con.release();
        throw err;
    }
}