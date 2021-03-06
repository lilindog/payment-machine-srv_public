define({ "api": [
  {
    "type": "EGT",
    "url": "/admin/getPaylog",
    "title": "查询支付发起记录",
    "group": "admin",
    "description": "<p>查询对应订单的支付宝接口发起记录</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "orderNumber",
            "description": "<p>订单号</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: [\n         Object\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "EgtAdminGetpaylog"
  },
  {
    "type": "GET",
    "url": "/admin/captcha",
    "title": "验证码",
    "group": "admin",
    "description": "<p>获取验证码</p>",
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: [\n         token: String, // 验证码token\n         img: Base64 // 验证码图片数据\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "GetAdminCaptcha"
  },
  {
    "type": "GET",
    "url": "/admin/getRefundLog",
    "title": "获取退款日志",
    "group": "admin",
    "description": "<p>查询指定订单的退款日志记录</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "orderNumber",
            "description": "<p>订单号</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: [ // 没有则为空数组\n         <Object> //...\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "GetAdminGetrefundlog"
  },
  {
    "type": "GET",
    "url": "/admin/info",
    "title": "获取首页展示数据",
    "group": "admin",
    "description": "<p>获取admin首页4项展示数据</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: {\n         totalProduct: Number, // 商品总数\n         totalAmount: Number, // 成交总金额\n         orderCount: Number, // 订单总数\n         unpaidOrderCount: Number, // 未支付订单数量\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "GetAdminInfo"
  },
  {
    "type": "GET",
    "url": "/admin/queryOrders",
    "title": "查询订单",
    "description": "<p>查询订单</p>",
    "group": "admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "orderNumber",
            "description": "<p>订单号筛选，可选</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>订单状态常量（取值见后台常量定义文件），可选，默认为全部</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>页码，可选，默认为1</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>每页数量，可选</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: [\n         list: [ Object, ... ],\n         totalPage: Number\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "GetAdminQueryorders"
  },
  {
    "type": "GET",
    "url": "/admin/queryProducts",
    "title": "商品列表",
    "group": "admin",
    "description": "<p>获取商品列表信息</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>页码，默认1</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>每页条数，默认10</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyword",
            "description": "<p>关键字，用于搜索，可选</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: [\n         Object\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "GetAdminQueryproducts"
  },
  {
    "type": "POST",
    "url": "/admin/createProduct",
    "title": "新增商品",
    "group": "admin",
    "description": "<p>新增商品</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>商品标题</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>商品条码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "img",
            "description": "<p>图片地址</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>价格</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "stock",
            "description": "<p>库存</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "PostAdminCreateproduct"
  },
  {
    "type": "POST",
    "url": "/admin/login",
    "title": "登录",
    "group": "admin",
    "description": "<p>admin用户登录</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pass",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>验证码token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: {\n         token: String\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "PostAdminLogin"
  },
  {
    "type": "POST",
    "url": "/admin/refund",
    "title": "订单退款",
    "group": "admin",
    "description": "<p>已支付订单退款, 会释放库存</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Athorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "orderNumber",
            "description": "<p>订单号</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: [] // 法会被删除的产品（退款时库存不能还原的产品）的数组，如果有的话\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "PostAdminRefund"
  },
  {
    "type": "POST",
    "url": "/admin/removeProduct",
    "title": "删除商品",
    "description": "<p>删除指定商品</p>",
    "group": "admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Athorizaction",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>商品id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "PostAdminRemoveproduct"
  },
  {
    "type": "POST",
    "url": "/admin/updateProduct",
    "title": "更新商品",
    "group": "admin",
    "description": "<p>更新指定id商品</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>商品id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>商品标题</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>商品条码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "img",
            "description": "<p>图片地址</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>价格</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "stock",
            "description": "<p>库存</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "PostAdminUpdateproduct"
  },
  {
    "type": "POST",
    "url": "/admin/upload",
    "title": "上传文件",
    "group": "admin",
    "description": "<p>上传文件，form-data方式单个文件上传，不是json</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "file",
            "description": "<p>文件名字</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: String // 文件地址\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/admin.mjs",
    "groupTitle": "admin",
    "name": "PostAdminUpload"
  },
  {
    "type": "GET",
    "url": "/machine/getOrder",
    "title": "获取订单详情",
    "group": "machine",
    "description": "<p>根据订单号查询订单详情</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Stirng",
            "optional": false,
            "field": "orderNumber",
            "description": "<p>订单号</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: {\n        \"id\": 29,\n        \"order_number\": \"202107051025038491695\",\n        \"status\": 0,\n        \"pay_amount\": 600,\n        \"create_date\": \"2021-07-06T02:12:10.000Z\",\n        \"pay_date\": null,\n        \"products\": [\n            {\n                \"order_id\": 29,\n                \"product_id\": 6,\n                \"count\": 4,\n                \"pay_amount\": 400,\n                \"id\": 6,\n                \"title\": \"cesh\",\n                \"img\": \"xxxx\",\n                \"amount\": 100,\n                \"stock\": 2,\n                \"del\": 1,\n                \"code\": \"\"\n            },\n            {\n                \"order_id\": 29,\n                \"product_id\": 7,\n                \"count\": 2,\n                \"pay_amount\": 200,\n                \"id\": 7,\n                \"title\": \"bbbbbb\",\n                \"img\": \"xxxx\",\n                \"amount\": 100,\n                \"stock\": 26,\n                \"del\": 1,\n                \"code\": \"\"\n            }\n        ]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/machine.mjs",
    "groupTitle": "machine",
    "name": "GetMachineGetorder"
  },
  {
    "type": "GET",
    "url": "/machine/getProductByCode",
    "title": "查询code对应商品",
    "description": "<p>查询指定扫码条码的商品</p>",
    "group": "machine",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>条码、二维码参数</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: {\n         id: 18,\n         title: '罗技鼠标',\n         img: 'amxQHDEVgsttPVkn_jp2GniX.png',\n         amount: 128,\n         stock: 9,\n         del: 0,\n         code: '00003'\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/machine.mjs",
    "groupTitle": "machine",
    "name": "GetMachineGetproductbycode"
  },
  {
    "type": "POST",
    "url": "/machine/createOrder",
    "title": "创建订单",
    "description": "<p>创建订单</p>",
    "group": "machine",
    "parameter": {
      "examples": [
        {
          "title": "参数",
          "content": "{\n     products: [\n         { id: \"商品id\", count: Number },\n         // ...more\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: {\n         orderNumber: \"订单编号\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/machine.mjs",
    "groupTitle": "machine",
    "name": "PostMachineCreateorder"
  },
  {
    "type": "POST",
    "url": "/machine/pay",
    "title": "支付",
    "description": "<p>支付宝付款码扫码器扫码支付</p>",
    "group": "machine",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "orderNumber",
            "description": "<p>订单号</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>支付宝付款码</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "成功返回",
          "content": "{\n     success: true,\n     status: 0,\n     message: \"\",\n     data: null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routers/machine.mjs",
    "groupTitle": "machine",
    "name": "PostMachinePay"
  }
] });
