import alipaysdk from "alipay-sdk";
import parseenv from "parseenv";
import fs from "fs";
import { sleep, __dirname } from "./util.mjs";

const { ALIPAY_APPID } = parseenv(__dirname(import.meta.url) + "../../env/run.env");
const { default: AlipaySdk } = alipaysdk;

const alipaySdk = new AlipaySdk({
    appId: ALIPAY_APPID,
    privateKey: fs.readFileSync(__dirname(import.meta.url) + "../../app_private.key", "ascii"),
    timeout: 20000 // 网关超时时间
});

const defaultParams = {
    scene: "bar_code", // 支付场景，条码付场景固定为 bar_code
    subject: "收银机订单" // 商品的标题/交易标题/订单标题/订单关键字等。不可使用特殊字符，如 /,=,& 等。
    // store_id: "01", // 商户门店编号
    // timeout_express: 30 // 交易超时时间
};

/**
 * 发起支付 
 */
export async function pay (data = {
    out_trade_no: "", // 商户订单号
    auth_code: "", // 付款码条码
    total_amount: 0 //订单金额
}) {
    Object.assign(data, defaultParams);
    return await alipaySdk.exec("alipay.trade.pay", {
        bizContent: data
    });
}

/**
 * 查询支付状态 
 */
export async function query (data = { out_trade_no: "" }) {
    Object.assign(data, defaultParams);
    return await alipaySdk.exec("alipay.trade.query", {
        bizContent: data
    });
}

/**
 * 取消订单（已支付会退款） 
 */
export async function cancel (data = { out_trade_no: "" }) {
    Object.assign(data, defaultParams);
    return await alipaySdk.exec("alipay.trade.cancel", {
        bizContent: data
    });
}

/**
 * 退款, 我这里没有部分退款，都是能全部退款
 */
export async function refund (data = { 
    // 支付编号
    out_trade_no: "", 
    // 退款金额
    refund_amount: 0 
}) {
    return await alipaySdk.exec("alipay.trade.refund", {
        bizContent: Object.assign(data, defaultParams)
    });
}

/**
 * 发起支付一系列（包含失败轮询，轮询超时取消支付订单） 
 * 
 * @return {Boolean|Error} 返回布尔true（不会返回false）或Error实例， true代表成功，Error代表失败(err.message 有失败文案)
 */
export default async function main (data = {
    out_trade_no: "",
    auth_code: "",
    total_amount: 0
}) {
    let count = 0;

    // 支付
    console.log("发起支付>>");
    const r = await pay(data);
    console.log(r.code);
    if (r.code === "10000") return true;
    else if (r.code === "40004") return new Error(r.subMsg);
    else if (r.code === "20000") return new Error(r.subMsg);

    // 支付返回等待，开始轮询, 轮询超时未支付进入下一步撤销
    console.log("进入轮询>>");
    while (true) {
        await sleep(2000);
        count++;
        const { tradeStatus } = await query({ out_trade_no: data.out_trade_no });
        console.log(tradeStatus);
        if (tradeStatus === "TRADE_SUCCESS") return true;
        else if (tradeStatus === "TRADE_CLOSE") return new Error("订单也撤销，或关闭");
        if (tradeStatus === "WAIT_BUYER_PAY" && count >= 10) {
            count = 0;
            break;
        }
    }

    // 超时并未成功，撤销支付订单
    console.log("进入撤销>>");
    while (true) {
        await sleep(2000);
        const { retryFlag, action } = await cancel({ out_trade_no: data.out_trade_no });
        console.log(retryFlag, action);
        if (retryFlag === "N") return new Error(`交易超时, ${action === "close" ? "交易关闭无退款" : "交易关闭且已退款"}`);
        else if (count === 3) return new Error("支付超时退款超次数未成功！");
    }
}