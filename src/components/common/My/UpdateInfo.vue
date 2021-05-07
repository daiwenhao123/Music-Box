<template>
	<div class="UpdateInfo">
		<div class="UpdateInfo-left">
			<div class="UpdateInfo-left-item">
				<span style="width: 35px;font-size: 15px;margin-right: 3px;">昵称</span>
				<el-input v-model="input" placeholder="请输入内容"  size="mini"></el-input>
			</div>
			<div class="UpdateInfo-left-item1">
				<span style="width: 35px; font-size: 15px;margin-right: 3px">介绍</span>
				<el-input type="textarea" placeholder="请输入内容" v-model="textarea" maxlength="30" :rows="5" show-word-limit></el-input>
			</div>
			<div class="UpdateInfo-left-item">
				<span style="width: 35px;font-size: 15px;margin-right: 3px">性别</span>
				<el-radio-group v-model="radio">
				    <el-radio :label="1">男</el-radio>
				    <el-radio :label="2">女</el-radio>
				    <el-radio :label="3">保密</el-radio>
				</el-radio-group>
			</div>
			<div class="UpdateInfo-left-item">
				<span style="width: 35px;font-size: 15px;margin-right: 3px;">生日</span> <el-date-picker v-model="date" type="date" placeholder="选择日期" size="mini"></el-date-picker>
			</div>
			<div class="UpdateInfo-left-item3">
				<el-button @click="update" size="mini" style="background-color: #3483cf;color: white;margin-left: 35px;" >保存</el-button>
			</div>
		</div>
		<div class="UpdateInfo-right">
			<img :src="currentUserInfo.avatarUrl" />
			<el-upload
			  class="upload-demo"
			  action="https://jsonplaceholder.typicode.com/posts/"
			  :on-preview="handlePreview"
			  :on-remove="handleRemove"
			  :before-remove="beforeRemove"
			  multiple
			  :limit="3"
			  :on-exceed="handleExceed"
			  :file-list="fileList" style="margin-left: 63px;margin-top: 15px;" id="update">
			  <el-button size="small" type="primary">点击上传</el-button>
			  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
			<!-- <input type="file" id="file"/>
			<img id="avatar" style="height: 200px; width: 200px; border-radius: 50%" /> -->
		</div>
		
	</div>
</template>

<script>
import {updateInfo} from '../../../network/updateInfo.js'
import {updateImg} from '../../../network/updateImg.js'
  export default {
    name:'UpdateInfo',
	data() {
		return{
			input:'',
			textarea:'',
			radio:'',
			date:'',
			province:'430000',
			city:'431200',
			currentUserInfo:
			window.localStorage.getItem("currentUserInfo")==="null"
			?null
			:JSON.parse(window.localStorage.getItem("currentUserInfo")),
		}	
	},
	methods:{
		updateInfo(gender,birthday,nickname,province,city,signature) {
			updateInfo(gender,birthday,nickname,province,city,signature).then(res=>{
				console.log(res)
				if(res.data.code==200) {
					this.$message.success('你的信息更改成功');
				}else {
					this.$message('发生未知错误');
				}
			}).catch( error => {
               console.log(error.response)
			   if(error.response.data.code!==200) {
				   console.log('昵称重复')
				   this.$message.error(error.response.data.message);
				   this.$toast.show(error.response.data.message,2000)
			   }
            })
		},
		update() {
			this.updateInfo(this.radio,this.date.getTime(),this.input,this.province,this.city,this.textarea)
		},
		uploadImg(file) {
			var formData = new FormData()
			formData.append('imgFile', file)
			axios({
			          method: 'post',
			          url: 'https://autumnfish.cn/avatar/upload',
			          headers: {
			            'Content-Type': 'multipart/form-data',
			          },
			          data: formData,
			        }).then(res=>{
						console.log(res)
					})
		}
	},
	created() {
		this.input = this.currentUserInfo.nickname
		this.textarea = this.currentUserInfo.signature
		this.radio = this.currentUserInfo.gender
		this.date = this.currentUserInfo.birthday
	},
	updated() {
		document.getElementById("file").addEventListener(
		  'click',
		  function (e) {
		    var file = this.files[0]
		    uploadImg(file)
		  }
		)
	}
  }
</script>

<style scoped>
	.UpdateInfo{
		display: flex;
	}
	.UpdateInfo-right{
		width: 30%;
		align-items: center;
	}
	.UpdateInfo-right img {
		margin-left: 20px;
		margin-top: 25px;
		width: 165px;
		height: 165px;
		border: 1px solid #ececec;
	}
	.UpdateInfo-left{
		width: 40%;
	}
	.UpdateInfo-left-item{
		height: 25px;
		display: flex;
		align-items: center;
		margin-top: 25px;
	}
	.UpdateInfo-left-item1{
		display: flex;
		margin-top: 25px;
	}
	.UpdateInfo-left-item3{
		display: flex;
		margin-top: 25px;
		align-items: center;
		justify-content: space-between;
	}
</style>

