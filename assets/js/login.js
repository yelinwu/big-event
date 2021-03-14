$(function () {
    //注册页面按钮功能
    $('#showReg').click(function () {
        //显示注册页面
        $('.reg-form').show();
        //隐藏登录页面
        $('.login-form').hide();
    })

    $('#showLogin').click(function () {

        $('.reg-form').hide();

        $('.login-form').show();
    })

    // --------------------------自定义校验规则------------------------

    let form = layui.form
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'

        ],
        samePass: function (value) {
            // value：表单的值（就是再次输入密码的内容）、item：表单的DOM对象
            // console.log(value);
            // 还需要获取到注册表单中的密码的内容
            let pwd = $("#regi_pass").val();

            // 两次密码进行比较判断，是否一致，如果不一致，出现提示文字
            if (value !== pwd) {
                // return 的内容就是匹配不符合的时候出现的提示文字
                return "两次输入的密码不一致";
            }
        }
    })


    let layer = layui.layer; //加载弹出层模块
    //给form表单注册submit功能，阻止默认事件
    $('.reg-form').on('submit', function (e) {
        e.preventDefault()


        //获取表单中的数据，serialize是根据表单各项的name属性获取值的，所以要检查表单各项的name属性
        let data = $(this).serialize();
        axios.post('/api/reguser', data).then(function (res) {
            console.log(res)

            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg('注册成功')
            $('#showLogin').click()
        })
    })
    //实现登录功能
    $('.login-form').on('submit', function (e) {
        e.preventDefault()

        let data = $(this).serialize();//获取表单
        axios.post('/api/login', data)
            .then(function (res) {
                if (res.data.status !== 0) {
                    return layer.msg(res.data.message)
                }
                // layer.msg('登录成功')
                // location.href = './index.html'

                // 把服务器响应回来的 token 信息给存储到本地存储中（localStorage）
                localStorage.setItem('token', res.data.token)

                // 以上代码细节优化： layer.msg当它隐藏之后才跳转页面
                layer.msg('登录成功', function () {
                    location.href = './index.html'
                })
            })
    })
})
