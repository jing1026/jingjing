<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID"></el-table-column>
			<el-table-column prop="account" label="账号"></el-table-column>
			<el-table-column prop="type" label="账号类型" :formatter="type"></el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请填写密码', trigger: 'blur' }]">
					<el-input v-model="editForm.password" auto-complete="off"></el-input>
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
				<el-form-item label="账号" prop="account" :rules="[{ required: true, message: '请填写账号', trigger: 'blur' }]">
					<el-input v-model="addForm.account" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请填写密码', trigger: 'blur' }]">
					<el-input v-model="addForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账号类型">
					<el-radio-group v-model="addForm.type">
						<el-radio :label="1">商街管理员</el-radio>
						<el-radio :label="2">圈子管理员</el-radio>
						<el-radio :label="0">超级管理员</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	
	export default {
		data() {
			return {
				list: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,//加载条是否显示
				editFormVisible: false,//编辑的弹框是否显示
				editLoading: false,
				editForm: {
					adminId: 0,
					password: ''
				},
				addFormVisible: false,//新增的弹框是否显示
				addLoading: false,//提交的loading
				addForm: {
					account: '',
					password: '',
					type: 1
				}
			}
		},
		methods: {
			type(row, column){
				return row.type === 0 ? '超级管理员' : row.type === 1? '商街管理员':'圈子管理员';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取列表
			getData:function (){
				
				this.listLoading = true;

				let para = {
					pageNum: this.page,
					pageSize: this.pageSize
				};
				
				this.$http.post('madmin/list', this.qs.stringify(para)).then(data => {
					
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
						this.total = res.data.total;
						this.list = res.data.list;
						this.listLoading = false;
					}
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					account: '',
					password: '',
					type: 1
				};
			},
			//新增
			addSubmit: function () {
				//addForm 弹框的名字 去掉this.$refs.addForm.validate((valid))这个语句也行
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							para.adminId = sessionStorage.getItem('id');
							this.$http.post('madmin/add', this.qs.stringify(para)).then(data => {
								
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
				row.password = '';
				this.editForm.adminId = row.id;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							this.$http.post('madmin/update', this.qs.stringify(this.editForm)).then(data => {
								
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
									this.getData();
								}
							});
						});
					}
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { adminId: row.id };
					this.$http.post('madmin/delete', this.qs.stringify(para)).then(data => {
						
						let  res = data.data;
						if (res.status !== 0) {
							this.$message({
								message: res.msg,
								type: 'error'
							});
						} else {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getData();
						}
					})
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>

</style>