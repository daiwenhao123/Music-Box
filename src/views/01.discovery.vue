<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <el-carousel-item v-for="item in banners" :key="item.index" >
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title" style="border-bottom:1px solid rgb(125, 125, 125) ;">
        推荐歌单
      </h3>
      <div class="items">
        <div class="item" v-for="item in list" :key="item.index" @click="playMusicList(item.id)">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{item.copywriter}}</span>
            </div>
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{item.name}}</p>
        </div>  
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title" style="border-bottom:1px solid rgb(125, 125, 125) ;">
        最新音乐
      </h3>
      <div class="items">
        <div class="item" v-for="item in songs" :key="item.index">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span @click="playMusic(item.id)" class="iconfont icon-play"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{item.name}}</div>
            <div class="singer">{{item.song.artists[0].name}}</div>
          </div>
        </div>      
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title" style="border-bottom:1px solid rgb(125, 125, 125) ;">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="item in mvs" :key="item.index" @click="playMV(item.id)">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play" @click="playMusic(item.id)"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artistName}}</div>
          </div>
        </div>
       
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {getSongDetail} from '../network/getSongDetail.js'
export default {
  name: 'discovery',
  data() {
	  return {
		  banners:[],
		  list:[],
		  songs:[],
		  mvs:[]
	  }
  },
  created() {
  	axios({
  	  url:'https://autumnfish.cn/banner',
  	  method:'get',
  	}).then(res=>{
		console.log(res)
  	  this.banners = res.data.banners
  	})
	
	axios({
	  url:'https://autumnfish.cn/personalized',
	  method:'get',
	  params:{
		limit:20  
	  },
	}).then(res=>{
		
	  this.list = res.data.result
	})
	
	axios({
	  url:'https://autumnfish.cn/personalized/newsong',
	  method:'get',
	  params:{
	  		limit:20  
	  },
	}).then(res=>{
		this.songs = res.data.result  
	})
	axios({
	  url:'https://autumnfish.cn/personalized/mv',
	  method:'get',
	}).then(res=>{
	  this.mvs = res.data.result
	})
  },
  methods:{
	  playMusicList(id) {
		  let timestamp = new Date().getTime()
		  this.$router.push({
			  path:'/playlist',
			  query:{
				  id,
				  timestamp:timestamp
			  }
		  })
	  },
	  playMV(id) {
		  this.$router.push({
			  path:'/mv',
			  query:{
				  id
			  }
		  })
	  },
	  playMusic(id) {
		  axios({
			  url:'https://autumnfish.cn/song/url',
			  method:'get',
			  params:{
				  //id:id
				  id
			  }
		  }).then(res=>{
			  console.log(res)
			  let url = res.data.data[0].url
			  //$parent可以直接操控父组件的data中的数据
			  this.$parent.musicUrl = url
		  })
		  this.getSongDetail(id)		  
	  },
	  getSongDetail(ids) {
	  		  getSongDetail(ids).then(res=>{
				  console.log(res)
	  			  let src = res.data.songs[0].al.picUrl
	  			  let name = res.data.songs[0].al.name
	  			  let auth = res.data.songs[0].ar[0].name
				  let id = res.data.songs[0].id
	  			  this.$parent.musicSrc = src
	  			  this.$parent.musicName = name
	  			  this.$parent.musicAuth = auth
				  this.$parent.musicId = id
				  this.$parent.isPlay = true
	  		  })	  		  
	  },
  }
};
</script>

<style >

</style>
