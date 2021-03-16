getUserInfo()
function getUserInfo() {
    //发送ajax请求获取用户信息，渲染名字、头像
    axios.get('/my/userinfo', {
        //请求头信息，这个请求头的配置一定要有，否则无法获取到用户信息
        /* headers: {
            // Authorization的值token， token的值是在登录的时候，存储到本地
            Authorization: localStorage.getItem('token'),

        } */
    }).then(function (res) {
        // console.log(res)
        //获取用户信息
        let info = res.data.data
        // console.log(info)
        //处理名字
        let name = info.nickname || info.username
        //设置名字
        $('#welcome').text('欢迎' + name)

        //处理头像
        if (info.user_pic) {
            // 有图片头像, 需要设置src，并且显示
            $('.layui-nav-img').attr('src', info.user_pic).show()
            // 隐藏文字头像
            $('.text-avatar-box').hide()
        } else {
            // 没有图片头像, 需要显示文字头像
            //  设置文字头像的内容为name的第一个字符的大写
            $('.layui-nav-img').hide()
            $('.text-avatar-box').show().children().text(name[0].toUpperCase())
        }
    })
}

$(function () {
    $('#btnLogout').click(function () {

        let layer = layui.layer
        //弹出询问框
        layer.confirm('确认退出吗？', { icon: 3, title: '提示' }, function (index) {
            //do something

            layer.close(index);


            //做的事情和登录做的事情反过来
            //把本地存储的token信息给删除掉
            localStorage.removeItem('token')
            //跳转页面
            location.href = './login.html'
        })
    })
})