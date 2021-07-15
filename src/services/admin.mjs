import Captcha from "captcha";
import jwt from "jsonwebtoken";
import Const from "../utils/orderStatusConstant.mjs";
import { ParamError, __dirname } from "../utils/util.mjs";
import multiparty from "multiparty";
import { basename } from "path";
import { 
    getUserByName 
} from "../models/user.mjs";
import { 
    queryProducts as _queryProducts,
    createProduct as _createProduct,
    updateProduct as _updateProduct,
    removeProduct as _removeProduct,
    getProductCount,
    refundStock
} from "../models/product.mjs";
import { 
    queryOrders as _queryOrders,
    getPaylog as _getPaylog,
    getOrderCount,
    getTotalTransactionAmount,
    getUnpaidOrderCount,
    getOrderByOrderNumber,
    getProductsByOrderId,
    updateOrderStatus
} from "../models/order.mjs";
import {
    queryPayNumbersByOrderNumber
} from "../models/payNumbers.mjs";
import { 
    insertRefund,
    getRefundLog as _getRefundLog
} from "../models/refund.mjs";
import { 
    refund as _refund
} from "../utils/alipay.mjs";

const getCaptcha = Captcha({
    colors: ["red", "blue", "pink", "green", "grey"],
    height: 40,
    width: 100,
    chars: [],
    line: 3,
    bezier: 2,
    point: 50,
    background: "#fff"
});

/**
 * 验证码
 * 
 * @return {Promise< Object<{ code: String, strem: stream.Readable }> >}
 */
export async function captcha () {
    const { code, stream } = await getCaptcha();
    process.env.RUN_MODE === "development" && console.log(code);
    const token = jwt.sign(code, process.env.SRV_TOKEN_SECRET);
    const img = await new Promise(r => {
        let bufs = [];
        stream.on("data", chunk => bufs.push(chunk));
        stream.on("end", () => {
            r(Buffer.concat(bufs).toString("base64"));
        });
    });
    return {
        token,
        img: "data:image/gif;base64," + img
    };
}

/**
 * 登录 
 */
export async function login ({ token, name, pass, captcha }) {
    let captchaFromToken = "";
    try {
        captchaFromToken = jwt.verify(token, process.env.SRV_TOKEN_SECRET);
    } catch (err) {
        captchaFromToken = "";
    }
    if (captchaFromToken.toLowerCase() !== captcha.toLowerCase()) {
        return ParamError.of("验证码错误");
    }
    const person = await getUserByName(name);
    if (!person) return ParamError.of("用户不存在");
    if (person.pass === pass) {
        return {
            token: jwt.sign(
                {
                    // 暂时token就放一个字段
                    name: person.name
                }, 
                process.env.SRV_TOKEN_SECRET
            )
        };
    } else {
        return ParamError.of("密码不正确");
    }
}

/**
 * 查询商品 
 */
export async function queryProducts ({
    page = 1,
    limit = 10,
    keyword = ""
}) {
    let list = await _queryProducts({ keyword });
    let totalPage = Math.ceil(list.length / limit);
    list = list.slice((page - 1) * limit, limit * page);
    return {
        list,
        totalPage
    };
}

/**
 * 创建商品 
 */
export async function createProduct (data) {
    for (let k of [ "title", "img", "amount", "stock", "code" ]) {
        if (!data[k] && data[k] !== 0) {
            return ParamError.of(`${k}缺失!`);
        }
    }
    await _createProduct(data);
    return null;
}

/**
 * 更新商品 
 */
export async function updateProduct (data) {
    for (let k of [ "id", "title", "code", "img", "amount", "stock" ]) {
        if (!data[k] && data[k] !== 0) {
            return ParamError.of(`${k}缺失!`);
        }
    }
    const affectedRows = await _updateProduct(data);
    return affectedRows > 0 ? null : ParamError.of(`商品id ${data.id} 不存在！`);
}

/**
 * 删除商品 
 */
export async function removeProduct (data) {
    for (let k of [ "id" ]) {
        if (data[k] === undefined) return ParamError.of(`字段${data.id}缺失！`);
    }
    return (await _removeProduct(data)) > 0 ? null : ParamError.of(`id ${data.id} 商品不存在！`);
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
    if (status && !Const[status]) return ParamError.of(`status "${status}" 不合法！`);
    const { list, rowCount, products } = await _queryOrders({ status, page, limit, orderNumber });
    list.forEach(item => {
        const { id } = item;
        item.products = products.reduce((t, c) => {
            if (c.order_id === id) t.push(c);
            return t;
        }, []);
    });
    return { list, totalPage: Math.ceil(rowCount / limit) };
}

/**
 * 处理上传文件 
 */
export async function upload (ctx) {
    const form = new multiparty.Form({
        uploadDir: __dirname(import.meta.url) + "../../" + process.env.SRV_UPLOAD_DIR
    });
    const path = await new Promise((resolve, reject) => {
        form.parse(ctx.req, (err, fields, { file: [ { path } ] }) => {
            if (err) return reject(err);
            resolve(path);
        });
    });
    return basename(path);
}

/**
 * 获取订单支付发起记录 
 */
export async function getPaylog ({ orderNumber }) {
    if (!orderNumber) return ParamError.of("orderNumber 缺失！");
    return await _getPaylog({ orderNumber });
}

/**
 * 查询首页展示数据
 */
export async function info () {
    return {
        totalProduct: await getProductCount(),
        orderCount: await getOrderCount(),
        totalAmount: await getTotalTransactionAmount(),
        unpaidOrderCount: await getUnpaidOrderCount()
    };
}

/**
 * 订单退款 
 */
export async function refund ({ orderNumber }) {
    if (!orderNumber) return ParamError.of("orderNumber 字段缺失！");
    const order = await getOrderByOrderNumber({ orderNumber });
    if (!order) return ParamError(`${orderNumber} 订单不存在！`);
    if (order.status !== Const["已支付"]) return ParamError.of(`订单 ${orderNumber} 不是已支付状态！`);
    // 执行支付宝退款请求，成功执行下一步。   
    // 查询订单购买的商品，看看是否已经删除，已经删除的不能放回库存，但是要提示给前端哪些不能放回库存。
    const payNumbers = await queryPayNumbersByOrderNumber({ orderNumber });

    if (!payNumbers || !Array.isArray(payNumbers) || payNumbers.length === 0) return ParamError.of(orderNumber + " 订单支付记录异常，没有相关支付记录数据！");
    const { pay_number } = payNumbers[payNumbers.length - 1];
    const result = await _refund({ 
        out_trade_no: pay_number, 
        refund_amount: order.pay_amount 
    });
    if (Number(result.refundFee) !== Number(order.pay_amount)) {
        insertRefund({ orderNumber, msg: JSON.stringify(result) });
        return ParamError.of("退款异常！" + result.subMsg || "");
    } else {
        await insertRefund({ orderNumber, msg: JSON.stringify(result) });
    }

    await updateOrderStatus({ orderNumber, status: Const["手动取消"] });

    const products = await getProductsByOrderId({ orderId: order.id });
    if (!products || !Array.isArray(products) || products.length === 0) return ParamError.of(orderNumber + " 购买产品数量异常！");
    // 已删除不能释放库存回去的商品
    const removedProducrs = [], refundsProducts = []; 
    products.forEach(p => {
        if (p.del === 1) {
            removedProducrs.push(p);
        } else {
            refundsProducts.push({ id: p.id, stock: p.count });
        }
    });
    await refundStock({ products: refundsProducts });
    // 返回被删除的商品，这些商品库存不能还原
    return removedProducrs;
}

/**
 * 获取订单的退款日志
 */
export async function getRefundLog ({ orderNumber }) {
    if (!orderNumber || typeof orderNumber !== "string") throw ParamError.of("orderNumber 字段不存在或类型错误！");
    const order = await getOrderByOrderNumber({ orderNumber });
    if (!order) throw ParamError.of(orderNumber + "订单不存在！");
    const logs = await _getRefundLog({ orderNumber });
    return logs;
}