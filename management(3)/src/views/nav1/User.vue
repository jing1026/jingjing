<template>
	<section v-loading="listLoading">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.nickname" placeholder="昵称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions0"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleCurrentChange(1)">查询</el-button>
				</el-form-item>
				<el-form-item class="fr">
					<el-button type="primary" plain @click="handleAdd">新增用户</el-button>
					<el-button @click="pushAdd">推送</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" stripe highlight-current-row style="width: 100%;">
			<el-table-column prop="id" label="ID" width="60"></el-table-column>
			<el-table-column prop="nickname" label="昵称"></el-table-column>
			<el-table-column prop="phone" label="手机号"></el-table-column>
			<el-table-column prop="birthday" label="出生日期"></el-table-column>
			<el-table-column prop="sex" label="性别" min-width="40"></el-table-column>
			<el-table-column prop="hometown" label="家乡"></el-table-column>
			<!-- <el-table-column prop="tag" label="标签"></el-table-column>
			<el-table-column prop="emotion" label="感情状况"></el-table-column>
			<el-table-column prop="sign" label="签名"></el-table-column> -->
			<el-table-column prop="createTime" label="注册时间" sortable min-width="110"></el-table-column>
			<el-table-column label="操作" width="290">
				<template scope="scope">
					<el-button type="primary" size="small" @click="details(scope.$index, scope.row, 'userD')">详情</el-button>
					<el-button size="small" @click="details(scope.$index, scope.row, 'content')">圈子</el-button>
					<el-button type="primary" plain size="small" @click="details(scope.$index, scope.row, 'shop')">店铺</el-button>
					<el-button v-if="!scope.row.silent&&!scope.row.ban" type="warning" plain size="small" @click="handleEdit(scope.$index, scope.row)">操作</el-button>
					<el-button v-else-if="scope.row.silent" type="danger" plain size="small" @click="relieve(scope.row.id, 1)">解禁</el-button>
					<el-button v-else type="danger" plain size="small" @click="relieve(scope.row.id, 0)">解封</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		<el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
    		</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="类型">
					<el-radio-group v-model="editForm.type">
						<el-radio :label="1">禁言</el-radio>
						<el-radio :label="0">封号</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="截止时间" prop="endTime" :rules="[{ required: true, message: '请选择时间', trigger: 'blur' }]">
					<el-date-picker type="datetime" placeholder="选择日期时间" v-model="editForm.endTime" :picker-options="pickerOptions1" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"></el-date-picker>
				</el-form-item>
				<el-form-item label="原因" prop="reason" :rules="[{ required: true, message: '请填写原因', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.reason" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="昵称" prop="nickname" :rules="[{ required: true, message: '请填写昵称', trigger: 'blur' }]">
					<el-input v-model="addForm.nickname" auto-complete="off"></el-input>
				</el-form-item>
                <!-- <el-form-item label="性别" prop="hometown" :rules="[{ required: true, message: '请选择性别', trigger: 'blur' }]">
					<el-select v-model="addForm.sex" placeholder="请选择">
						<el-option v-for="item in optionsSex" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>	 -->

				<!-- <template class="templateenter">
					    <span class="Usersex">性别</span>
						<el-select v-model="sex"  placeholder="请选择性别">
							<el-option
							v-for="item in optionsSex"
							:key="item.sex"
							:label="item.label"
							:value="item.sex">
							</el-option>
						</el-select>
                 </template> -->

                <el-form-item label="性别" prop="sex" :rules="[{ required: true, message: '请选择性别', trigger: 'blur' }]">
					<el-select v-model="addForm.sex" placeholder="请选择">
						<el-option v-for="item in optionsSex"  :label="item.label" :value="item.sex"></el-option>
					</el-select>
				
				</el-form-item>

				<el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请填写密码', trigger: 'blur' }]">
					<el-input v-model="addForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="phone" :rules="[{ required: true, message: '请填写手机号', trigger: 'blur' }]">
					<el-input v-model="addForm.phone" type="number" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="用户头像" prop="headIcon" :rules="[{ required: true, message: '请选择用户头像', trigger: 'blur' }]">
					<el-upload class="avatar-uploader head-icon" :http-request="Upload" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png">
						<img v-if="addForm.headIcon" :src="addForm.headIcon" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<el-form-item label="背景图" prop="photo" :rules="[{ required: true, message: '请选择背景图', trigger: 'blur' }]">
					<el-upload class="avatar-uploader head-icon" :http-request="UploadOne" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png">
						<img v-if="addForm.photo" :src="addForm.photo" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
                
				  
				<el-form-item label="家乡" prop="hometown" :rules="[{ required: true, message: '请选择家乡', trigger: 'blur' }]">
					<el-select v-model="addForm.hometown" placeholder="请选择">
						<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>

		<!--推送界面-->
		<el-dialog title="向所有用户推送" :visible.sync="pushFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="pushForm" label-width="80px" ref="pushForm">
				<el-form-item label="推送内容" prop="content" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="pushForm.content"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="pushFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="pushSubmit" :loading="pushLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { client } from '../../common/js/alioss'
	import util from '../../common/js/util'

	export default {
		data() {
			return {
				options: [],
				props: {
					value: 'id',
					children: 'areaList',
					label: 'name'
				},
				filters: {
					nickname: '',
					phone: '',
					date: ''
				},
				optionsSex: [{
					sex: '男',
					label: '男'
					}, {
					sex: '女',
					label: '女'
					}],
				   sex: "",
				valueSex: '',
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() > Date.now() - 8.64e6;
					}
				},
				pickerOptions1: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e6;
					}
				},
				users: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				editFormVisible: false,
				editLoading: false,
				editForm: {
					adminId: 0,
					userIds: 0,
					type: 1,
					endTime: '',
					status: 1,
					reason: ''
				},
				addFormVisible: false,
				addLoading: false,
				addForm: {
					nickname: '',
					phone: '',
					headIcon: '',
					photo:'',
					password: '',
					hometown: '',
					sex:'',

				},
				pushFormVisible: false,
				pushLoading: false,
				pushForm: {
					content: ''
				}
			}
		},
		created(){
			this.$http.post('http://www.jiaxiangapp.com/jx/user/area/get').then(data => {
				this.options = data.data.data;
			})
		},
		methods: {
			handleChange(value) {
				if(value.length>0){
					this.addForm.hometown = value.pop();
				}
			},
			beforeAvatarUpload(file) {
				const isPNG = file.type === 'image/png'||file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isPNG) {
				this.$message.error('上传图片只能是 PNG/JPG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isPNG && isLt2M;
			},
			Upload(file) {
				var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
				client().put(fileName, file.file).then(result => {
					this.addForm.headIcon = result.url;
				}).catch(function (err) {
                    console.log(err);
	 			});
			},
			UploadOne(file){
				 	var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
				client().put(fileName, file.file).then(result => {
					this.addForm.photo = result.url;
				}).catch(function (err) {
                    console.log(err);
	 			});
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers:function (){
				this.listLoading = true;
				let para = {
					pageNum: this.page,
					pageSize: this.pageSize,
					nickname: this.filters.nickname,
					phone: this.filters.phone,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1]
				};				
				this.$http.post('muser/list', this.qs.stringify(para)).then(data => {
					let  res = data.data;
					console.log(data);
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
						this.total = res.data.total;
						this.users = res.data.list;
						this.listLoading = false;
					}
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					nickname: '',
					phone: '',
					headIcon: '',
					password: '',
					hometown: '',
					photo:'',
					sex:'',//自己加的
				};
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					//alert(this.sex);
					console.log("111111111111111111");
					console.log(this.addForm.hometown);
				    console.log(typeof this.addForm.hometown);
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
						    
							console.log(this.addForm);
							this.$http.post('muser/create', this.qs.stringify(this.addForm)).then(data => {
								let  res = data.data;
								if (res.status !== 0) {
									this.$message({
										message: res.msg,
										type: 'error'
									});
								} else {
									this.addLoading = false;
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getData();
								}
							});
						});
					}
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm.userIds = row.id;
				this.editForm.adminId = sessionStorage.getItem('id');
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							this.$http.post('muser/deal', this.qs.stringify(this.editForm)).then(data => {
								console.log(data.data);
								let  res = data.data;
								if (res.status !== 0) {
									this.$message({
										message: res.msg,
										type: 'error'
									});
								} else {
									this.editLoading = false;
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getUsers();
								}
							});
						});
					}
				});
			},
			//显示推送界面
			pushAdd: function () {
				this.pushFormVisible = true;
				this.pushForm = {
					content: ''
				};
			},
			//推送
			pushSubmit: function () {
				this.$refs.pushForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认推送该内容吗？', '提示', {}).then(() => {
							this.pushLoading = true;
							this.$http.post('mpush/add', this.qs.stringify(this.pushForm)).then(data => {
								let  res = data.data;
								if (res.status !== 0) {
									this.$message({
										message: res.msg,
										type: 'error'
									});
								} else {
									this.pushLoading = false;
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['pushForm'].resetFields();
									this.pushFormVisible = false;
								}
							});
						});
					}
				});
			},
			//解封
			relieve(id, type){
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.listLoading = true;
					let para = {userIds: id, type: type ,status: 0, adminId: sessionStorage.getItem('id')};
					this.$http.post('muser/deal', this.qs.stringify(para)).then(data => {
						console.log(data.data);
						let  res = data.data;
						if (res.status !== 0) {
							this.$message({
								message: res.msg,
								type: 'error'
							});
						} else {
							this.editLoading = false;
							this.$message({
								message: '成功',
								type: 'success'
							});
							this.getUsers();
						}
					});
				});
			},
			details(index, row, href) {
				this.$router.push({
					path: '/' + href,
					query: {
						id: row.id
					}
				})
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>
      .Usersex{
		   margin-right: 30px;
		   margin-left: 20px;
	  }
</style>
