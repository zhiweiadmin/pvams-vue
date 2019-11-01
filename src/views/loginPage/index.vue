<template>
	<div class="login" :style="{height: `${height}px`}">
		<div class="form">
			<div class="title">
				<!-- <img src="../../assets/logo.png" alt=""> -->
				<h3>光电宝资产运营管理系统</h3>
			</div>
			<div class="input">
				<el-form :model="form" ref="form" label-width="0px">
					<el-form-item prop="username" :rules="[{required: true, message: '请输入用户名'}]">
						<el-input prefix-icon="el-icon-s-custom" :style="{width: '300px'}" placeholder="请输入用户名" v-model="form.username"></el-input>
					</el-form-item>
					<el-form-item prop="password" :rules="[{required: true, message: '请输入密码'}]">
						<el-input type="password" prefix-icon="el-icon-lock" :style="{width: '300px'}" placeholder="请输入密码" v-model="form.password"></el-input>
					</el-form-item>
					<el-form-item>
						<el-row class="submitbtn" style="cursor:pointer" @click="checkLogin('form')">
							<!-- <el-col :span="4"><span>123</span></el-col>
							<el-col :span="16">
								<el-button class="btn submitbtn" :style="{width: '100%'}" type="primary" @click="checkLogin('form')">登录</el-button>
							</el-col>
							<el-col :span="4"><span>123</span></el-col> -->
							<div @click="checkLogin('form')">
								<el-col :span="7">		
									<div style="text-align:right">
										<img src='../../assets/star.svg' style="width:16px;height:16px">
									</div>
								</el-col>
								<el-col :span="10">
									<div style= "width:100%;font-size:15px;font-weight:bold">登录</div>
								</el-col>
								<el-col :span="7">
									<div style="text-align:left">
										<img src='../../assets/star.svg' style="width:16px;height:16px">
									</div>
								</el-col>
							</div>
						</el-row>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import config from "../../config";
import jurisdiction from "@/mixin/jurisdictionMixin";

export default {
  mixins: [jurisdiction],
	data() {
		return {
			form: {
				username: "",
				password: "",
			},
			height: "",
		}
	},
	created() {
		this.height = window.innerHeight;
	},
	methods: {
		async checkLogin(formName) {
      this.$refs[formName].validate(async (valid, validObj) => {
				if (valid) {
					const { data } = await this.axios.post("/pvams/login", this.form);
					if (data.code === 200) {
						const { data: { Token = "", username = "", realname = "", userType = "", userId = "", permissions = [] } = {} } = data
						window.localStorage.removeItem("username");
						window.localStorage.removeItem("token");
						window.localStorage.removeItem("realname");
						window.localStorage.removeItem("userType");
						window.localStorage.removeItem("userId");
						window.localStorage.removeItem("permissions");

						window.localStorage.setItem("userId", userId);
						window.localStorage.setItem("username", username);
						window.localStorage.setItem("token", Token);
						window.localStorage.setItem("realname", realname);
						window.localStorage.setItem("userType", userType);
						window.localStorage.setItem("permissions", permissions);
						if (permissions) {
							window.JurisdictionArr = permissions;
						}
						// this.$message({type: 'success', message: '登录成功'});
						this.$router.push({name: "electricAdsn"});
						// const hostName = location.hostname === 'dev.cnsuning.com';
						// window.location.href = hostName ? '/' : `${config.HOST.pvamsDomain}/pvams`
					} else {
						this.$message({type: 'error', message: data.message});
					}
				} else {
					Object.keys(validObj).forEach((v, i) => {
						if (i === 0) {
							const megName = (validObj[v] && validObj[v][0]) || {};
							this.$message({ type: 'error', message: megName.message })
						}
					})
				}
			})
		}
	},
}
</script>


<style lang="less">
	.login {
		.input {
			padding-right: 50px;
			animation: rotatean 1s 1;
			-webkit-animation: rotatean 1s 1 ease-out;
			.el-form {
				padding: 70px;
				padding-top: 100px;
				min-height: 450px;
				background: url(../../assets/loginbg.svg) no-repeat center center;
				background-size: 100% 100%;
				.el-input {
					font-size: 16px;
				}
				.el-input__prefix {
					font-size: 16px;
					color: #000;
					.el-input__icon {
						font-size: 18px;
					}
				}
			}
		}
		@keyframes rotatean {
			// 0% {
			// 	transform: scale(0);
			// }
			// 80% {
			// 	transform: scale(1.1);
			// }
			// 100% {
			// 	transform: scale(1);
			// }
			from {
				// transform: rotateX(90deg);
				transform: translateX(400px);
			}
			to {
				transform: translateX(0px);
				// transform: rotateX(0)
			}
		}
	}
</style>
<style lang="less" scoped>
.login {
	width: 100%;
	height: 100%;
	background: url('../../assets/login_logo.png') no-repeat center center;
	background-size: 100% 100%;
	overflow: hidden;
	.form {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		// background-color: rgba(0, 0, 0, .2);
		.title {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			align-content: center;
			font-size: 45px;
			color: #014783;
			animation: titlestate 1s 1 ease-out;
			margin-top: 10%;
    		margin-left: 26%;
			// -webkit-animation: titlestate 1s 1;
			h3 {
				font-weight: 800;
				text-shadow: 5px -5px 2px #C3CAEE;
			}
			img {
				margin-top: 110px;
				display: block;
				width: 70px;
				height: 70px;
				margin-right: 20px;
			}
			h3 {
				margin-top: 90px;
			}
		}
		.input {
			margin-top: 110px;
		}
		.btn {
			width: 100%;
			height: 44px;
			background: #144987;
			box-shadow: 0px 10px 24px 1px rgba(4,31,71,0.54);
			border: 0;
			color: #fff;
			font-size: 16px;
			font-weight: bold;
			letter-spacing: 6px;
		}
		.submitbtn{
			background:url('../../assets/submitbg.svg')
		}
	}
}
@keyframes titlestate {
	from {
		transform: translateX(-400px)
	}
	to {
		transform: translateX(0px)
	}
}
</style>

