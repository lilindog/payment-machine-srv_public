import Router from "koa-router";
import { json } from "../utils/util.mjs";
import { 
    captcha, 
    login, 
    queryProducts, 
    createProduct, 
    updateProduct, 
    removeProduct,
    queryOrders,
    upload,
    getPaylog,
    info,
    refund,
    getRefundLog
} from "../services/admin.mjs";
import checkToken from "../middleware/checkToken.mjs";

const router = new Router({ prefix: "/admin" });
export default router;

router.use(checkToken(["/admin/captcha", "/admin/login"]));

/**
 * @api {GET} /admin/captcha 验证码
 * @apiGroup admin
 * @apiDescription 获取验证码
 * 
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: [
 *          token: String, // 验证码token
 *          img: Base64 // 验证码图片数据
 *      ]
 * }
 * @apiSampleRequest off
 */
router.get("/captcha", async ctx => {
    try {
        ctx.body = json(await captcha());
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {POST} /admin/login 登录
 * @apiGroup admin
 * @apiDescription admin用户登录
 * @apiParam {String} name 用户名
 * @apiParam {String} pass 密码
 * @apiParam {String} token 验证码token
 * 
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: {
 *          token: String
 *      }
 * }
 * @apiSampleRequest off
 */
router.post("/login", async ctx => {
    const {
        token, name, pass, captcha
    } = ctx.request.body;
    try {
        ctx.body = json(await login({ token, name, pass, captcha }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * 获取商品列表 
 * 
 * @api {GET} /admin/queryProducts 商品列表
 * @apiGroup admin
 * @apiDescription 获取商品列表信息
 * @apiHeader {String} Authorization token
 * @apiParam {Number} page 页码，默认1
 * @apiParam {Number} limit 每页条数，默认10
 * @apiParam {String} keyword 关键字，用于搜索，可选
 * 
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: [
 *          Object
 *      ]
 * }
 * @apiSampleRequest off
 */
router.get("/queryProducts", async ctx => {
    const {
        page = 1,
        limit = 10,
        keyword = ""
    } = ctx.query;
    try {
        ctx.body = json(await queryProducts({ page, limit, keyword }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {POST} /admin/createProduct 新增商品
 * @apiGroup admin
 * @apiDescription 新增商品
 * @apiHeader {String} Authorization token
 * 
 * @apiParam {String} title 商品标题
 * @apiParam {String} code 商品条码
 * @apiParam {String} img 图片地址
 * @apiParam {Number} amount 价格
 * @apiParam {Number} stock 库存
 * 
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: null
 * }
 * @apiSampleRequest off
 */
router.post("/createProduct", async ctx => {
    const {
        title = "",
        img = "",
        amount = 0,
        stock = 0,
        code = ""
    } = ctx.request.body;
    try {
        ctx.body = json(await createProduct({ title, img, amount, stock, code }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {POST} /admin/updateProduct 更新商品 
 * @apiGroup admin
 * @apiDescription 更新指定id商品
 * @apiHeader {String} Authorization token
 * 
 * @apiParam {Number} id 商品id
 * @apiParam {String} title 商品标题
 * @apiParam {String} code 商品条码
 * @apiParam {String} img 图片地址
 * @apiParam {Number} amount 价格
 * @apiParam {Number} stock 库存
 * 
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: null
 * }
 * 
 * @apiSampleRequest off
 */
router.post("/updateProduct", async ctx => {
    const {
        id,
        code,
        title = "",
        img = "",
        amount = 0,
        stock = 0
    } = ctx.request.body;
    try {
        ctx.body = json(await updateProduct({ id, code, title, img, amount, stock }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {POST} /admin/removeProduct 删除商品
 * @apiDescription 删除指定商品
 * @apiGroup admin
 * @apiHeader {String} Athorizaction token
 * 
 * @apiParam {Number} id 商品id
 * 
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: null
 * }
 * 
 * @apiSampleRequest off
 */
router.post("/removeProduct", async ctx => {
    const { id } = ctx.request.body;
    try {
        ctx.body = json(await removeProduct({ id }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {GET} /admin/queryOrders 查询订单
 * @apiDescription 查询订单
 * @apiGroup admin
 * @apiHeader {String} Authorization token
 * @apiParam {String} orderNumber 订单号筛选，可选
 * @apiParam {String} status 订单状态常量（取值见后台常量定义文件），可选，默认为全部
 * @apiParam {Number} page 页码，可选，默认为1
 * @apiParam {Number} limit 每页数量，可选
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: [
 *          list: [ Object, ... ],
 *          totalPage: Number
 *      ]
 * }
 * @apiSampleRequest off
 */
router.get("/queryOrders", async ctx => {
    const {
        status,
        page,
        limit,
        orderNumber
    } = ctx.query;
    try {
        ctx.body = json(await queryOrders({ status, page, limit, orderNumber }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {POST} /admin/upload 上传文件
 * @apiGroup admin
 * @apiDescription 上传文件，form-data方式单个文件上传，不是json 
 * @apiHeader {String} Authorization token
 * @apiParam {String} file 文件名字
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: String // 文件地址
 * }
 * @apiSampleRequest off
 */
router.post("/upload", async ctx => { 
    try {
        ctx.body = json(await upload(ctx));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {EGT} /admin/getPaylog 查询支付发起记录
 * @apiGroup admin
 * @apiDescription 查询对应订单的支付宝接口发起记录
 * @apiHeader {String} Authorization token
 * @apiParam {String} orderNumber 订单号
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: [
 *          Object
 *      ]
 * }
 * @apiSampleRequest off
 */
router.get("/getPaylog", async ctx => {
    const {
        orderNumber
    } = ctx.query;
    try {
        ctx.body = json(await getPaylog({ orderNumber }));
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {GET} /admin/info 获取首页展示数据 
 * @apiGroup admin
 * @apiDescription 获取admin首页4项展示数据
 * @apiHeader {String} Authorization token
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: {
 *          totalProduct: Number, // 商品总数
 *          totalAmount: Number, // 成交总金额
 *          orderCount: Number, // 订单总数
 *          unpaidOrderCount: Number, // 未支付订单数量
 *      }
 * }
 * @apiSampleRequest off
 */
router.get("/info", async ctx => {
    try {
        ctx.body = json(await info());
    } catch (err) {
        ctx.body = json(err);
    }
});

/**
 * @api {POST} /admin/refund 订单退款 
 * @apiGroup admin
 * @apiDescription 已支付订单退款, 会释放库存
 * @apiHeader {String} Athorization token
 * @apiParam {String} orderNumber 订单号
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: [] // 法会被删除的产品（退款时库存不能还原的产品）的数组，如果有的话
 * }
 * @apiSampleRequest off
 */
router.post("/refund", async ctx => {
    const { orderNumber } = ctx.request.body;
    try {
        ctx.body = json(await refund({ orderNumber }));
    } catch (err) {
        ctx.body = json(err);
    }
});
 
/**
 * @api {GET} /admin/getRefundLog 获取退款日志
 * @apiGroup admin
 * @apiDescription 查询指定订单的退款日志记录
 * @apiHeader {String} Authorization token
 * @apiParam {String} orderNumber 订单号
 * @apiSuccessExample {json} 成功返回
 * {
 *      success: true,
 *      status: 0,
 *      message: "",
 *      data: [ // 没有则为空数组
 *          <Object> //...
 *      ]
 * }
 * @apiSampleRequest off
 */
router.get("/getRefundLog", async ctx => {
    const { orderNumber } = ctx.query;
    try {
        ctx.body = json(await getRefundLog({ orderNumber }));
    } catch (err) {
        ctx.body = json(err);
    }
});