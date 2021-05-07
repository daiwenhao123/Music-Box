<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="topList.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">
          {{topList.name}}
        </div>
        <div class="info">
          {{topList.description}}
        </div>
      </div>
      <img :src="topList.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
		<div v-for="(item,index) in titles" :key="index">
			<span class="item" :class="{active:index===currentIndex}" @click="tagactive(index)">{{item}}</span>
		</div>
        
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="item in list" :key="item.index" @click="playMusic(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount|MvCountFormat}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="10"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'recommend',
  data() {
    return {
	  currentIndex:0,
      titles:['全部','欧美','华语','流行','说唱','摇滚','民谣','电子','轻音乐','影视原声','ACG','怀旧','治愈','旅行'],
      // 总条数
      total:0,
      // 页码
      page:1,
	  topList:{},
	  list:[]
    };
  },
  //监听器
  watch:{
  	  currentIndex() {
  		  this.topData()
  		  this.page = 1
  		  this.listData()
  	  }
  },
  created() {
	//顶部的精品歌单
	this.topData()
	//歌单列表
	this.listData()
  },
  methods: {
	playMusic(id){
		this.$router.push({
			path:'/playlist',
			query:{
				id:id
			}
		})
	},
	//抽取的方法1 顶部的数据
	topData() {
		//顶部的精品歌单
		axios({
			url:'https://autumnfish.cn/top/playlist/highquality',
			method:'get',
			params:{
				limit:1,
				cat:this.titles[this.currentIndex]
			}
		}).then(res=>{
			this.topList = res.data.playlists[0]
		})
	},
	//抽取的方法2 列表的数据
	listData() {
		//歌单列表
		axios({
			url:'https://autumnfish.cn/top/playlist',
			method:'get',
			params:{
				limit:30,
				offset:(this.page-1)*10,
				cat:this.titles[this.currentIndex]
			}
		}).then(res=>{
			this.total = res.data.total
			this.list = res.data.playlists
		})
	},
    handleCurrentChange(val) {
     // console.log(`当前页：${val}`)
	 this.page = val
	 this.listData()
	  
	  
    },
	tagactive(index) {
		this.currentIndex = index
	}
  }
};
</script>

<style >

</style>
