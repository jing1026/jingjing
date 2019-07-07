<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.content" placeholder="标签内容"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions0"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleCurrentChange(1)">查询</el-button>
				</el-form-item>
				<el-form-item class="fr">
					<el-button type="primary" plain @click="handleAdd()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" min-width="40"></el-table-column>
			<el-table-column prop="tag" label="标签"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable min-width="100"></el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleAdd(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="addFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="标签" prop="tag" :rules="[{ required: true, message: '请填写标签', trigger: 'blur' }]">
					<el-input v-model="addForm.tag" maxlength="6" placeholder="少于6字"></el-input>
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
				filters: {
					content: '',
					date: ''
				},
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() > Date.now() - 8.64e6;
					}
				},
				list: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				addFormVisible: false,
				addLoading: false,
				addForm: {
					id: 0,
					tag: ''
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取列表
			getData:function (){
				this.listLoading = true;
				let para = {
					pageNum: this.page,
					pageSize: this.pageSize,
					content: this.filters.content,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1]
				};
				
				this.$http.post('mtag/list', this.qs.stringify(para)).then(data => {
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
			//显示编辑界面
			handleAdd: function (row) {
				this.addFormVisible = true;
				if(row !== undefined){
					this.addForm = Object.assign({}, row);
				}else{
                    this.addForm ={
                        id: 0,
                        tag: ''
                    }
                }
			},
			//编辑
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let url = '';
							if(this.addForm.id !== 0){
								url = 'mtag/update'
							}else{
								url = 'mtag/add'
							}

							this.$http.post(url, this.qs.stringify(this.addForm)).then(data => {
								let  res = data.data;
								if (res.status !== 0) {
									this.$message({
										message: res.msg,
										type: 'error'
									});
								} else {
									this.addLoading = false;
									this.$message({
										message: '成功',
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
			//删除
			handleDel(id) {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mtag/delete', this.qs.stringify({id: id})).then(data => {
						
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
			}
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>

</style>
