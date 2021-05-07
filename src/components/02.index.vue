<template>
  <div class="index-container">	
    <div class="nav">      
	<leftmenu></leftmenu>
    </div>
    <div class="main">
	  <keep-alive>
      <router-view :isPlay="isPlay" :musicDuration="musicDuration" :musicId="musicId" @setSongListInfo="setSongListInfo"></router-view>
	  </keep-alive>
    </div>
    <div class="player" style="background-color: rgb(246, 246, 248);">
	  <div class="Music-audio" >
		  <img :src="musicSrc" @click="tosongDetail" />
		  <div class="Music-Info">
		  <p  class="Music-Info-name">{{musicName}}</p>
		  <p  class="Music-Info-Auth">{{musicAuth}}</p>
		  </div>
		  <div @click="changePrevMusic">
			  <img src="../assets/audio/prev.png" style="width: 30px;height: 30px;border-radius: 50%;"/>
		  </div>
		  <div>
			  <img src="../assets/audio/pauseMusic.png" v-if="isPlay"  @click="playMusic" style="width: 30px;height: 30px;border-radius: 50%;"/>
			  <img src="../assets/audio/playMusic.png" v-else @click="playMusic"  style="width: 30px;height: 30px;border-radius: 50%;"/> 
		  </div>
		  <div @click="changeNextMusic">
			  <img src="../assets/audio/next.png" style="width: 30px;height: 30px;border-radius: 50%;"/>
		  </div>
		  <div style="margin-right: 3px;margin-left: 15px;color: rgb(76, 76, 77)"><span >{{musicDuration|MusictimeFormat}}</span></div>
		  <div class="slide" >		  
			  <!--音乐播放进度条--> 
			  <el-slider v-model="musicDuration" :max="totalDuration" @change="musicDurationChange"
			             :show-tooltip="false" ></el-slider>	  
		  </div>
		  <div style="margin-left: 3px;;"><span>{{totalDuration|MusictimeFormat}}</span></div>
		  <div>
			  <img src="../assets/playmusic/songList.png" 
			   style="width: 27px; height: 30px;margin-right: 15px;
			   border: 1px solid rgb(235, 235, 235);" @click="showRightPlayList"/>
		  </div>
		 <el-dialog title="歌曲列表" :visible.sync="dialogTableVisible"  :append-to-body="true" :modal="false"  
		 center width="35%" v-if="dialogTableVisible">
		   <el-table :data="currentMusicListInfo" highlight-current-row stripe style="cursor: context-menu;position: relative;overflow: hidden;" max-height="363px" :fit="false">
		     <el-table-column property="name" label="歌曲名称" width="160" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"></el-table-column>
		     <el-table-column property="ar[0].name" label="姓名" width="150" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"></el-table-column>
		     <el-table-column property="dt" label="时间" width="100"></el-table-column>
		   </el-table>
		 </el-dialog>
	  </div>
      <audio :src='musicUrl' autoplay  class="playMusicAudio" ></audio>
    </div>
  </div>
</template>

<script>
import leftmenu from './common/leftmenu.vue'
import axios from 'axios'
import {getSongDetail} from '../network/getSongDetail.js'
export default {
  name: 'index',
  components:{
	leftmenu  
  },
  mounted() {
  	var audio =document.getElementsByClassName('playMusicAudio')[0]
  	audio.addEventListener("timeupdate", () => {
  	    //获取歌曲的总长度 example: 257s
  	    this.totalDuration = audio.duration
  	    //获取歌曲时间
  	    this.musicDuration = audio.currentTime
		if (audio.currentTime >= audio.duration) {
		    this.isPlay = false
		}
  	});
  },
  data() {
    return {
	  //播放地址
      musicUrl:'',
	  //歌曲封面
	  musicSrc:require("../assets/playmusic/Music.png"),
	  //歌曲名称
	  musicName:'',
	  //歌曲作者
	  musicAuth:'',
	  //歌曲id
	  musicId:'',
	  //总进度条
	  totalDuration:0,
	  //当前音乐的进度条
	  musicDuration:0,
	  //播放状态
	  isPlay:false,
	  playListInfo:window.localStorage.getItem('playList') === null ? [] : window.localStorage.getItem('playList').split(','),
	  dialogTableVisible:false,
	  currentMusicListInfo :[]
    };
  },
  watch: {
      //监听组件中的当前音乐id的变化 放入localstorage中供给各个组件使用
      musicId(newVal) {
          // window.localStorage.setItem('curPlayMusicId',newVal);
          //使用定义好的方法设置新的localstorage中的值 main.js中定义
          this.resetSetItem('curPlayMusicId', newVal);
      }
  },
  methods:{
	  tosongDetail() {
	  	  this.$router.push({
	  		  path:'/songDetail',
			  query:{
				  id:this.musicId				 
			  }
	  	  })
	  },
	  //接收子组件传来的id(歌单的id合集)
	  setSongListInfo(songList,curId) {
		  this.playListInfo = songList
		  console.log(this.playListInfo)
		  //将当前歌单信息放入localStorage
		  window.localStorage.setItem('playList', songList)
		  console.log(this.playListInfo)
		  this.playUrl(curId)
		  this.isPlay = true
	  },
	  //设置audio的各种信息
	  playMusic() {
	      var audio =document.getElementsByClassName('playMusicAudio')[0]
	      if (this.musicUrl !== '') {
	          if (!audio.paused) {
	              audio.pause()
	          } else {
	              audio.play()
	          }
	          this.isPlay = !this.isPlay
	      }     	      		  
	  },
	  musicDurationChange() {
		  var audio =document.getElementsByClassName('playMusicAudio')[0]
	      if (this.totalDuration === 0) return
	      audio.currentTime = this.musicDuration
	  },
	  playUrl(id) {
	  	axios({
	  		url:'https://autumnfish.cn/song/url',
	  		method:'get',
	  		params:{
	  			id
	  		}
	  	}).then(res=>{
	  		this.musicUrl = res.data.data[0].url;
			this.getSongDetail(id)
	  	})	
	  },
	  getSongDetail(ids) {
	  		  getSongDetail(ids).then(res=>{
	  				  console.log(res)
	  			  let src = res.data.songs[0].al.picUrl
	  			  let name = res.data.songs[0].name
	  			  let auth = res.data.songs[0].ar[0].name
	  			  let id = res.data.songs[0].id
	  			  this.musicSrc = src
	  			  this.musicName = name
	  			  this.musicAuth = auth
	  			  this.musicId = id
				 
	  		  })	  		  
	  },
	  //切换下一首歌
	  changeNextMusic() {
		  var nextOne = this.playListInfo.findIndex((target) =>{
			  return target === this.musicId
		  })
		  this.setSongListInfo(this.playListInfo,this.playListInfo[nextOne+1] || this.playListInfo[0])
		  this.isPlay = true
	  },
	  //切换上一首歌
	  changePrevMusic(){
		  var preOne = this.playListInfo.findIndex((target) =>{
		  			  return target === this.musicId
		  })
		  this.setSongListInfo(this.playListInfo,this.playListInfo[preOne-1] || this.playListInfo[this.playListInfo.length-1])
		  this.isPlay = true
	  },
	  showRightPlayList() {
		  this.dialogTableVisible = true
		  getSongDetail(window.localStorage.getItem('playList')).then(res=>{
			  //音频歌单列表
			  this.currentMusicListInfo = res.data.songs
			  this.currentMusicListInfo.forEach(item => {
			     //分钟
			     var minute = item.dt / 60000;
			     var minutes = parseInt(minute);
			     
			     if (minutes < 10) {
			       minutes = "0" + minutes;
			     }
			     
			     //秒
			     var seconds = parseInt(item.dt/1000%60);
			     
			     if (seconds < 10) {
			       seconds = "0" + seconds;
			     }
			     item.dt = `${minutes}:${seconds}`;
			  })
		  })
		  
		  
	  }
  }
};
</script>

<style >
	.Music-audio{
		display: flex;
		width: 100%;
		align-items: center;
		position: relative;
		z-index: 1;
	}
	.Music-audio img{
		width: 45px;
		height: 45px;
		border: 1px solid rgb(220, 220, 220);
		border-radius: 5px;
		margin-left: 25px;
	}
	.Music-Info{
		padding-left: 10px;
		width: 150px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.Music-Info-name{
		font-size: 15px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis; 
		white-space: nowrap;
		height: 25px;
	}
	.Music-Info-Auth{
		font-size: 5px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis; 
		white-space: nowrap;
		height: 20px;
	}
	.slide{
		width: 62%;
	}

</style>
