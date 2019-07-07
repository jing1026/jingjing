<template>
	<section>
		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column prop="id" label="ID" width="60"></el-table-column>
			<el-table-column prop="content" label="内容" min-width="300"></el-table-column>
			<el-table-column prop="likeNum" label="点赞数"></el-table-column>
			<el-table-column prop="commentNum" label="评论数"></el-table-column>
			<el-table-column prop="viewNum" label="浏览数"></el-table-column>
			<el-table-column prop="nickname" label="回答者"></el-table-column>
			<el-table-column prop="createTime" label="回答时间" sortable min-width="100"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="comment(scope.$index, scope.row)">查看评论</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button size="small" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				total: 0,
				page: 1,
				pageSize: 10,
				sels: [],
				listLoading: false
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取数据列表
			getData:function (){
				
				this.listLoading = true;

				let para = {
                    circleId: this.$route.query.id,
					pageNum: this.page,
					pageSize: this.pageSize
				};
				
				this.$http.post('mcircle/comment/list', this.qs.stringify(para)).then(data => {
					
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
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除
			handleDel(id) {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mcircle/remove', this.qs.stringify({circleIds: id})).then(data => {
						
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
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.handleDel(ids);
			},
			//评论
			comment(index, row) {
				this.$router.push({
					path: '/comment',
					query: {
						id: row.id
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
	.cell img{
		max-width: 40% !important;
	}
	.el-row{
		margin-top: 10px;
	}
</style>