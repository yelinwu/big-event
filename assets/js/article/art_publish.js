$(function () {
    let form = layui.form

    //获取文章类别数据，渲染到下拉框中
    axios.get('/my/article/cates').then(function (res) {
        // console.log(res)
        res.data.data.forEach(function (item) {
            $(`<option value="${item.Id}">${item.name}</option>`).appendTo(
                $("[name=cate_id]")
            );
        });
        //手动渲染表单
        form.render()
    })

    //初始化富文本编辑器
    initEditor()
    //初始化图片裁剪器
    let $image = $('#image')

    // 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: ".img-preview",
    }
    // 初始化裁剪区域
    $image.cropper(options);

    // 点击封面按钮，模拟点击文件域
    $('#btnChooseCoverImage').click(function () {
        $("#fileCover").click();
    })
    //替换裁切区域图片 
    $('#fileCover').change(function () {
        // 获取用户选择的文件
        let file = this.files[0]
        // 将文件转成对应的url地址
        let newImgURL = URL.createObjectURL(file);

        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })

    //提交文章数据，实现发布文章 
    let state;//存文章的状态
    $("#btnPublish").click(() => (state = "已发布"));
    $("#btnSave").click(() => (state = "草稿"));
    $('#form').submit(function (e) {
        e.preventDefault()
        // 收集表单数据 ==> 需要通过 FormData来收集（接口要求）

        // 将裁切的图片处理成二进制文件
        $image
            .cropper("getCroppedCanvas", {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280,
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到blob文件对象后，进行后续的操作 ==> 通过 FormData来收集数据， ajax提交数据

                let ss = new FormData($("#form")[0]); // 如果参数写的this，需要将函数写成箭头函数，或者 $("#form")[0]

                // append() 方法
                // 追加封面 cover_img
                ss.append("cover_img", blob);

                // 追加状态 state
                ss.append("state", state);

                // forEach 查看收集到了哪些数据
                /* ss.forEach(function (value, name) {
                  console.log(value, name);
                }); */

                // 发送ajax请求，提交文章数据
                axios.post("/my/article/add", ss).then((res) => {
                    console.log(res);

                    if (res.data.status !== 0) {
                        return layer.msg("发布文章失败！");
                    }

                    // 跳转页面到文章列表页面

                    location.href = "/article/art_list.html"
                });
            });
    })
})