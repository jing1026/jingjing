<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.content" placeholder="举报内容"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态">
						<el-option v-for="item in filters.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions0"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleCurrentChange(1)">查询</el-button>
				</el-form-item>
				<el-form-item class="fr">
					<el-button type="primary" plain @click="option">选项管理</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" min-width="30"></el-table-column>
			<el-table-column prop="content" label="举报内容"></el-table-column>
			<el-table-column prop="nickname" label="举报者"></el-table-column>
			<el-table-column prop="type" label="类型" :formatter="type"></el-table-column>
			<el-table-column prop="status" label="状态" :formatter="status"></el-table-column>
			<el-table-column prop="result" label="处理结果">
				<template scope="scope">
					<div class="maxH">{{scope.row.result}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="举报时间" sortable min-width="105"></el-table-column>
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button size="small" @click="details(scope.row.id)">详情</el-button>
					<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">回复</el-button>
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
				<el-form-item label="内容" prop="result" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.result" auto-complete="off"></el-input>
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
				filters: {
					content: '',
					options: [{
						value: '0',
						label: '未处理'
						}, {
						value: '1',
						label: '已处理'
					}],
        			status: '',
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
				editFormVisible: false,
				editLoading: false,
				
				editForm: {
					id: 0,
					result: ''
				}
			}
		},
		methods: {
			//类型
			type: function (row, column) {
				switch (row.type){
					case 0:
						return "动态";
						break;
					case 1:
						return "文章";
						break;
					case 2:
						return "求助";
						break;
					case 3:
						return "讨论";
						break;
					case 4:
						return "问答";
						break;
					case 5:
						return "视频";
						break;
					case 6:
						return "回答";
						break;
					case 7:
						return "用户";
						break;
					case 8:
						return "评论";
						break;
					case 14:
						return "店铺动态";
						break;
				}
			},
			//状态
			status: function (row, column) {
				return row.status === 0 ? '未处理' : '已处理';
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
					pageSize: this.pageSize,
					content: this.filters.content,
					status: this.filters.status,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1]
				};
				
				this.$http.post('mreport/list', this.qs.stringify(para)).then(data => {
					
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
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm.id = row.id;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							this.$http.post('mreport/deal', this.qs.stringify(this.editForm)).then(data => {
								
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
			option:function(){
				this.$router.push({ path: '/option' });
			},
			//详情
			details(id) {
				this.$router.push({
					path: '/reportD',
					query: {
						id: id
					}
				})
			}
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>

</style>