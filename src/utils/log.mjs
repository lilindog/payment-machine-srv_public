import log4js from "log4js";
import parseenv from "parseenv";
import { __dirname } from "./util.mjs";

const { RUN_MODE } = parseenv(__dirname(import.meta.url) + "../../env/run.env");

log4js.configure({
    appenders: { 
        dateFile: { type: "dateFile", filename: __dirname(import.meta.url) + "../../log/log.log" },
        stdout: { type: "stdout" } 
    },
    categories: { 
        default: { appenders: ["dateFile", "stdout"], level: "info" },
        production: { appenders: ["dateFile"], level: "info" }
    }
});

const 
    devLogger = log4js.getLogger("default"),
    proLogger = log4js.getLogger("production");

const logger = RUN_MODE === "development" ? devLogger : RUN_MODE === "production" ? proLogger : {};

export default logger;