import Router from "koa-router";
import { getProduct, createOrder, pay, getOrder } from "../services/machine.mjs";
import { json } from "../utils/util.mjs";
import checkMachineToken from "../middleware/checkMachineToken.mjs";

const router = new Router({ prefix: "/machine" });
export default router;

router.use(checkMachineToken);

/**
 * @api {GET} /machine/getProductByCode 查询code对应商品
 * @apiDescription 查询指定扫码条码的商品
 * @apiGroup machine
 * 
 * @apiParam {String} code 条码、二维码参数
 * 
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: {
 *          id: 18,
 *          title: '罗技鼠标',
 *          img: 'amxQHDEVgsttPVkn_jp2GniX.png',
 *          amount: 128,
 *          stock: 9,
 *          del: 0,
 *          code: '00003'
 *      }
 * }
 * 
 * @apiSampleRequest off
 */
router.get("/getProductByCode", async ctx => {
    const { code } = ctx.query;
    try {
        ctx.body = json(await getProduct({ code }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {POST} /machine/createOrder 创建订单
 * @apiDescription 创建订单
 * @apiGroup machine
 * 
 * @apiParamExample {json} 参数
 * {
 *      products: [
 *          { id: "商品id", count: Number },
 *          // ...more
 *      ]
 * }
 * 
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: {
 *          orderNumber: "订单编号"
 *      }
 * }
 * 
 * @apiSampleRequest off
 */
router.post("/createOrder", async ctx => {
    const { 
        products = []
    } = ctx.request.body;
    try {
        ctx.body = json(await createOrder({ products }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {POST} /machine/pay 支付
 * @apiDescription 支付宝付款码扫码器扫码支付
 * @apiGroup machine
 * @apiParam {String} orderNumber 订单号
 * @apiParam {String} code 支付宝付款码
 * @apiSampleRequest off
 * 
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: null
 * }
 */
router.post("/pay", async ctx => {
    const { orderNumber, code } = ctx.request.body;
    try {
        ctx.body = json(await pay({ orderNumber, code }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {GET} /machine/getOrder 获取订单详情
 * @apiGroup machine
 * @apiDescription 根据订单号查询订单详情
 * @apiParam {Stirng} orderNumber 订单号
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: {
 *         "id": 29,
 *         "order_number": "202107051025038491695",
 *         "status": 0,
 *         "pay_amount": 600,
 *         "create_date": "2021-07-06T02:12:10.000Z",
 *         "pay_date": null,
 *         "products": [
 *             {
 *                 "order_id": 29,
 *                 "product_id": 6,
 *                 "count": 4,
 *                 "pay_amount": 400,
 *                 "id": 6,
 *                 "title": "cesh",
 *                 "img": "xxxx",
 *                 "amount": 100,
 *                 "stock": 2,
 *                 "del": 1,
 *                 "code": ""
 *             },
 *             {
 *                 "order_id": 29,
 *                 "product_id": 7,
 *                 "count": 2,
 *                 "pay_amount": 200,
 *                 "id": 7,
 *                 "title": "bbbbbb",
 *                 "img": "xxxx",
 *                 "amount": 100,
 *                 "stock": 26,
 *                 "del": 1,
 *                 "code": ""
 *             }
 *         ]
 *     }
 * }
 * @apiSampleRequest off
 */
router.get("/getOrder", async ctx => {
    const { orderNumber } = ctx.query;
    try {
        ctx.body = json(await getOrder({ orderNumber }));
    } catch (err) {
        ctx.bodyu = json(err);
    }
}); 