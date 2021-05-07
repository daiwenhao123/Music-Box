<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">{{mvInfo.name}}</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
		  autoplay
          :src="url"
        ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="icon" alt="" />
          </div>
          <span class="name">{{mvInfo.artistName}}</span>
        </div>
        <div class="mv-info">
          <!-- <h2 class="title">{{mvInfo.name}}</h2> -->
          <span class="date">发布：{{mvInfo.publishTime|dateFormatToYMD}}</span>
          <span class="number">播放：{{mvInfo.playCount}}</span>
          <p class="desc">
            {{mvInfo.desc}}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
	  <div style="background-color: rgb(231, 231, 231);width: 94%; height: 130px; margin-top: 20px; margin-bottom: 20px;">
	  	<el-input v-model="comment" placeholder="评论" type="textarea" 
	  			show-word-limit maxlength="120" style="display: inline-block;width: 98%;margin: 10px 10px;">
	  			</el-input>
	  	<el-button size="mini" style="float:right;margin:0 14px 0 0;" @click="sendComment">评论</el-button>
	  </div>
      <div class="comment-wrap">
        <p class="title" style="font-size: 20px; font-weight: 500;">精彩评论<span class="number">({{total}})</span></p>
        <div class="comments-wrap" >
          <div class="item" v-for="item in hotComments" :key="item.index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{item.user.nickname}}: </span>
                <span class="comment">{{item.content}}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length!=0">
                <span class="name">{{item.beReplied[0].user.nickname}}</span>
                <span class="comment">: {{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{ item.time | dateFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title" style="font-size: 20px; font-weight: 500;">最新评论<span class="number">({{total}})</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="item in comments" :key="item.index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length != 0">
                <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                <span class="comment">{{ item.beReplied[0].content }}</span>
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
        :limit="limit"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend" style="border-left: 2px solid rgb(232, 232, 232);">
      <h3 class="title" style="font-size: 15px; padding-left: 8px;">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item,index) in simiMvs" :key="index" @click="playMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount|MvCountFormat}}</div>
              </div>
              <span class="time">{{item.duration|timeFormat}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {sendComments} from '../network/sendComments.js'
import axios from 'axios'
import {formatDate} from "../common/utils.js" 
export default {
  name: 'mv',
  data() {
    return {
	  comment:'',
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 10,
	  //mv地址
	  url:'',
	  //相关mv
	  simiMvs:[],
	  //mv的信息
	  mvInfo:{},
	  icon:'',
	  //热门评论
	  hotComments:[],
	  comments:[]
    };
  },
  created() {
	//mv播放地址
  	this.getMusicUrl()
	
	//获取相关的mv
	this.getRelateMv()
	//获取mv信息
	this.getMVinfo()
	//获取mv评论
	this.getMvComment()
  },
  
  methods: {
		  sendComment() {
		  	if(!this.comment){
		  		return this.$message.error('每当我打出？，不是我有问题，而是你有问题');
		  	}
		  	this.sendComments(1,1,this.$route.query.id,this.comment)
		  	// let timestamp = new Date().getTime()
		  },
		  // 发送评论 网络请求
		  sendComments(t,type,id,content) {
		  	sendComments(t,type,id,content).then(res=>{
		  		console.log(res)
		  		if (res.data.code !== 200) {
		  			this.$message.error('用户未登陆，或遇到未知错误');
		  		}else{		  			
		  			this.comment = null
		  			this.$message.success('评论成功!数据同步可能会耗时!')
		  		}
		  		
		  	})
		  },
	  getMusicUrl() {
		axios({
			url:'https://autumnfish.cn/mv/url',
			method:'get',
			params:{
				id:this.$route.query.id
			}
		}).then(res=>{
			// console.log(res)
			this.url = res.data.data.url
		})
	  },
	  getRelateMv() {
		  axios({
		  	url:'https://autumnfish.cn/simi/mv',
		  	method:'get',
		  	params:{
		  		mvid:this.$route.query.id
		  	}
		  }).then(res=>{
		  	// console.log(res)
		  	this.simiMvs = res.data.mvs
		  })
	  },
	  getMVinfo() {
		 axios({
		 	url:'https://autumnfish.cn/mv/detail',
		 	method:'get',
		 	params:{
		 		mvid:this.$route.query.id
		 	}
		 }).then(res=>{
		 	// console.log(res)
		 	this.mvInfo = res.data.data
		 	axios({
		 		url:'https://autumnfish.cn/artists',
		 		method:'get',
		 		params:{
		 			id:this.mvInfo.artists[0].id
		 		}
		 	}).then(res=>{
		 		// console.log(res)
		 		this.icon = res.data.artist.picUrl		
		 	})
		 }) 
	  },
	  getMvComment() {
		  axios({
		  	url:"https://autumnfish.cn/comment/mv",
		  	method:'get',
		  	params:{
		  		id:this.$route.query.id,
		  		limit:10,
		  		offset:(this.page-1)*10
		  	}
		  }).then(res=>{
		  	console.log(res)
		  	this.hotComments = res.data.hotComments
		  	this.comments = res.data.comments;
		  	this.total = res.data.total;		  	
		  })
	  },
	  playMv(id){
		this.$router.push({
			path:'/mv',
			query:{
				id:id
			}
		})
	  },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
	  this.page = val
	  this.getMvComment()
    }
  },
  watch: {
    '$route.query.id'() {
      this.page = 1;
     this.getMusicUrl()
     this.getRelateMv()     
     this.getMVinfo()   
     this.getMvComment()
    }
  },
};
</script>

<style></style>
