$(function () {

    let layer = layui.layer
    let laypage = layui.laypage;
    let form = layui.form
    let query = {
        pagenum: 1,////页码值
        pagesize: 2,//每页显示多少条数据
        cate_id: '',//文章分类的Id
        state: '',//文章的状态，可选值
    }
    getList()
    function getList() {
        axios.get('/my/article/list', {
            params: query
        }).then(function (res) {
            // console.log(res)
            if (res.data.status !== 0) {
                // 获取失败
                return layer.msg(res.data.message)
            }
            $('tbody').empty()
            // 获取成功
            // 遍历data数据。创建tr添加到tbody中
            res.data.data.forEach(function (item) {
                // console.log(res.data)
                $(`<tr>
            <td>${item.title}</td>
            <td>${item.cate_name}</td>
            <td>${forTime(item.pub_date)}</td>
            <td>${item.state}</td>
            <td>
              <button type="button" class="layui-btn layui-btn-xs btn_edit">编辑</button>
              <button type="button" data-id=${item.Id} class="layui-btn layui-btn-danger layui-btn-xs btn_delete">删除</button>
            </td>
          </tr>`).appendTo($('tbody'))
            });
            // res上面形参传下来
            renderLayPage(res)//res实参
        })
    }

    // 实现分页           
    function renderLayPage(info) {
        //执行一个laypage实例
        laypage.render({
            elem: 'page-box', //注意，这里的 test1 是 ID，不用加 # 号
            count: info.data.total, // 数据总数，从服务端得到
            curr: query.pagenum, // 起始页
            limit: query.pagesize, // 每页显示的条数
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [1, 2, 5, 10, 20],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                /* console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                console.log(first) */

                // jump 回调函数触发时机
                // 1. laypage.render 分页在初始化渲染的时候，就会触发执行一次   first形参，值为true
                // 2. 点击分页切换的时候，也会触发执行         first形参，值为undefined

                // 步骤：
                // 1. 把query对象里面的参数给修改下 (pagenum 页码 ==> 当前页码)
                // 2. 就发送ajax请求获取到对应页码的数据
                query.pagenum = obj.curr
                // 当选择每页几条数据的时候，jump回调函数也会触发执行，把query对象的pagesize的值修改成obj.limit
                query.pagesize = obj.limit

                if (!first) {
                    getList()
                }
            }
        });

    }
    //处理分页的下拉框
    // 1. 发送ajax请求获取到数据
    // 2. 创建option 添加到 cateSelect中
    axios.get('/my/article/cates').then(function (res) {
        // console.log(res)

        res.data.data.forEach(function (item) {
            $(`<option value="${item.Id}">${item.name}</option>`).appendTo('#cateSelect')
        })

        // 坑：如果没有以下无代码，option虽然添加到下拉框中，但是页面中是没有对应的下拉选项
        // 手动调用，让form表单重新渲染下即可
        form.render(); // 更新全部
    })
    // 实现筛选功能
    $('#form').on('submit', function (e) {
        e.preventDefault()

        //收集到下拉框中的数据，修改query中的对应数据

        // console.log($("#cateSelect").val())
        // console.log($('#stateSelect').val())

        //修改query参数的分类id
        query.cate_id = $('#cateSelect').val()
        query.state = $('#stateSelect').val()

        //筛选的时候，需要看第一页的数据，修改query对象的pagenum的值为1
        query.pagenum = 1;
        // console.log(query)
        // 再次发生ajax请求获取到列表数据，渲染到tbody
        getList()
    })



    // 补零函数
    function paddZero(n) {
        return n < 10 ? "0" + n : n;
    }

    // 格式化时间
    function forTime(time) {
        // 1. 将time 转成对应的日期对象
        let d = new Date(time);

        // 2. 有了日期对象，可以去使用对应的方法来得到需要的年 月 日 ...
        let y = d.getFullYear();
        let month = paddZero(d.getMonth() + 1);
        let day = paddZero(d.getDate());
        let h = paddZero(d.getHours());
        let m = paddZero(d.getMinutes());
        let s = paddZero(d.getSeconds());

        // 需要将需要的时间格式给返回出去
        return `${y}/${month}/${day} ${h}:${m}:${s}`;
    }


    //删除功能
    // 删除的时候，发现当前页面如果没有了数据，就需要将页码pagenum - 1, 去加载上一页的数据
    // 页码最小值为1， 可以根据删除按钮的个数来做判断

    $('tbody').on('click', '.btn_delete', function () {
        // 获取当前按钮的自定义属性的id
        // console.log(1)
        let id = $(this).attr('data-id')
        //弹出询问框
        layer.confirm('确认删除吗？', { icon: 3, title: '提示' }, function (index) {
            //点击确认按钮的时候会执行回调函数

            //解决删除功能的bug
            if ($('.btn_delete').length === 1) {
                if (query.pagenum === 1) {
                    query.pagenum = 1
                } else {
                    query.pagenum = query.pagenum - 1
                }
            }
            //发送请求删除
            axios.get('/my/article/delete/' + id).then(function (res) {
                // console.log(res)
                if (res.data.status !== 0) {
                    return layer.msg('删除失败')
                }

                layer.msg('删除成功')

                getList()
            })
            // 关闭当前层
            layer.close(index);
        });
    })


})
