<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.content" placeholder="内容"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions0"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleCurrentChange(1)">查询</el-button>
				</el-form-item>
				<el-form-item class="fr">
					<el-button type="primary" plain @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" min-width="30"></el-table-column>
			<el-table-column prop="content" label="内容" min-width="300">
				<template scope="scope">
					<div class="maxH">{{scope.row.content}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="时间" sortable></el-table-column>
			<el-table-column label="操作" min-width="304" align="center">
				<template scope="scope">
					<el-row class="line">
						<el-row v-else>
							<el-button type="danger" size="small" @click="handleDel(scope.row.id)">删除</el-button>
						</el-row>
					</el-row>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->

		<el-col :span="24" class="toolbar">
			<el-button size="small" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="通知内容" prop="content" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请填写内容" v-model="addForm.content" auto-complete="off"></el-input>
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
					content: ''
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
				
				this.$http.post('mplatform/list', this.qs.stringify(para)).then(data => {
					
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
			//删除
			handleDel(id) {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mcircle/remove', this.qs.stringify({circleIds: id, adminId: sessionStorage.getItem('id')})).then(data => {
						
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
			batchRemove() {
				var ids = this.sels.map(item => item.id).toString();
				this.handleDel(ids);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					content: ''
				};
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							this.$http.post('mplatform/add', this.qs.stringify(para)).then(data => {
								
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
			}
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>

</style>