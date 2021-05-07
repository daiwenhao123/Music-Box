<template>
	<div class="top-container">
		<div class="left-box">
			<div class="icon-wrapper" style="display: flex;align-items: center;">
				<el-dropdown @command="handleCommand">
				  <img :src="userImg" style="width: 35px; height: 35px; border:1px solid #EBEBEB; border-radius: 20px; margin-right:5px ;" v-show="currentUserInfo" class="el-dropdown-link">
				  <el-dropdown-menu slot="dropdown">
				    <el-dropdown-item command="a" icon="el-icon-user-solid">我的主页</el-dropdown-item>
				    <el-dropdown-item command="b" icon="el-icon-s-tools">个人设置</el-dropdown-item>
				  </el-dropdown-menu>
				</el-dropdown>
				
				<span style="fontSize:13px; color: #e7e7e7;" v-if="currentUserInfo">{{currentUserInfo.nickname}}</span>
				<el-button type="text" @click="dialogVisible = true" v-if="currentUserInfo == null">登录</el-button>
				<el-button type="text" @click="logout"
                 v-if="currentUserInfo !== null"
				 size="mini"
				 style="margin-top: 10px;margin-left: 15px;">退出</el-button>
				 <el-dialog title="请登录" :visible.sync="dialogVisible" width="25%" :append-to-body="true" scroll-lock="false">
					 <el-form ref="form" :model="form" label-width="80px" :rules="loginInfoRules" >
					   <el-form-item label="手机号码" :label-width="formLabelWidth">
					     <el-input v-model="form.phone" placeholder="注册网易云音乐的手机号"></el-input>
					   </el-form-item>
					   <el-form-item label="密码" :label-width="formLabelWidth">
					     <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
					   </el-form-item>
																  
					 </el-form>
					 <div slot="footer" class="dialog-footer">
					 <el-button type="primary" @click="onSubmit">登录</el-button>
					 <el-button @click.native="cancelLogin">取消</el-button>
					 </div>
				 </el-dialog>
			</div>
			<div class="history-wrapper">
				<span class="iconfont icon-arrow-lift" style="background-color: #ebebeb;"></span>
			</div>
		</div>
		<div class="right-box">
			<div class="el-input el-input--small el-input--prefix">
				<input type="text" style="border-radius: 25px;background-color: #ffffff;" autocomplete="off" placeholder="寻找你的歌" class="el-input__inner" v-model="inputValue" @keyup.enter="toResult" />
				<span class="el-input__prefix">
					<i class="el-input__icon el-icon-search"></i>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	import {getPhoneLogin,getPhoneLoginOut} from '../network/login.js'
	export default {
		name: 'top',
		data() {
			return {
				//输入的内容
				inputValue: '',
				//头像
				userImg:'',
				//是否显示登录页
				dialogVisible: false,
				//表单数据
				form:{
					phone:'',
					password:''
				},
				loginInfoRules: {
				  phone: [{ required: true, message: " ", trigger: "blur" }],
				  password: [{ required: true, message: " ", trigger: "blur" }],
				},// 登录格式的校验
				currentUserInfo:
				window.localStorage.getItem("currentUserInfo")==="null"
				?null
				:JSON.parse(window.localStorage.getItem("currentUserInfo")),
				formLabelWidth:'120px'//登录内输入框的宽度
			}
		},
		methods: {
			//登录点击事件
			onSubmit() {
				this.getPhoneLogin(this.form.phone, this.form.password)
				// this.$router.push('/')
				
			},
			//登录后取消
			cancelLogin() {
			  this.dialogVisible = false;
			},
			//退出登录点击事件
			logout() {
				console.log('退出登录')
				// this.$router.push('/')
				this.getPhoneLoginOut()
			},
			//登录网络请求
			getPhoneLogin(phone,password) {
				getPhoneLogin(phone,password).then(res=>{
					console.log(res)
					if(res.data.code!==200) {
						this.dialogVisible = true;
						this.$toast.show(res.data.message, 2000);
						return;
					}else if(res.data.code==200) {
						//保存cookie的信息
						// window.localStorage.setItem('musicCookie', res.data.cookie)
						//保存用户信息,退出时删除
						window.localStorage.setItem(
						  "currentUserInfo",
						  JSON.stringify(res.data.profile)
						);
						this.$toast.show(res.data.message)
					}
					//放入用户的信息 图片 登录框禁止 提示
					this.currentUserInfo = res.data.profile;
					this.userImg = this.currentUserInfo.avatarUrl;
					this.dialogVisible = false;
					this.$toast.show(`欢迎你${this.currentUserInfo.nickname}`, 2000);
				}).catch(error=>{
					if(error.response) {
						console.log(error.response)
						this.$message.error(error.response.data.message)
					}
				})									
			},
			//退出登录网络请求
			getPhoneLoginOut() {
				getPhoneLoginOut().then(res=>{
					// console.log(res)
					this.currentUserInfo = null
					window.localStorage.setItem("currentUserInfo",null)
					this.userImg = require("../assets/logo.png")
				})
			},
			toResult() {
				if (this.inputValue == '') {
					this.$message({
						message: '你还未输入',
						type: 'warning'
					});
				}
				else{
					
					this.$router.push({
						path:'/result',
						query:{
							val:this.inputValue
						}
					})
				}
			},			
			handleCommand(command) {
				if(command === "a") {
					this.$router.push({
						path:'/Myinfo'
					})
				} else if (command==='b'){
					this.$router.push({
						path:'/UpdateInfo'
					})
				}
				else{
					this.$message('click on item ' + command);
				}
				
			}
		},
		created() {
			if (this.currentUserInfo) {
			  this.userImg = this.currentUserInfo.avatarUrl;			 
			}
		}
	}
</script>

<style scoped>
	 .el-dropdown-link {
	    cursor: pointer;
	    color: #409EFF;
	  }
</style>
