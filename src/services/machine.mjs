import Big from "big.js";
import { orderNumber, payNumber, getDate, ParamError } from "../utils/util.mjs";
import _pay from "../utils/alipay.mjs";
import orderConst from "../utils/orderStatusConstant.mjs";
import { 
    getProduct as _getProduct,
    queryProductPriceByIds
} from "../models/product.mjs";
import {
    createOrder as _createOrder,
    getOrderByOrderNumber,
    updateOrderStatus,
    addPayNumber,
    updatePayNumberStatus,
    getProductsByOrderId
} from "../models/order.mjs";

/**
 * 根据条码获取指定产品 
 */
export async function getProduct ({ code }) {
    if (code === undefined) return ParamError.of(`字段code缺失`);
    return await _getProduct({ code });
}

/**
 * 创建订单 
 */
export async function createOrder ({ 
    products
}) {
    if (!Array.isArray(products) || products.length === 0) return ParamError.of("字段products类型错误或缺失");
    for (let item of products) {
        if (!item.id) return ParamError.of(`products中的某个item没有id字段`);
        if (!item.count) return ParamError.of(`products中的某个item没有count字段`);
    }

    // 去重合并
    products = products.reduce((t, c) => {
        if (!t.includes(c.id)) t.push(c.id);
        return t;
    }, []).reduce((t, c) => {
        const obj = { id: c, count: 0 };
        products.forEach(p => {
            if (p.id === c) obj.count += Number(p.count);
        });
        t.push(obj);
        return t;
    }, []);

    // 计算订单总价（支付的价格）
    const productsAmounts = await queryProductPriceByIds({ productIds: products.map(i => i.id) });
    // 这里判断一下，以防万一商品被真删除后继续创建订单产生错误。
    if (!productsAmounts || productsAmounts.length === 0) return ParamError.of(`商品异常，请重新扫码购买！`);
    const payAmount = productsAmounts.reduce((t, c) => {
        t = Big(t).plus(Big(c.amount).times( products.find(i => i.id === c.id).count ));
        return t;
    }, 0).toFixed(2);

    // 计算每种商品的总价，增加payAmount属性
    products.forEach(p => {
        p.payAmount = Big(productsAmounts.find(i => i.id === p.id).amount).times(p.count).toFixed(2);
    });

    // 创建订单
    const number = orderNumber();
    await _createOrder({ products, createDate: getDate(), payAmount, orderNumber: number, orderStatus: orderConst["未支付"] });
    return { orderNumber: number };
}

/**
 * 条码支付 
 */
export async function pay ({ orderNumber, code }) {
    // 查询订单以及金额
    if (!code) return ParamError.of("code字段缺失！");
    if (!orderNumber) return ParamError.of("code字段缺失！");
    const order = await getOrderByOrderNumber({ orderNumber });
    if (!order?.pay_amount) return ParamError.of(`订单编号为"${orderNumber}"的订单不存在！`);
    if (order.status !== 0) return ParamError.of(`订单${orderNumber}状态不能支付，请检查订单号是否正确！`);
    // 生成支付单号，插入到支付单号表
    const $payNumber = payNumber();
    await addPayNumber({ orderNumber, payNumber: $payNumber });
    // 支付
    const result = await _pay({ 
        out_trade_no: $payNumber, // 商户订单号, 这里不用我真实的订单号，因为一单可能失败会发起第二次支付，因此我这里单独为支付宝api创建支付编号
        auth_code: code, // 付款码条码
        total_amount: order.pay_amount //订单金额
    });
    if (result instanceof Error) {
        await updatePayNumberStatus({ payNumber: $payNumber, msg: result.message });
        return ParamError.of(result.message);
    }
    // 支付成功后要写表（支付时间，修改顶大状态为已支付）
    await updatePayNumberStatus({ payNumber: $payNumber, msg: "支付成功" });
    const affectedRows = await updateOrderStatus({ orderNumber, status: orderConst["已支付"], payDate: getDate() });
    if (affectedRows > 0) return null;
    return ParamError.of();
}

/**
 * 根据订单号获取订单 
 */
export async function getOrder ({ orderNumber }) {
    if (!orderNumber) return ParamError.of("orderNumber 字段缺失！");
    const order = await getOrderByOrderNumber({ orderNumber });
    if (!order) return ParamError.of(`订单${orderNumber}不存在！`);
    const products = await getProductsByOrderId({ orderId: order.id });
    order.products = products;
    return order;
}