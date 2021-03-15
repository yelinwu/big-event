$(function () {

    let layer = layui.layer
    let laypage = layui.laypage;

    let query = {
        pagenum: 1,////页码值
        pagesize: 2,//每页显示多少条数据
        cate_id: '',//文章分类的Id
        state: '',//文章的状态，可选值
    }
    axios.get('/my/article/list', {
        params: query
    }).then(function (res) {
        // console.log(res)
        if (res.data.status !== 0) {
            // 获取失败
            return layer.msg(res.data.message)
        }
        // 获取成功
        // 遍历data数据。创建tr添加到tbody中
        res.data.data.forEach(function (item) {
            console.log(item)
            $(`<tr>
            <td>${item.title}</td>
            <td>${item.cate_name}</td>
            <td>${forTime(item.pub_date)}</td>
            <td>${item.state}</td>
            <td>
              <button type="button"  class="layui-btn layui-btn-xs btn_edit">编辑</button>
              <button type="button"  class="layui-btn layui-btn-danger layui-btn-xs btn_delete">删除</button>
            </td>
          </tr>`).appendTo('tbody')
        });

    })

    // 实现分页
    layui.use('laypage', function () {


        //执行一个laypage实例
        laypage.render({
            elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
            , count: 50 //数据总数，从服务端得到
        });
    });


















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

})