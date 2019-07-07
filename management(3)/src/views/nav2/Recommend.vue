<template>
	<section>
		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" min-width="60"></el-table-column>
			<el-table-column label="视频/图片" prop="url" width="120">
				<template scope="scope">
					<el-row v-if="scope.row.type===5">
						<video :src="scope.row.url" :poster="scope.row.photo" controls></video>
					</el-row>
					<el-row v-else>
						<el-row class="maxH" v-if="scope.row.photo">
							<el-row v-for="item in scope.row.photo.split(',')" :key="item.index">
								<img :src="item" />
							</el-row>
						</el-row>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column prop="content" label="内容" min-width="180">
				<template scope="scope">
					<div class="maxH" v-if="scope.row.content" v-html="scope.row.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></div>
				</template>
			</el-table-column>
			<el-table-column prop="nickname" label="发布者" min-width="110" align="center"></el-table-column>
			<el-table-column prop="createTime" label="发布时间" sortable min-width="150" align="center"></el-table-column>
			<el-table-column label="操作" min-width="305" align="center">
				<template scope="scope">
					<el-row class="line">
						<el-row>
							<el-button type="primary" size="small" @click="details(scope.row.id,'details')">详情</el-button>
						</el-row>
						<el-row>
							<el-button size="small" @click="details(scope.row.id ,'comment')">评论</el-button>
						</el-row>
						<el-row>
							<el-button v-if="scope.row.recommend === 1" type="success" plain size="small" @click="wonderful(scope.row.id, 0, 0)">取消推荐</el-button>
						</el-row>
						<el-row>
							<el-button v-if="scope.row.wonderful === 1" type="warning" plain size="small" @click="wonderful(scope.row.id, 1, 0)">取消精彩</el-button>
						</el-row>
					</el-row>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
    //getLastUrl 通过 0和1来显示不同的路由
	var getLastUrl=(str,yourStr)=>str.slice(str.lastIndexOf(yourStr)+1);
	import util from '../../common/js/util'
	
	export default {
		data() {
			return {
				list: [],
				total: 0,
				page: 1,
				pageSize: 10,
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
					type: getLastUrl(window.location.href,'/'),
					pageNum: this.page,
					pageSize: this.pageSize
				};
				
				this.$http.post('mwonderful/list', this.qs.stringify(para)).then(data => {
					
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
			//设为精彩
			wonderful(id, type, statu) {
				this.$confirm('确认执行吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mcircle/wonderful', this.qs.stringify({circleIds: id,type: type, status: statu, adminId: sessionStorage.getItem('id')})).then(data => {
						
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
			//详情/评论/回答
			details(id, href) {
				this.$router.push({
					path: '/'+href,
					query: {
						id: id
					}
				})
			}
		},
		mounted() {
			this.getData();
		},
		watch: {
			$route(to,from){
				this.handleCurrentChange(1)
			}
		}
	}

</script>

<style scoped>
	video{
		width: 90%;
	}
	.cell img{
		max-width: 90%;
	}
</style>