$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')

    // 1.2 配置选项
    let options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传点击功能
    $('#btnChooseImage').click(function () {
        $('#file').click()
    })

    $('#file').on('change', function () {
        let file = this.files[0]

        if (!file) {
            return
        }
        let newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域


    })

    // ---------------  点击 确定 的时候，剪裁图片，转成base64格式，提交字符串到接口 ----------
    $('#btnCreateAvatar').click(function () {
        // 剪裁得到一张图片（canvas图片）
        let base64Str = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        });

        // 把图片转成base64格式
        let dataURL = base64Str.toDataURL(); // 把canvas图片转成base64格式

        // axios
        axios
            .post("/my/update/avatar", "avatar=" + encodeURIComponent(dataURL))
            .then((res) => {
                // 提示
                if (res.data.status !== 0) {
                    // 失败
                    return layer.msg("更新头像失败");
                }

                layer.msg("更新头像成功");
                // 页面中的头像发生变化（更新）
                window.parent.getUserInfo();
            });
    });

    // ajax提交字符串给接口
    /*  $.ajax({
         type: 'POST',
         url: '/my/update/avatar',
         data: {
             avatar: dataURL
         },
         success: function (res) {
             if (res.status !== 0) {
                 // 失败
                 return layer.msg("更新头像失败");
             }
 
             layer.msg("更新头像成功");
             // 更换成功，调用父页面的 getUserInfo() ，重新渲染头像
             window.parent.getUserInfo();
         }
     }); */



})