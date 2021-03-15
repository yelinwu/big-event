//放置ajax优化代码

//优化根路径
// axios的使用
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net';

// 优化headers请求头携带 Authorization 身份认证信息， axios拦截器
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么  config 是配置信息

    if (config.url.indexOf('/my') !== -1) {
        config.headers.Authorization = localStorage.getItem('token')
        // Authorization的值token， token的值是在登录的时候，存储到本地
    }
    // console.log('发送请求之前做的事', config)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log('数据响应回来', response)

    if (response.data.status === 1 &&
        response.data.message === '身份认证失败！') {
        // token 信息给删掉
        localStorage.removeItem('token')
        //跳转页面
        location.href = './login.html'
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});