#
# 收银机后端服务基本表结构
# lilindog 2021年7月
#

# 用户表，简单用于后端登录
drop table if exists user;
create table if not exists user (
    id int auto_increment primary key,
    name char(10) NOT NULL COMMENT "姓名",
    pass char(50) DEFAULT "admin" COMMENT "密码，这里存明文",
    summary text COMMENT "简介"
) engine = InnoDB default charset = utf8;
lock table user write;
insert into user (name) values ("admin");
unlock tables;

# 商品表，这里没有分类，就几个简单的字段。
drop table if exists product;
create table if not exists product (
    id int auto_increment primary key,
    title char(50) not null comment "商品标题",
    img char(100) default "" comment "图片地址",
    amount decimal(10, 2) not null comment "价格",
    stock int not null comment "库存",
    del tinyint default 0 comment "删除标记",
    code char(50) not null comment "条码，二维码"
) engine = InnoDB default charset = utf8;

# 订单表
drop table if exists orders;
create table if not exists orders (
    id int auto_increment primary key,
    order_number char(50) comment "订单标号",
    status int default 0 comment "订单状态",
    pay_amount decimal(10, 2) default 0 comment "订单需要支付的金额",
    create_date timestamp default current_timestamp comment "订单创建时间",
    pay_date timestamp comment "订单支付完成时间"
) engine = InnoDB default charset = utf8;

# 订单商品详情表
drop table if exists order_products;
create table if not exists order_products (
    order_id int not null comment "订单id",
    product_id int not null comment "商品id",
    count int not null default 0 comment "购买数量",
    pay_amount decimal(10, 2) not null default 0 comment "购买时候的价格"
) engine = InnoDB default charset = utf8;

# 支付包当面付支付编号映射表（映射支付编号和订单的关系，一次支付失败后会换一个支付编号，但是还是会和同一个订单关联）
drop table if exists pay_numbers;
create table if not exists pay_numbers (
    order_number char(50) not null default "" comment "订单编号",
    pay_number char(50) unique not null default "" comment "支付编号",
    create_date timestamp default current_timestamp comment "创建时间",
    msg char(100) default "" comment "支付状态文本消息"
) engine = InnoDB default charset = utf8;

# 退款申请记录表
drop table if exists refund;
create table if not exists refund (
    order_number char(50) not null default "" comment "订单编号",
    create_date timestamp default current_timestamp comment "创建时间",
    msg text default "" comment "退款接口返回消息"
) engine = Innodb default charset = utf8;
