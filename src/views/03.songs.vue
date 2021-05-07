<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item" @click="tag=0" :class="{active:tag==0}">全部</span>
      <span class="item" @click="tag=7" :class="{active:tag==7}">华语</span>
      <span class="item" @click="tag=96" :class="{active:tag==96}">欧美</span>
      <span class="item" @click="tag=8" :class="{active:tag==8}">日本</span>
      <span class="item" @click="tag=16" :class="{active:tag==16}">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr class="el-table__row" v-for="(item,index) in lists" :key="index">
          <td>{{index+1}}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.picUrl" alt="" />
              <span class="iconfont icon-play" @click="playMusic(item.id)"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{item.name}}</span>
                <span class="iconfont icon-mv"></span>
              </div>
              <span>电视剧加油练习生插曲</span>
            </div>
          </td>
          <td>{{item.album.artists["0"].name}}</td>
          <td>{{item.album.name}}</td>
          <td>{{item.duration|timeFormat}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import {getSongs} from '../network/getSongs.js'
import {getSongDetail} from '../network/getSongDetail.js'
export default {
  name: 'songs',
  watch:{
	tag() {
		this.getSongs()
	}  
  },
  data() {
    return {
		lists:[],
		tag:0
    };
  },
  created() {
  	this.getSongs()
  },
  methods:{	  
	  getSongs() {
		 getSongs(this.tag).then(res=>{
			 console.log(res)
			 this.lists = res.data.data
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
