<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
                <el-form-item>
					<el-select v-model="filters.type" placeholder="类型">
						<el-option v-for="item in filters.typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态">
						<el-option v-for="item in filters.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleCurrentChange(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="40"></el-table-column>
			<el-table-column prop="id" label="ID" width="60"></el-table-column>
			<el-table-column prop="title" label="标题" min-width="140">
				<template scope="scope">
					<div class="maxH">{{scope.row.title}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="content" label="内容" min-width="160">
				<template scope="scope">
					<div class="maxH" v-html="decodeURIComponent(scope.row.content)"></div>
				</template>
			</el-table-column>
			<el-table-column prop="photo" label="视频/图片" min-width="100">
				<template scope="scope">
					<el-row v-if="scope.row.type===5">
						<video width="100%" :src="scope.row.url" :poster="scope.row.photo" controls></video>
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
			<el-table-column prop="type" label="类型" :formatter="type"></el-table-column>
			<el-table-column prop="status" label="状态" :formatter="status"></el-table-column>
			<el-table-column prop="createTime" label="发布时间" sortable min-width="102" align="center"></el-table-column>
			<el-table-column label="操作" min-width="200" align="center">
				<template scope="scope">
					<el-row class="line">
						<el-row>
							<el-button type="primary" size="small" @click="details(scope.row.id,'details')">详情</el-button>
						</el-row>
						<el-row>
							<el-button size="small" @click="details(scope.row.id, 'comment')">评论</el-button>
						</el-row>
						<el-row>
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
	</section>
</template>

<script>
	import util from '../../common/js/util'
	
	export default {
		data() {
			return {
				filters: {
                    typeList: [{
						value: '0',
						label: '动态'
					}, {
						value: '1',
						label: '文章'
					}, {
						value: '2',
						label: '求助'
					}, {
						value: '3',
						label: '讨论'
					}, {
						value: '4',
						label: '问答'
					}, {
						value: '5',
						label: '视频'
					}, {
						value: '6',
						label: '问答'
					}],
        			type: '',
					options: [{
						value: '0',
						label: '审核中'
						}, {
						value: '1',
						label: '审核通过'
					}, {
						value: '-1',
						label: '未通过'
					}],
        			status: '',
					date: ''
				},
				list: [],
				total: 0,
				page: 1,
                pageSize: 10,
                sels: [],
				listLoading: false
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
				}
			},
			//状态
			status: function (row, column) {
				return row.status === 0 ? '审核中' : row.status === 1 ? '审核通过' : '未通过';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取列表
			getData:function (){
				
				this.listLoading = true;

				let para = {
                    userId: this.$route.query.id,
					pageNum: this.page,
					pageSize: this.pageSize,
					type: this.filters.type,
					status: this.filters.status
				};
				
				this.$http.post('mcircle/user/push', this.qs.stringify(para)).then(data => {
					
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
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.handleDel(ids);
			},
			//详情/评论
			details(id, href) {
				this.$router.push({
					path: '/' + href,
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
	.cell img{
		max-width: 100%;
	}
</style>