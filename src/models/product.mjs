import db from "../utils/db.mjs";
import { ParamError } from "../utils/util.mjs";

/**
 * 查询指定id集合的商品价格集合
 */
export async function queryProductPriceByIds ({
    productIds = []
}) {
    let sql = `select id, amount from product where id in (`, params = [];
    productIds.forEach(id => {
        sql += `?,`;
        params.push(id);
    });
    sql = sql.slice(0, -1) + ")";
    const con = await db.getConnection();
    try {
        const [ list ] = await con.query(sql, params);
        con.release();
        return list;
    } catch (err) {
        con.release();
        throw err;
    }
    
}

/**
 * 查询商品 
 */
export async function queryProducts ({
    keyword
}) {
    let sql = `select * from product where del != 1 `, params = [];
    if (keyword) {
        sql += ` && title like ? `;
        params.push("%" + keyword + "%");
    }
    sql += `order by id desc`;
    const con = await db.getConnection();
    try {
        const [ list ] = await con.query(sql, params);
        con.release();
        return list;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 创建商品 
 */
export async function createProduct ({
    title,
    img,
    amount,
    stock,
    code
}) {
    const con = await db.getConnection();
    try {
        await con.query(`BEGIN`);
        // 若果库里有相同二维码code商品，则增加库存，修改标题等信息
        const [[ queryProduct ]] = await con.query(`select * from product where code = ? && del = 0`, [ code ]);
        if (queryProduct) {
            const { id } = queryProduct;
            await con.query(`update product set stock = ?, title = ?, img = ?, amount = ? where id = ?`, [ stock, title, img, amount, id ]);
        } 
        else {
            await con.query(`insert into product (title, img, amount, stock, code) values (?, ?, ?, ?, ?)`, [title, img, amount, stock, code]);
        }

        await con.query(`commit`);
        con.release();
    } catch (err) {
        await con.query(`rollback`);
        con.release();
        throw err;
    }
}

/**
 * 更新商品 
 */
export async function updateProduct ({
    id,
    title,
    code,
    img,
    amount,
    stock
}) {
    const con = await db.getConnection();
    try {
        const [ { affectedRows } ] = await con.query(`update product set title = ?, code = ?, img = ?, amount = ?, stock = ? where id = ? && del != 1`, [title, code, img, amount, stock, id]);
        con.release();
        return affectedRows;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 删除商品 
 */
export async function removeProduct ({ id }) {
    const con = await db.getConnection();
    try {
        const [ { affectedRows } ] = await con.query(`update product set del = 1 where id = ?`, [ id ]);
        con.release();
        return affectedRows;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 根据条码查询商品 
 */
export async function getProduct ({ code }) {
    const con = await db.getConnection();
    try {
        const [ [ product ] ] = await con.query(`select * from product where del != 1 && code = ?`, [ code ]);
        con.release();
        return product || null;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 根据商品id批量查询商品
 */
export async function queryProductByIds ({ ids = [] }) {
    let sql = "", params = [];
    sql = "select * from product where id in (";
    ids.forEach(id => {
        sql += "?,";
        params.push(id);
    });
    sql = sql.slice(0, -1) + ")";
    const con = await db.getConnection();
    try {
        const [ products ] = await con.query(sql, params);
        con.release();
        return products;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 获取商品总数 
 */
export async function getProductCount () {
    const con = await db.getConnection();
    try {
        const [[ { count } ]] = await con.query("select count(*) as count from product where del != 1");
        con.release();
        return count;
    } catch (err) {
        con.release();
        throw err;
    }
}

/**
 * 返还库存 
 */
export async function refundStock (
    { products } = {
        products: [
            // { id: "商品id", stock: "返还的库存数量" }, ...
        ]
    }
) {
    if (!products) throw ParamError.of("products 参数缺失！");
    if (!Array.isArray(products)) throw ParamError.of("products 参数不是数组！");
    if (
        !products.every(item => item.id && item.stock)
    ) {
        throw ParamError.of("products 数据额结构有误！");
    }
    const con = await db.getConnection();
    try {
        let sql = "update product set stock = CASE id ", params = [], ids = [];
        products.forEach(p => {
            sql += ` WHEN ? THEN stock + ? `;
            params.push(p.id, p.stock);
            ids.push(p.id);
        });
        sql += " END where id in (" + "?,".repeat(ids.length);
        sql = sql.slice(0, -1) + ")";
        const [{ affectedRows }] = await con.query(sql, [...params, ...ids]);
        con.release();
        return affectedRows;
    } catch (err) {
        con.release();
        throw err;
    }
}