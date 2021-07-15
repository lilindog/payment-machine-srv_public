import db from "../utils/db.mjs";

/**
 * 查找指定用户名用户信息
 * 
 * @param {String} name
 */
export async function getUserByName (name = "") {
    const connection = await db.getConnection();
    try {
        const [[ res ]] = await connection.query("select * from user where name = ?", [ name ]);
        connection.release();
        return res;
    } catch (err) {
        connection.release();
        throw err;
    }
}