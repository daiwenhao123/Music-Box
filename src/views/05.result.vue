<template>
	<div class="result-container">
		<div class="title-wrap">
			<h2 class="title">{{$route.query.val}}</h2>
			<span class="sub-title">找到{{count}}个结果</span>
		</div>
		<el-tabs v-model="activeIndex">
			<el-tab-pane label="歌曲" name="songs">
				<table class="el-table">
					<thead>
						<th></th>
						<th>音乐标题</th>
						<th>歌手</th>
						<th>专辑</th>
						<th>时长</th>
					</thead>
					<tbody>
						<tr class="el-table__row" v-for="(item,index) in songList" :key="index" @dblclick="playMusic(item.id)">
							<td>{{index+1}}</td>
							<td>
								<div class="song-wrap">
									<div class="name-wrap">
										<span>{{item.name}}</span>
										<span v-if="item.mvid!=0" class="iconfont icon-mv"></span>
									</div>
									<span v-if="item.alias.length!=0">{{item.alias[0]}}</span>
								</div>
							</td>
							<td>{{item.artists[0].name}}</td>
							<td>{{item.album.name}}</td>
							<td>{{item.duration}}</td>
						</tr>

					</tbody>
				</table>
			</el-tab-pane>
			<el-tab-pane label="歌单" name="lists">
				<div class="items">
					<div class="item" v-for="(item,index) in playlists" :key="index" @click="toPlaylist(item.id)">
						<div class="img-wrap">
							<div class="num-wrap">
								播放量:
								<span class="num">{{item.playCount}}</span>
							</div>
							<img :src="item.coverImgUrl" alt="" />
							<span class="iconfont icon-play"></span>
						</div>
						<p class="name">{{item.name}}</p>
					</div>
					
				</div>
			</el-tab-pane>
			<el-tab-pane label="MV" name="mv">
				<div class="items mv">
					<div class="item" v-for="(item,index) in mv" :key="index" @click="toMV(item.id)">
						<div class="img-wrap">
							<img :src="item.cover" alt="" />
							<span class="iconfont icon-play"></span>
							<div class="num-wrap">
								<div class="iconfont icon-play"></div>
								<div class="num">{{item.playCount}}</div>
							</div>
							<span class="time">{{item.duration}}</span>
						</div>
						<div class="info-wrap">
							<div class="name">{{item.name}}</div>
							<div class="singer">{{item.artistName}}</div>
						</div>
					</div>
					
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import axios from 'axios'
	import {getSongDetail} from '../network/getSongDetail.js'
	export default {
		name: 'result',
		data() {
			return {
				//tab切换时改变的字段
				activeIndex: 'songs',
				//保存 查询仅供歌曲字段
				songList: [],
				//保存 查询结果歌单的字段
				playlists:[],
				//保存mv的字段
				mv:[],
				//搜索结果的总数
				count: 0

			}
		},
		watch:{
			activeIndex() {
				let type = 1;
				let limit = 10 
				switch(this.activeIndex) {
					case 'songs':
						type = 1;
						limit = 10
						break;
					case 'lists':
						type = 1000;
						limit = 10
						break;
					case 'mv':
						type = 1004;
						limit = 8
						break;
				}
				axios({
					url: 'https://autumnfish.cn/search',
					method: 'get',
					params: {
						keywords: this.$route.query.val,
						type: type,//字段不同返回的参数也不同
						limit
					}
				}).then(res => {
					if(type == 1) {
						this.songList = res.data.result.songs
						this.count = res.data.result.songCount
						for (let i in this.songList) {
							let min = parseInt(this.songList[i].duration / 1000 / 60)
							if (min < 10) {
								min = '0' + min
							}
							let sec = parseInt(this.songList[i].duration / 1000 % 60)
							if (sec < 10) {
								sec = '0' + sec
							}
							this.songList[i].duration = min + ':' + sec
						}
					} else if(type==1000) {
						
						//歌单的逻辑
						this.playlists = res.data.result.playlists
						//总数
						this.count = res.data.result.playlistCount
						for(let i in this.playlists) {
							if(this.playlists[i].playCount>100000) {
								this.playlists[i].playCount = parseInt(this.playlists[i].playCount/10000)+'万'
							}
						}
					}else {
						//保存mv数据
						this.mv = res.data.result.mvs
						//总数
						this.count = res.data.result.mvCount
						//时间
						for (let i in this.mv) {
							let min = parseInt(this.mv[i].duration / 1000 / 60)
							if (min < 10) {
								min = '0' + min
							}
							let sec = parseInt(this.mv[i].duration / 1000 % 60)
							if (sec < 10) {
								sec = '0' + sec
							}
							this.mv[i].duration = min + ':' + sec
							if(this.mv[i].playCount>100000) {
								this.mv[i].playCount = parseInt(this.mv[i].playCount/10000)+'万'
							}
							
						}
					}
				})
			},
			'$route.query.val'() {
				this.getResult()
			}
		},
		created() {
			this.getResult()
		},
		methods: {
			getResult() {
				axios({
					url: 'https://autumnfish.cn/search',
					method: 'get',
					params: {
						keywords: this.$route.query.val,
						type: 1,
						limit: 10
					}
				}).then(res => {
					this.songList = res.data.result.songs
					this.count = res.data.result.songCount
					for (let i in this.songList) {
						let min = parseInt(this.songList[i].duration / 1000 / 60)
						if (min < 10) {
							min = '0' + min
						}
						let sec = parseInt(this.songList[i].duration / 1000 % 60)
						if (sec < 10) {
							sec = '0' + sec
						}
						this.songList[i].duration = min + ':' + sec
					}
				})
			},
			toMV(id) {
				this.$router.push({
					path:'/mv',
					query:{
						id:id
					}
				})
			},
			
			playMusic(id) {
				axios({
					url: 'https://autumnfish.cn/song/url',
					method: 'get',
					params: {
						//id:id
						id
					}
				}).then(res => {
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
			toPlaylist(id) {
				//跳转并携带数据
				this.$router.push({
					path:'playlist',
					query:{
						id:id
					}
				})
			}
		}
	};
</script>

<style>

</style>
