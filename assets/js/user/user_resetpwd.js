$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({

        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],


        samePass: function (value, item) { //value：表单的值、item：表单的DOM对象
            let oldpwd = $('[name=oldPwd]').val()

            if (value === oldpwd) {
                return '新密码不能与原密码相同'
            }
        },

        rePass: function (value) {
            let newpwd = $('[name=newPwd]').val()
            if (value !== newpwd) {
                return '密码不一致'
            }
        }
    })

    $('#form').on('submit', function () {
        let data = $(this).serialize()
        axios.post('/my/updatepwd', data).then(function (res) {
            // console.log(res)

            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg('更新密码成功')
        })
        $('#form')[0].reset()
    })

})