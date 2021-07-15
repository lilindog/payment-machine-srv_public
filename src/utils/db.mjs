import mysql from "mysql2/promise";
import parseenv from "parseenv";
import { __dirname } from "./util.mjs";

const cfg = parseenv(__dirname(import.meta.url) + "../../env/run.env");
cfg.RUN_MODE === "development" && console.log("db pool 初始化...");

let db = mysql.createPool({
    connectionLimit : 10,
    host            : cfg.DB_HOST,
    user            : cfg.DB_USER,
    password        : String(cfg.DB_PASS),
    database        : cfg.DB_NAME
});

export default db;