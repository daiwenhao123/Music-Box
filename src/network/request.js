import axios from 'axios'
export function request(config) {
    const instance1 = axios.create({
        // baseURL: 'https://autumnfish.cn/',
        baseURL: '/api',
        timeout: 30000,
    })
    //请求拦截和响应拦截
  //   instance1.interceptors.request.use(config => {
  //       // console.log(config);
  //       return config;
  //   }, err => {
  //       // console.log(err);
  //   })
  //   instance1.interceptors.response.use(res => {
  //       // console.log(res.data);
  //       return res.data;
  //   },err => {
  //       console.log(err.response);
		// // if(err.response.data.code!==200) {
		// // 	this.$toast.show("该手机号码不存在或未注册", 2000);
		// // }
  //   })
    //axios.create的返回值是一个promise对象！
    return instance1(config);
}