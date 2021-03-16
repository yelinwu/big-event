$(function () {

    let layer = layui.layer
    let form = layui.form
    getCates()
    function getCates() {
        axios.get('/my/article/cates').then(function (res) {
            // console.log(res)

            if (res.data.status !== 0) {
                return layer.msg(res.data.message);
            }
            // 获取成功
            layer.msg(res.data.message);

            $('tbody').empty()
            res.data.data.forEach(item => {
                $(`<tr>
            <td>${item.name}</td>
            <td>${item.alias}</td>
            <td>
              <button data-id="${item.Id}"  type="button" class="layui-btn layui-btn-xs btn_edit">编辑</button>
              <button data-id="${item.Id}"  type="button" class="layui-btn layui-btn-xs layui-btn-danger btn_delete">删除</button>
            </td>
          </tr>`).appendTo($('tbody'))
            });

        })


    }
    // 添加类别功能

    let addFormStr = `<form id="addForm" class="layui-form" action="" style="margin-top: 15px; margin-right: 50px;">
            <!-- 第一行 分类名称 -->
            <div class="layui-form-item">
                <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                  <input type="text" name="name" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
    </div>
    </div>
            <!-- 第二行 分类别名  -->
            <div class="layui-form-item">
                <label class="layui-form-label">分类别名</label>
                <div class="layui-input-block">
                  <input type="text" name="alias" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
    </div>
    </div>
            <!-- 第三行 按钮 -->
            <div class="layui-form-item">
                <div class="layui-input-block">
                  <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
                  <button type="reset" class="layui-btn layui-btn-primary">重置</button>
    </div>
    </div>
</form>`

    let editFormStr = `<form id="editForm" class="layui-form " lay-filter="editForm" action="" style="margin-top: 15px; margin-right: 50px;">
    <div class="layui-form-item layui-hide" >
                <label class="layui-form-label">分类Id</label>
                <div class="layui-input-block">
                  <input type="text" name="Id" required  lay-verify="required" placeholder="请输入Id" autocomplete="off" class="layui-input">
    </div>
    </div>
    <!-- 第一行 分类名称 -->
            <div class="layui-form-item">
                <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                  <input type="text" name="name" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
    </div>
    </div>
            <!-- 第二行 分类别名  -->
            <div class="layui-form-item">
                <label class="layui-form-label">分类别名</label>
                <div class="layui-input-block">
                  <input type="text" name="alias" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
    </div>
    </div>
            <!-- 第三行 按钮 -->
            <div class="layui-form-item">
                <div class="layui-input-block">
                  <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
    </div>
    </div>
</form>`

    let index;// index变量存储弹出层的索引
    $('#btnAddCate').click(function () {
        index = layer.open({
            type: 1,//层类型 (1==>页面层)
            title: '添加文章类型',
            content: addFormStr,
            area: ['500px', '250px']//定义宽高
        });
    })

    // 实现表单提交功能
    // 坑：由于addForm是动态创建的，所以需要注册事件问题
    /* $('#addForm').submit(function (e) {
        e.preventDefault()
    })*/

    $('body').on('submit', '#addForm', function (e) {
        // console.log(1)
        e.preventDefault()

        //收集表单数据
        let data = $(this).serialize()
        axios.post('/my/article/addcates', data).then(function (res) {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            // 添加成功
            // 1. 关闭弹出层
            layer.close(index)

            // 2. 重新发送ajax获取到所有的分类数据，渲染展示到页面
            getCates()
        })
    })

    //删除功能
    $('tbody').on('click', '.btn_delete', function () {
        // 获取id
        let id = $(this).attr('data-id')
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something

            axios.get('/my/article/deletecate/' + id).then(function (res) {
                if (res.data.status !== 0) {
                    // 删除失败
                    return layer.msg(res.data.message)
                }


                layer.close(index);
                // 重新发送ajax请求获取所以数据
                getCates()
            })
        })
    });

    // 编辑功能
    let editIndex;

    $('tbody').on('click', '.btn_edit', function () {
        // 获取Id
        let id = $(this).attr('data-id')

        editIndex = layer.open({
            type: 1,//层类型 (1==>页面层)
            title: '添加文章类型',
            content: editFormStr,
            area: ['500px', '250px']//定义宽高
        });
        axios.get('/my/article/cates/' + id).then(function (res) {
            console.log(res)

            // 获取列表数据
            form.val("editForm", res.data.data);
        })
    })

    // 完成确认修改
    $('body').on('submit', '#editForm', function (e) {
        e.preventDefault()

        let data = $(this).serialize()
        axios.post('/my/article/updatecate', data).then(function (res) {
            if (res.data.status !== 0) {
                // 更新失败
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)

            layer.close(editIndex)

            getCates()
        })
    })
})