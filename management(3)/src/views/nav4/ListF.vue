<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增分类</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" width="60"></el-table-column>
			<el-table-column prop="description" label="分类描述">
				<template scope="scope">
					<div class="maxH" v-html="scope.row.description"></div>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="分类名称"></el-table-column>
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button size="small" type="danger" @click="handleDel(scope.row.id)">删除</el-button>
					
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button size="small" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<!-- <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog> -->

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="dialogClose" width="620px">
            <el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="分类名称" prop="name" :rules="[{ required: true, message: '请填写分类名称', trigger: 'blur' }]">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
				<el-form-item label="分类描述" prop="description" :rules="[{ required: true, message: '请填写分类描述', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.description" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

        <!-- <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->
	</section>
</template>

<script>
	import { client } from '../../common/js/alioss'
	import util from '../../common/js/util'
	
	export default {
		data() {
			return {
				list: [],
				total: 0,
				page: 1,
				pageSize: 100,
				listLoading: false,
                editFormVisible: false,
				editLoading: false,
				
				editForm: {
					adminId: 0,
					ids: 0,
					status: 1,
					reason: ''
				},
				addFormVisible: false,
				addLoading: false,
				
				addForm: {
                    name: '',
					description: '',
					type: 1,
					level: 1,
					parentId: this.$route.query.id,
					
                },
				dialogVisible: false,
				type: 0,
				sels: []
			}
		},
		methods: {
			
           dialogClose(){

		   },
		
          
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取数据列表
			getData:function (){
				this.listLoading = true;
				let para = {
					parentId: this.$route.query.id,
					type: 1,
					pageNum: this.page,
					pageSize: this.pageSize
				};

				this.$http.post('http://www.jiaxiangapp.com/jx/user/category/list', this.qs.stringify(para)).then(data => {
					
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
						this.total = res.data.length;
						this.list = res.data;
						this.listLoading = false;
					}
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					description: '',
					type: 1,
					level: 1,
					parentId: this.$route.query.id,
				};
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.$http.post('http://www.jiaxiangapp.com/jx/user/category/add', this.qs.stringify(this.addForm)).then(data => {
								
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
                                    this.fileList = [];
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
			// handleEdit: function (index, row) {
			// 	this.editFormVisible = true;
			// 	this.editForm.ids = row.id;
			// 	this.editForm.adminId = sessionStorage.getItem('id');
			// },
			// editSubmit: function () {
			// 	this.$refs.editForm.validate((valid) => {
			// 		if (valid) {
			// 			this.$confirm('确认提交吗？', '提示', {}).then(() => {
            //                 this.listLoading = true;
			// 				this.$http.post('mstore/goods/update', this.qs.stringify(this.editForm)).then(data => {
								
			// 					let  res = data.data;
			// 					if (res.status !== 0) {
			// 						this.$message({
			// 							message: res.msg,
			// 							type: 'error'
			// 						});
			// 					} else {
			// 						this.$message({
			// 							message: '成功',
			// 							type: 'success'
			// 						});
			// 						this.getData();
			// 						this.$refs['editForm'].resetFields();
			// 						this.editFormVisible = false;
			// 					}
			// 				})
			// 			});
			// 		}
			// 	});
			// },
			//详情
			// details: function (index, row, m) {
			// 	this.$router.push({
			// 		path: '/info',
			// 		query: {
			// 			id: row.id
			// 		}
			// 	})
			// },
			// selsChange: function (sels) {
			// 	this.sels = sels;
			// },
			//删除
			handleDel(id) {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('http://www.jiaxiangapp.com/jx/user/category/del', this.qs.stringify({categoryId: id})).then(data => {
						
						let  res = data.data;
						if (res.status !== 0) {
							this.$message({
								message: res.msg,
								type: 'error'
							});
						} else {
							this.$message({
								message: '成功',
								type: 'success'
							});
							this.getData();
						}
					})
				}).catch(() => {

				});
			},
			//批量删除
			// batchRemove: function () {
			// 	var ids = this.sels.map(item => item.id).toString();
			// 	this.handleDel(ids);
			// }
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>
	.el-row video{
		width: 60%;
	}
	#myVideo{
		width: 100%;
		height: 100%;
	}
</style>