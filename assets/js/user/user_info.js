let form = layui.form
$(function () {
    renderForm()
    function renderForm() {
        axios.get('/my/userinfo').then(function (res) {
            console.log(res)

            form.val("form", res.data.data)
        });

    }
    form.verify({
        len: function (value, item) { //value：表单的值、item：表单的DOM对象
            // console.log(value)

            if (value.length > 6) {

                return '昵称长度需要在1-6个字符之间'
            }

        }
    })

    // 实现修改功能
    $('#form').on('submit', function (e) {
        e.preventDefault()
        // 发送ajax请求
        let data = $(this).serialize();//获取表单
        axios.post('/my/userinfo', data).then(function (res) {
            console.log(res)
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg('修改用户信息成功')
            // console.log($('#welcome')) //获取不到该元素
            // console.log(window.parent) //获取父页面
            window.parent.getUserInfo()
        })

    })

    $('#btnReset').on('click', function (e) {

        e.preventDefault()
        renderForm()
    })

})

