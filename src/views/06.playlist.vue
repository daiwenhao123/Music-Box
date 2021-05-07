<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title" style="font-size: 22px;font-weight: bold;">{{playlist.name}}</p>
        <div class="author-wrap">
          <img class="avatar" :src="playlist.creator.avatarUrl" alt="" />
          <span class="name">{{playlist.creator.nickname}}</span>
          <span class="time">{{playlist.createTime|dateFormatToYMD}}</span>
        </div>
		<div style="display: flex;">
        <div class="play-wrap" style="border-radius: 20px;">
          <span class="iconfont icon-circle-play"></span>
          <span class="text" @click="playAllsongs(Musicid,Musicid[0])" style="font-size: 15px;">播放</span>		  
        </div>
		<div style=" width: 80px;height: 35px;border-radius: 20px;
		display: flex;align-items: center;justify-content: center;
		background-color: rgb(244, 244, 244);margin-left: 10px;border: 1px solid rgb(184, 184, 184);text-align: center;" icon="el-icon-circle-plus-outline">		  
		  <span class="text" style="font-size: 15px;text-align: center;" @click="collectLists">收藏</span>		  
		</div>
		</div>
        <div class="tag-wrap">
          <span class="title" style="font-weight: bold;">标签：</span>
          <ul>
            <li v-for="(item,index) in playlist.tags" :key="index" style="color: rgb(45, 48, 220);">{{item}}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title" style="font-weight: bold;">简介:</span>
          <span class="desc" style="color: rgb(161, 148, 156);">{{playlist.description}}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
            <tr class="el-table__row" v-for="(item,index) in tableData" :key="index">
              <td>{{index+1}}</td>
              <td>
                <div class="img-wrap" @click="playMusic(item.id)">
                  <img :src="item.al.picUrl" alt="" />
                  <span class="iconfont icon-play"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span class="iconfont icon-mv"></span>
                  </div>
                  <span>{{item.subTitle}}</span>
                </div>
              </td>
              <td>{{item.ar[0].name}}</td>
              <td>{{item.al.name}}</td>
              <td>{{item.dt|timeFormat}}</td>
            </tr>
            
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="评论" name="2">
		  <div style="background-color: rgb(236, 236, 236);width: 92%; height: 130px; margin-top: 20px; margin-bottom: 20px;">
		  	<el-input v-model="comment" placeholder="评论" type="textarea" 
			show-word-limit maxlength="120" style="display: inline-block;width: 98%;margin: 15px 15px;">
			</el-input>
		  	<el-button size="mini" style="float:right;margin:0 14px 0 0;" @click="sendComment">评论</el-button>
		  </div>
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">精彩评论<span class="number">({{hotCount}})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item,index) in hotComment" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}</span>
                  <span class="comment"> : {{item.content}}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length!=0" style="background-color: rgb(244, 244, 244);border-radius: 0px;">
                  <span class="name">{{item.beReplied[0].user.nickname}}</span>
                  <span class="comment"> : {{item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{item.time|dateFormat}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">最新评论<span class="number">({{total}})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item,index) in comments" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}</span>
                  <span class="comment"> : {{item.content}}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length!=0">
                  <span class="name">{{item.beReplied[0].user.nickname}}</span>
                  <span class="comment"> : {{item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{item.time|dateFormat}}</div>
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
          :page-size="5"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {sendComments} from '../network/sendComments.js'
import {collectList} from '../network/collectList.js'
import {getSongDetail} from '../network/getSongDetail.js'
import axios from 'axios'
export default {
  name: 'playlist',
  data() {
    return {
	  //输入的评论
	  comment:'',
	  t:1,
	  type:2,
      activeIndex: '1',
      // 总条数
      total: 0,
      // 页码
      page: 1,
	  //歌单详情数据
	  playlist:{},
	  //热门评论
	  hotComment:[],
	  //热门评论个数
	  hotCount:0,
	  //普通评论
	  comments:[],
	  //所有歌曲id
	  Musicid:[],
	  //歌曲数组
	  tableData:[]
	  
    };
  },
  created() {
  	axios({
		url:'https://autumnfish.cn/playlist/detail',
		method:'get',
		params:{
			id:this.$route.query.id
		}
	}).then(res=>{
		console.log(res)
		this.playlist = res.data.playlist
		this.tableData = res.data.playlist.tracks
		for(let i in this.tableData) {
			this.Musicid[i] = this.tableData[i].id
		}
	})
	//获取评论详情
	axios({
		url:'https://autumnfish.cn/comment/hot',
		method:'get',
		params:{
			id:this.$route.query.id,
			type:2
		}
	}).then(res=>{
		this.hotComment =res.data.hotComments
		this.hotCount = res.data.total
	})
	//最新评论
	this.getNewcomment()
  },
  watch:{
	  '$route.query.id' () {
		  axios({
		  	url:'https://autumnfish.cn/playlist/detail',
		  	method:'get',
		  	params:{
		  		id:this.$route.query.id
		  	}
		  }).then(res=>{
		  	// console.log(res)
		  	this.playlist = res.data.playlist
		  	this.tableData = res.data.playlist.tracks
		  	for(let i in this.tableData) {
		  		this.Musicid[i] = this.tableData[i].id
		  	}
		  })
	  }
  },
  methods: {
	//收藏
	collectLists() {
		this.collectList(1,this.$route.query.id)
	},
	collectList(t,id) {
		collectList(t,id).then(res=>{
			if(res.data.code == 200) {
				this.$message('收藏成功')
			} else {
				this.$message('已收藏')
			}
							
		})
	},
	//最新评论
	getNewcomment() {
		axios({
			url:'https://autumnfish.cn/comment/playlist',
			method:'get',
			params:{
				id:this.$route.query.id,
				limit:10,
				offset:0
			}
		}).then(res=>{
			//总数
			this.total = res.data.total
			//评论数据
			this.comments = res.data.comments
		})
	},
	//发送评论
	sendComment() {
		if(!this.comment){
			return this.$message.error('每当我打出？，不是我有问题，而是你有问题');
		}
		this.sendComments(this.t,this.type,this.$route.query.id,this.comment)
		// let timestamp = new Date().getTime()
	},
	// 发送评论 网络请求
	sendComments(t,type,id,content) {
		sendComments(t,type,id,content).then(res=>{
			console.log(res)
			if (res.data.code !== 200) {
				this.$message.error('用户未登陆，或遇到未知错误');
			}else{
				this.getNewcomment()
				this.comment = null
				this.$message.success('评论成功!数据同步可能会耗时!')
			}
			
		}).catch(error=>{
			console.log(error.response)
			if(error.response.data.code == 301) {
				this.$message.warning('您还未登陆',2000)
			}else{
				this.$message.warning('未知错误',2000)
			}
		})
	},
	playMusic(id) {
		axios({
			url:'https://autumnfish.cn/song/url',
			method:'get',
			params:{
				id
			}
		}).then(res=>{
			console.log(res)
			this.$parent.musicUrl = res.data.data[0].url;
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
	//播放全部(子传父)
	playAllsongs(songList,curId) {
		// console.log(this.Musicid)
		this.$emit('setSongListInfo',songList,curId)
		
	},
    handleCurrentChange(val) {
      this.page = val
	  axios({
	  	url:'https://autumnfish.cn/comment/playlist',
	  	method:'get',
	  	params:{
	  		id:this.$route.query.id,
	  		limit:10,
	  		offset:(this.page-1)*10
	  	}
	  }).then(res=>{
	  	//总数
	  	this.total = res.data.total
	  	//评论数据
	  	this.comments = res.data.comments
	  })
    }
  }
};
</script>

<style >

</style>
