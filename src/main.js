import Vue from 'vue'
import App from './App.vue'

// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 插件 Element-ui
Vue.use(ElementUI)

// 导入全局初始化样式
import './assets/index.css'
import $ from 'jquery'
// 路由整合
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import axios from 'axios'
//配置请求根路径 跨域在vue.config.js中
axios.defaults.baseURL = '/api';
Vue.config.productionTip = false;
// 导入对应的路由
import toast from './components/common/toast/index.js'
const discovery = () =>  import ('./views/01.discovery.vue');
const playlists = () => import ('./views/02.playlists.vue');
const songs = () =>import ('./views/03.songs.vue');
const mvs = () => import ('./views/04.mvs.vue');
const result = () => import ('./views/05.result.vue');
const playlist = () => import ('./views/06.playlist.vue');
const mv = () => import ('./views/07.mv.vue');
const songDetail = () => import('./views/songDetail.vue')
const Myinfo = () =>  import ('./components/common/My/Myinfo.vue');
const UpdateInfo = () => import ('./components/common/My/UpdateInfo.vue') 
Vue.use(toast)

//全局vue过滤器(时间戳过滤器)
Vue.filter('dateFormat',function (originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth()+ 1 +'').padStart(2,'0')
    const d = (dt.getDate() + '').padStart(2,'0')

    const hh = (dt.getHours() + '').padStart(2,'0')
    const mm = (dt.getMinutes() + '').padStart(2,'0')
    const ss = (dt.getSeconds() + '').padStart(2,'0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//全局vue过滤器(时间戳过滤器成2020-08-23)
Vue.filter('dateFormatToYMD',function (originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth()+ 1 +'').padStart(2,'0')
    const d = (dt.getDate() + '').padStart(2,'0')


    return `${y}-${m}-${d}`
})

//全局过滤器(秒数转化为分钟)
Vue.filter('timeFormat',function (time) {

  //分钟
  var minute = time / 60000;
  var minutes = parseInt(minute);

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  //秒
  var seconds = parseInt(time/1000%60);
  
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return `${minutes}:${seconds}`;
})
Vue.filter('MusictimeFormat',function (time) {

  //分钟
  var minute = time / 60;
  var minutes = parseInt(minute);

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  //秒
  var seconds = parseInt(time%60);
  
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return `${minutes}:${seconds}`;
})
//全局过滤器(播放量转化为万)
Vue.filter('MvCountFormat',function (Count) {
	if(Count>10000) {
		return parseInt(Count/10000) +"万"
	}
	return Count
})

//监听localstorage中的 curPlayMusicId
Vue.prototype.resetSetItem = function (key, newVal) {
    if (key === 'curPlayMusicId') {

        // 创建一个StorageEvent事件
        var newStorageEvent = document.createEvent('StorageEvent');
        const storage = {
            setItem: function (k, val) {
                localStorage.setItem(k, val);

                // 初始化创建的事件
                newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

                // 派发对象
                window.dispatchEvent(newStorageEvent)
            }
        }
        return storage.setItem(key, newVal);
    }else if(key === 'currentId'){
        // 创建一个StorageEvent事件
        var newStorageEvent = document.createEvent('StorageEvent');
        const storage = {
            setItem: function (k, val) {
                localStorage.setItem(k, val);

                // 初始化创建的事件
                newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

                // 派发对象
                window.dispatchEvent(newStorageEvent)
            }
        }
        return storage.setItem(key, newVal);
    }
}

const router = new VueRouter({
  // mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/discovery'
    },
    {
      // 发现音乐
      path: '/discovery',
      component: discovery
    },
    {
      // 推荐歌单
      path: '/playlists',
      component: playlists
    },
    {
      // 推荐歌单
      path: '/playlist',
      component: playlist
    },
    {
      // 最新音乐
      path: '/songs',
      component: songs
    },
    {
      // 最新音乐
      path: '/mvs',
      component: mvs
    },
    // mv详情
    {
      path: '/mv',
      component: mv
    },
    // 搜索结果页
    {
      path: '/result',
      component: result
    },
	//歌曲详情页
	{
	  path: '/songDetail',
	  component: songDetail
	},
	//我的主页
	{
	  path: '/Myinfo',
	  component: Myinfo 
	},
	{
	  path:'/UpdateInfo',
	  component:UpdateInfo	
	}
  ]
})
/**
 * 原型链挂载
 * @type {AxiosStatic}
 */
// Vue.prototype.$http = axios;
// Vue.prototype.$ = $;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 挂载到Vue示例上
  router
}).$mount('#app')
