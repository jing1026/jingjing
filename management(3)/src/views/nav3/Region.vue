<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleEdit(0,0)">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" min-width="60"></el-table-column>
			<el-table-column prop="name" label="区域"></el-table-column>
			<el-table-column prop="title" label="标题"></el-table-column>
			<el-table-column prop="content" label="区域介绍" min-width="150">
				<template scope="scope">
					<div class="maxH">{{scope.row.content}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="区域名称" prop="name" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请填写标题', trigger: 'blur' }]">
					<el-input v-model="editForm.title"></el-input>
				</el-form-item>
				<el-form-item label="区域介绍" prop="content" :rules="[{ required: true, message: '请填写区域介绍', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="editForm.content"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
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
				listLoading: false,
				editFormVisible: false,
				editLoading: false,
				editForm: {
					id: 0,
					name: '',
					title: '',
					content: ''
				}
			}
		},
		methods: {
			//获取列表
			getData:function (){
				this.listLoading = true;
				this.$http.post('marea/list', this.qs.stringify({parentId: 0})).then(data => {
					
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
						this.list = res.data;
						this.listLoading = false;
					}
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				if(row !== 0){
					this.editForm = Object.assign({}, row);
				}else{
					this.editForm = {
						id: 0,
						name: '',
						title: '',
						content: ''
					}
				}
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let url = '';
							if(this.editForm.id !== 0){
								url = 'marea/update'
							}else{
								url = 'marea/add'
							}

							this.$http.post(url, this.qs.stringify(this.editForm)).then(data => {
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
					let para = { id: row.id };
					this.$http.post('marea/delete', this.qs.stringify(para)).then(data => {
						
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