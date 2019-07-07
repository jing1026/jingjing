<template>
	<section>
		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column prop="id" label="ID" width="60"></el-table-column>
			<el-table-column prop="content.content" label="内容" min-width="300">
				<template scope="scope">
					<div v-html="scope.row.content.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></div>
				</template>
			</el-table-column>
			<el-table-column prop="nickname" label="评论者"></el-table-column>
			<el-table-column prop="headIcon" label="头像">
				<template scope="scope">
					<img class="head-icon" :src="scope.row.headIcon" />
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="评论时间" sortable min-width="110"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.row.id)">删除</el-button>
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
	import util from '../../common/js/util'
	
	export default {
		data() {
			return {
				list: [],
				total: 0,
				page: 1,//默认的第一页
				pageSize: 10,//默认的每一页显示多少数据
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
					pageNum: this.page,
					pageSize: this.pageSize
				};
				
				let url = '';

				if(this.$route.query.subject == 1){
					para.subjectId = this.$route.query.id;
					url = 'msubject/comment/list'
				}else{
					para.circleId = this.$route.query.id;
					url = 'mcircle/comment/list'
				}

				this.$http.post(url, this.qs.stringify(para)).then(data => {
					
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
					this.$http.post('mcircle/comment/delete', this.qs.stringify({commentIds: id})).then(data => {
						
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
			}
		},
		mounted() {
			this.getData();
		},
		watch: {
			"$route": "getData"
		}
	}

</script>

<style scoped>
	.head-icon{
		width: 45px;
		height: 45px;
		border-radius: 50%;
	}
</style>