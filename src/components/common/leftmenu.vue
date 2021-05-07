<template>
	
	<div class="menu" >
		<el-container style="height: 500px; border: 1px solid #eee">
			<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
			<el-menu
			  @open="handleOpen"
			  @close="handleClose"
			  default-active = "1-2" 
			  class="el-menu-vertical-demo">
			  <el-submenu index="1">
			    <template slot="title">
			      <span class="iconfont icon-find-music" style="padding-right: 5px;"></span>
			      <span>发现音乐</span>
			    </template>
			    <el-menu-item-group>			      
			      <el-menu-item index="1-2" @click="RecommendMusic">推荐</el-menu-item>
			      <el-menu-item index="1-3" @click="toSonglist">精品歌单</el-menu-item>
				  <el-menu-item index="1-4" @click="toNewSong">新歌速递</el-menu-item>
			    </el-menu-item-group>			   			    
			  </el-submenu>
			  <el-menu-item index="2-1">
			    <span class="iconfont icon-mv" style="padding-right: 7px;"></span>
			    <span slot="title" @click="toMv">最新MV</span>
			  </el-menu-item>			  
			 <el-submenu index="2">
			   <template slot="title">
			     <span class="iconfont icon-find-music" style="padding-right: 5px;"></span>
			     <span>我的收藏</span>
			   </template>
			   <el-menu-item-group>			      
			     <el-menu-item :index="item.index" @click="changePlaylistId(item.id)" v-for="item in Myplaylist"
				  :key="item.index" v-if="item.subscribed" class="mycol"
				  >{{item.name}}</el-menu-item>			     
			   </el-menu-item-group>			   			    
			 </el-submenu>
			</el-menu>
			</el-aside>
			</el-container>
	</div>	
	
</template>

<script>
  import {getCollInfo} from '../../network/getCollInfo.js'
  export default {
    name:'leftmenu',
	data() {
		return {
			currentUserInfo:
			window.localStorage.getItem("currentUserInfo")==="null"
			?null
			:JSON.parse(window.localStorage.getItem("currentUserInfo")),
			Myplaylist:[]
		}
	},
	created() {
		this.getCollInfo(this.currentUserInfo.userId)
	},
	methods:{
		handleOpen(key, keyPath) {
		     console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
		     console.log(key, keyPath);
		},
		RecommendMusic() {
			
			this.$router.push('/discovery')
		},
		toSonglist() {
			
			this.$router.push('/playlists')
		},
		toNewSong() {
			
			this.$router.push('/songs')
		},
		toMv() {
			
			this.$router.push('/mvs')
		},
		//获取歌单列表
		getCollInfo(uid) {
			getCollInfo(uid).then(res=>{
				console.log(res)
				this.Myplaylist = res.data.playlist				
			})
		},
		//切换歌单的id
		changePlaylistId(id) {
			this.$router.push({
				path:'/playlist',
				query:{
					id
				}
			})
		}
	}
  }
</script>

<style scoped>
	
	/* overflow 前置条件 */
	.mycol{
		overflow: hidden;
		text-overflow: ellipsis; 
		white-space: nowrap;
		
	}
</style>

