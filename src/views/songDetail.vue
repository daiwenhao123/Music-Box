<template>
	<div class="singel">
		<div class="singer-main">
			<div class="singer-top">
				<div class="bck-img">
					<img :src="songSrc" style="width: 100%;filter: blur(80px);max-height: 400px;border-radius: 50%;"/>
				</div>
				<div class="singel-play-img">
				  <div class="play-bar" ref="playBar">
				    <img src="../assets/playmusic/player_bar.png" alt="404" />
				  </div>
				  <div class="play-disc" ref="playDisc">
				    <img src="../assets/playmusic/disc.png" alt="404" />
				    <div class="disc-img">
				      <img :src="songSrc" alt />
				    </div>
				  </div>
				  <div class="btn">
				    <el-button size="mini" icon="el-icon-circle-plus-outline">喜欢</el-button>
				    <el-button size="mini" icon="el-icon-star-off">收藏</el-button>
				    <el-button size="mini" icon="el-icon-thumb">分享</el-button>
				    <el-button size="mini" icon="el-icon-download">vip下载</el-button>
				  </div>
				</div>
				<div class="Music-detail">
					<div class="Music-detail-top">
						<span class="Music-name">{{songName}}</span>
						<span style="width: 25px;height: 20px;border: 1px solid rgb(234, 19, 0);color: rgb(234, 19, 0);font-size: 15px;margin-left: 15px;">标准音质</span>
					</div>
					<div class="Music-detail-middle">
						专辑:<span style="color: rgb(48, 36, 180);">{{Album}}</span>
						歌手:<span style="color: rgb(55, 41, 203);">{{songAuthor}}</span>
					</div>
					<div class="Music-detail-bottom">
						<div style="overflow-y: auto">
						    <ul ref="lyric">
						        <li v-for="(item, i) in lrcObject"
						            :style="{color: lyricIndex === i ? 'red' : 'black'}">
						            {{item.c}}
						        </li>
						    </ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
  import {getSongDetail} from '../network/getSongDetail.js'
  import {getlyric} from '../network/getlyric.js'
  export default {
    name:'songDetail',
	data() {
		return {
			//解析歌词为对象
			lrcObject: [],
			//角度
			routeNum:0,
			//旋转的载体
			timerId: 0,
			//作者
			songAuthor:'',
			//歌曲名称
			songName:'',
			//专辑
			Album:'',
			//歌曲封面
			songSrc:'',
			//歌词
			lrc:'',
			//当前歌词的所位于歌词对象中的索引值(用于帮助高亮)
			lyricIndex: 0,
			curId:this.$route.query.id
		}
	},
	props: {
		isPlay:{
			type:Boolean,
			default() {
				return false
			}
		},
		musicDuration:{
			type:Number,
			
		},
		musicId:{
			type:Number,
		}
	},
	created() {
		this.getSongDetail(this.curId)
		this.getlyric(this.curId)
	},
	mounted() {
		if(this.isPlay){
			this.timerId = setInterval(this.routeDeg, 100);
		}
	},
	// beforeRouteLeave(to, form, next) {
	//     window.clearInterval(this.timerId)
	//     this.timerId = null
	//     next()
	// },
	methods:{
		//唱片旋转
		routeDeg() {
		  let playDisc = this.$refs.playDisc;
		  playDisc.style.transform = "rotateZ(" + this.routeNum + "deg)";
		  this.routeNum += 4;
		},
		getSongDetail(ids) {
			getSongDetail(ids).then(res=>{
				console.log(res)
				this.Album = res.data.songs[0].al.name
				this.songAuthor = res.data.songs[0].ar[0].name
				this.songName = res.data.songs[0].name
				this.songSrc = res.data.songs[0].al.picUrl
			})
		},
		getlyric(id) {
			getlyric(id).then(res=>{
				console.log(res)
				this.lrc = res.data.lrc.lyric
				console.log(this.lrc)
				this.createLrcObj(this.lrc);
			})
		},
		createLrcObj(lrc) {
			var oLRC = {
			    ms: [] //歌词数组{t:时间,c:歌词}
			};
			if (lrc.length == 0) return;
			var lrcs = lrc.split('\n');//用回车拆分成数组
			for (var i in lrcs) {//遍历歌词数组
			    lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
			    var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
			    var s = t.split(":");//分离:前后文字
			    if (isNaN(parseInt(s[0]))) { //不是数值
			        for (var i in oLRC) {
			            if (i != "ms" && i == s[0].toLowerCase()) {
			                oLRC[i] = s[1];
			            }
			        }
			    } else { //是数值
			        var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
			        var start = 0;
			        for (var k in arr) {
			            start += arr[k].length; //计算歌词位置
			        }
			        var content = lrcs[i].substring(start);//获取歌词内容
			        for (var k in arr) {
			            var t = arr[k].substring(1, arr[k].length - 1);//取[]间的内容
			            // var t = arr[k]
			            var s = t.split(":");//分离:前后文字
			            oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
			                // t: t,
			                t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
			                c: content === '' ? '..............' : content
			            });
			        }
			    }
			}
			oLRC.ms.sort(function (a, b) {//按时间顺序排序
			    return a.t - b.t;
			});
			// for(var i in oLRC){ //查看解析结果
			//     console.log(i,":",oLRC[i]);
			// }
			this.lrcObject = oLRC.ms
		}
	},
	watch:{
		musicId (newVal) {
			this.curId = newVal
			this.getSongDetail(this.curId)
			this.getlyric(this.curId)
		},
		isPlay(newVal) {
		    if (!newVal) {//如果当前是在暂停状态
		        window.clearInterval(this.timerId)
		    } else {
		       this.timerId = setInterval(this.routeDeg, 100)
		    }
		},
		//父组件通过 router-view 的@musicDuration传递过来值(进行歌曲滚动操作)
		musicDuration(newVal) {
		    this.duration = newVal
		    //对每次进来的进度条进行判断
		    // 跟下一句台词时长是否匹配,如果匹配则当前高亮的索引值+1
		    //使用循环帮助****回退  快进****的判断
		    for (let i = 0; i < this.lrcObject.length; i++) {
		        //这里使用小于符号判断是为了 保证回退音乐进度事件的效果实现性
		        if (newVal <= parseFloat(this.lrcObject[i].t)) {
		            if (this.lyricIndex === i - 1) {
		                break
		            }
		            //找到比当前时间点 大一点的后一位的歌词的索引值
		            this.lyricIndex = i - 1;
		            //当前距离上方的距离  控制歌词上下滚动
		            var currentTemp = this.$refs.lyric.style.marginTop
		            currentTemp = currentTemp.substr(0, currentTemp.length - 2)
		            //滚动距离
		            currentTemp = parseInt(currentTemp)
		            if (i > 5) {//第五句歌词之后 开始使用定位
		                /**
		                 * 例子
		                 * 第一句 margin-top 25px
		                 * 第二句 margin-top 50px
		                 * 第三句 margin-top 75px;
		                 * 以此类推
		                 *  ***计算出给一句歌词一个距离顶部的一个距离
		                 *  (每次只需要切换到当前距离顶部的位置 实现歌词滚动)
		                 *  顶部的位置 = 当前高亮歌词索引 * 25 +'px'   ***
		                 * @type {number}
		                 */
		                currentTemp = (i - 5) * -35
		                //设置样式
		                this.$refs.lyric.style.marginTop = currentTemp + 'px'
		            }
		            //如果当前是最后一句歌词 代表歌曲要放送结束了 将我们的lyricIndex(当前歌词索引值还原成0便于下一曲使用)
		            if (this.lyricIndex === this.lrcObject.length - 1) {
		                this.lyricIndex = 0;
		            }
		            break;
		        }
		    }
		},
	}
  }
</script>

<style scoped>
	/* .singel-back {
	  position: absolute;
	  top: 0;
	  right: -100px;
	}
	.bck-img {
	  position: absolute;
	  top: 0;
	  left: 0;
	  z-index: 0;
	}
	.singel {
	  width: 100%;
	  height: 630px;
	  padding-top: 20px;
	  overflow: auto;
	}
	.singel-main {
	  width: 70%;
	  margin: 0 auto;
	}
	.singel-top {
	  display: flex;
	  position: relative;
	}
	.singel-play-img {
	  margin-left: 35px;
	  position: relative;
	} */
	/* 开关 */
	/* .play-bar {
	  position: absolute;
	  top: -30px;
	  left: 120px;
	  z-index: 10;
	  transform: rotate(0deg);
	  transform-origin: left top;
	  transition: transform 0.5s;
	} */
	/* 黑圈和图片父级div*/
	/* .play-disc {
	  position: relative;
	  margin-top: 30px;
	  width: 254px;
	  height: 255px;
	} */
	/* 歌曲图片父级div */
	/* .disc-img {
	  position: absolute;
	  top: 57px;
	  left: 58px;
	  width: 140px;
	  height: 140px;
	} */
	/*歌曲图片 */
	/* .disc-img img {
	  width: 140px;
	  height: 140px;
	  border-radius: 50%;
	} */
	.singer{
		width: 100%;
		height: 600px;
	}
	.singer-main{
		width: 70%;
		margin: 0 auto;
	}
	.singer-top{
		display: flex;
	}
	
	.bck-img{
		width: 50%;
		position: absolute;
		z-index: 0;
		top: 10%;
		left: 30%;
		
	}
	.play-bar img{
		position: relative;		
		left: 110px;
		z-index: 10;
		transform: rotate(0deg);
		transform-origin: left top;
		transition: transform 0.5s;
	}
	.singel-play-img {
	  margin-left: 75px;
	  position: relative;
	} 
	.play-disc{
		position: relative;
		width: 250px;
		height: 250px;
		bottom: 60px;
		
	}
	.disc-img{
		position: absolute;
		top: 57px;
		left: 58px;
		
	}
	.disc-img img{
		width: 140px;
		height: 140px;
		border-radius: 50%;
	}
	.Music-detail{
		position: relative;
		left: 100px;
		width: 40%;
	}
	.Music-name{
		font-size: 20px;
		font-weight:bold;
	}
	.Music-detail-middle{
		font-size: 15px;
		padding-top: 10px;
	}
	.Music-detail-bottom{
		width: 350px;
		height: 350px;
		overflow: hidden;
		margin-top: 25px;
	}
	.Music-detail-bottom li {
		  list-style: none;
		  margin-top: 15px;
	}
</style>

