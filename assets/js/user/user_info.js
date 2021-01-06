$(function () {
  // ====================== 添加昵称的自定义校验规则 ======================

  let form = layui.form;
  let layer = layui.layer;

  form.verify({
    /* nickname: function (value, item) {
      //value：表单的值、item：表单的DOM对象
    }, */

    // 昵称
    nickname: (value) => {
      console.log(value);

      if (value.length > 6) {
        return "昵称的长度需要在1-6字符之间";
      }
    },
  });

  // ==================  发送ajax请求， 获取用户的基本信息 ==================
  getInfo();
  function getInfo() {
    $.ajax({
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败！");
        }

        // 给表单赋值
        // form 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
        // 注意点：第二个参数，数据需要和表单中的name进行一一对应，这样才能正确的给表单赋值
        form.val("form", res.data);
      },
    });
  }

  // ===================== 重置功能 ======================
  $("#resetBtn").click(function (e) {
    // 不需要重置按钮的默认行为（会让表单都为空）
    // 1. 阻止默认行为
    e.preventDefault();

    // 2. 重新发送ajax请求， 获取用户的基本信息，重新填充数据到表单中
    getInfo();
  });

  // 监听表单的submit事件，实现修改功能
  $("#form").on("submit", function (e) {
    e.preventDefault();

    // serialize() 方法收集到数据，不要忘记id的处理
    let data = $(this).serialize();

    $.ajax({
      url: "/my/userinfo",
      type: "POST",
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改用户信息失败！");
        }

        // console.log($("#welcome").text()); // 子页面user_info 无法直接来获取到父页面index的元素

        // window.parent 可以找到父页面的window对象
        window.parent.getUserInfo(); // 调用父页面的getUserInfo函数实现更新用户头像和昵称

        layer.msg("修改用户信息成功！");
      },
    });
  });
});
