/*
  测试使用mongoose操作mongodb数据库
  1. 连接数据库
    1.1 引入mongoose
    1.2 连接指定数据库（URL只有数据库是变化的）
    1.3 获取连接对象
    1.4 绑定连接完成的监听（用来提示连接成功）
  2. 得到对应塔顶集合的Model
    2.1 定义Schema（描述文档结构）
    2.2 定义Model（与集合对应，可以操作集合）
  3. 通过Model或其实例对集合数据进行CRUD操作
    3.1 通过Model实力的save()添加数据
    3.2 通过Model的find()/findOne()查询多个或一个数据
    3.3 通过Model的findByIdAndUpdate()更新某个数据
    3.4 通过Model的remove()删除匹配的数据
*/

const md5 = require("blueimp-md5") // md5加密的函数

/*1. 连接数据库 */
// 1.1 引入mongoose
const mongoose = require('mongoose')
// 1.2 连接指定数据库（URL只有数据库是变化的）
mongoose.connect('mongodb://localhost:27017/zhaopin_test2')
// 1.3 获取连接对象
const conn = mongoose.connection
// 1.4 绑定连接完成的监听（用来提示连接成功）
conn.on('connected', function () { // 连接成功回调
  console.log("数据库连接成功");
})

/*2. 得到对应特定集合的Model */
// 2.1 定义Schema（描述文档结构）
const userSchema = mongoose.Schema({ // 指定文档的结构：属性名/属性值的类型，是否是必需的，默认值
  username: {
    type: String,
    required: true
  }, // 用户名
  password: {
    type: String,
    required: true
  }, // 密码
  type: {
    type: String,
    required: true
  }, // 用户类型：dashen/laoban
  header: {
    type: String
  }
})

// 2.2 定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user', userSchema) // 集合名：users


/*3. 通过Model或其实例对集合数据进行CRUD操作 */
// 3.1 通过Model实力的save()添加数据
function testSave() {
  // 创建UserModel的实例
  const userModel = new UserModel({
    username: 'Bob',
    password: md5('234'),
    type: "laoban"
  })
  // 调用save()保存
  userModel.save(function (error, doc) {
    console.log('save()', error, doc);
  })
}
// testSave()
// 3.2 通过Model的find()/findOne()查询多个或一个数据
function testFind() {
  // 查询多个：find()得到的是包含所有匹配文档对象的数组，如果没有匹配的就是[]
  UserModel.find(function (error, users) {
    console.log('find()', error, users);
  })
  // 查询一个：findOne()得到的是匹配的文档对象，如果没有匹配的就是null
  UserModel.findOne({
    _id: '5fbe20597393f15df880f051'
  }, function (error, user) {
    console.log('findOne()', error, user);
  })
}
// testFind()

// 3.3 通过Model的findByIdAndUpdate()更新某个数据
// 返回值是修改之前的数据
function testUpdate() {
  UserModel.findByIdAndUpdate({
    _id: '5fbe20597393f15df880f051'
  }, {
    username: 'Jack'
  }, function (error, oldUser) {
    console.log('findByIdAndUpdate()', error, oldUser);
  })
}
// testUpdate()

// 3.4 通过Model的remove()删除匹配的数据
// 返回值是{ n: 0, ok: 1, deletedCount: 0 }，n是删除的数量，ok是删除成功
function testDelete() {
  UserModel.remove({
    _id: '5fbe20597393f15df880f051'
  }, function (error, doc) {
    console.log('remove()', error, doc);
  })
}
testDelete()