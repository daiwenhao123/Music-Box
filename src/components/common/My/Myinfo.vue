<template>
	<div class="Myinfo">
		<div class="Myinfo-top">
			<div class="top-left">
			<img :src="img" style="width: 180px;height: 180px; border: 1px solid rgb(234, 234, 234);padding: 5px;"/>
			</div>
			<div class="top-right">
			<div class="Username">
			{{Username}}
			<img src="../../../assets/My/man.png" style="width: 30px;height: 30px;border-radius: 50%;" v-if="isMan"/>
			<img src="../../../assets/My/woman.png" style="width: 30px;height: 30px;border-radius: 50%;" v-if="!isMan"/>
			</div>
			<div class="introduction">个人介绍：{{introduction}}</div>

			<div class="createTime">创建时间：{{createTime|dateFormatToYMD}}</div>
			<div class="introduction">生日：{{birthday|dateFormatToYMD}}</div>
			</div>
		</div>
		<div style="width: 90%;border-bottom: 2px solid rgb(255, 0, 0);padding-bottom: 5px;margin-top: 25px;">
		<span style="font-size: 22px;color: #4f4f4f;">我收藏的歌单</span>
		</div>
		<div class="Myinfo-bottom">
			<div class="playlist">
				<div class="playlist-item" v-for="item in Myplaylist" :key="item.index" @click="toplaylist(item.id)">
					<div class="recommend">
						<span>播放量：{{item.playCount|MvCountFormat}}</span>
					</div>
					<img :src="item.coverImgUrl" style="width: 180px;height: 180px;"/>
					<div class="icon">
						<div class="sjx"></div>
					</div>
					<div class="playlist-name">
						{{item.name}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  import {getCollInfo} from '../../../network/getCollInfo.js'
  import {getUserDetail} from '../../../network/getUserDetail.js'
  export default {
    name:'Myinfo',
	data() {
		  return {
			  Username:'',
			  gender:'',
			  introduction:'',
			  img:'',
			  createTime:'',
			  birthday:'',
			  playCount:'',
			  currentUserInfo:
			  window.localStorage.getItem("currentUserInfo")==="null"
			  ?null
			  :JSON.parse(window.localStorage.getItem("currentUserInfo")),
			  Myplaylist:[]
		  }
	},
	computed:{
		isMan() {
			return this.gender == 1
		}
	},
	created() {
		this.getUserDetail()
		this.getCollInfo(this.currentUserInfo.userId)
	},
	methods:{
		//二级城市转换
		getCityText3(id) {
		    if(!id){
		        return [];
		    }
		    for(var i in provinces){
		        if(provinces[i].id == id){
		            return [provinces[i].text];
		        }
		        if(provinces[i].id.substr(0,2) != id.substr(0,2)){
		            continue;
		        }
		 
		        var citys = provinces[i].children;
		        for(var j in citys){
		            if(citys[j].id == id){
		                return [provinces[i].text,citys[j].text];
		            }
		 
		        }
		    }
		},
		//实际操作转换函数
		getCityText4() {
		    var arr = getCityText3(id);
		    return arr[0]+"/"+arr[1];
		},
		getUserDetail() {
			getUserDetail().then(res=>{
				console.log(res)
				this.Username = res.data.profile.nickname
				this.img = res.data.profile.avatarUrl
				this.introduction = res.data.profile.signature
				this.createTime = res.data.profile.createTime
				this.birthday = res.data.profile.birthday
				this.gender = res.data.profile.gender
			})
		},
		getCollInfo(uid) {
			getCollInfo(uid).then(res=>{
				console.log(res)
				this.Myplaylist = res.data.playlist
			})
		},
		toplaylist(id) {
			this.$router.push({
				path:'/playlist',
				query:{
					id
				}
			})
		}
	}
  };
</script>

<style scoped>
	.Myinfo{
		display: flex;
		justify-content: center;
		width: 100%;
		align-items: center;
		flex-direction: column;
	}
	.Myinfo-top{
		display: flex;
		width: 90%;
		padding-top: 35px;
	}
	.top-left{
		width: 200px;
	}
	.top-right{
		display: flex;
		flex-direction: column;
		flex: 1;
		justify-content: space-between;
		padding-top: 5px;
		padding-bottom: 5px;
	}
	.Username{
		font-size: 25px;
		padding-bottom: 10px;
		border-bottom: 1px solid rgb(150, 150, 150);
		height: 50px;
		display: flex;
		align-items: center;
	}
	.Username img {
		margin-left: 15px;
	}
	.introduction{
		color: #626262;
		height: 25px;
	}
	.createTime{
		color: #626262;
		height: 25px;
	}
	.Myinfo-bottom{
		width: 90%;
		margin-top: 25px;
	}
	.playlist{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.playlist-item{
		width: 20%;
		padding-bottom: 15px;
		position: relative;
		overflow: hidden;
	}
	.recommend{
		position: absolute;
		top: 0;
		left: 0;
		font-size: 14px;
		color: white;
		line-height: 30px;
		background: rgba(0, 0, 0, 0.5);
		height: 30px;
		width: 91%;
		padding-left: 5px;
		top: -30px;
		overflow: hidden;
	}
	.playlist-item:hover .recommend{
		top: 0;
	}
	.playlist-name{
		padding-top: 5px;
		width: 180px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
	}
	.icon {
		position: absolute;
		right: 20px;
		bottom: 50px;
		width: 40px;
		height: 40px;
		color: #dd6d60;
		background: rgb(255, 255, 255);
		border-radius: 50%;
		color: #C3473A;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.8);
		opacity: 0;
	}
	.playlist-item:hover .icon{
		opacity: 1;
	}
	.icon ::before{
		transform: translateX(3px);
	}
	.sjx {
		width: 0;
		height: 0;
		border-left: 15px solid rgb(204, 61, 32);
		border-bottom: 9px solid transparent;
		/* border-right: 10px solid transparent; */
		border-top: 9px solid transparent;
		margin-left: 8px;
		/* border-radius: 3px; */
	}
</style>

