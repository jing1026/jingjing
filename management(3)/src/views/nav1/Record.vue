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
					<el-select v-model="filters.operationType" placeholder="操作">
						<el-option v-for="item in filters.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions0"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleCurrentChange(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" width="60"></el-table-column>
			<el-table-column prop="content" label="操作内容"></el-table-column>
			<el-table-column prop="adminId" label="管理员"></el-table-column>
			<el-table-column prop="createTime" label="时间" sortable></el-table-column>
			<el-table-column label="操作" width="100" align="center">
				<template scope="scope">
					<el-row>
						<el-button size="small" @click="details(scope.row.userId)">用户详情</el-button>
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
	import util from '../../common/js/util'
	
	export default {
		data() {
			return {
				filters: {
					content: '',
					options: [],
                    operationType: 0,
                    typeList: [],
        			type: '',
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
				url: '',
				kind: ''
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取数据列表
			getData:function (){
				this.url = this.$route.path;
				if(this.url === '/dynamicR'){
					this.kind = 0;
					this.filters.options = [{
						value: -1,
						label: '未通过'
						}, {
						value: 0,
						label: '审核成功'
					}, {
						value: 1,
						label: '发送系统通知'
					}, {
						value: 2,
						label: '删除'
					}, {
						value: 3,
						label: '上热门'
					}, {
						value: 4,
						label: '取消热门'
					}];
					this.filters.typeList = [{
						value: 0,
						label: '动态'
						}, {
						value: 1,
						label: '文章'
						}, {
						value: 2,
						label: '求助'
					}, {
						value: 3,
						label: '讨论'
					}, {
						value: 4,
						label: '问答'
					}, {
						value: 5,
						label: '视频'
					}];
				}else if(this.url === '/streetR'){
					this.kind = 1;
					this.filters.options = [{
						value: -1,
						label: '未通过'
						}, {
						value: 0,
						label: '审核成功'
					}, {
						value: 1,
						label: '发送系统通知'
					}, {
						value: 2,
						label: '删除'
					}];
					this.filters.typeList = [{
						value: 0,
						label: '女性专区'
						}, {
						value: 1,
						label: '特色小吃'
						}, {
						value: 2,
						label: '餐饮美食'
					}, {
						value: 3,
						label: '服装排版'
					}, {
						value: 4,
						label: '更多电商'
					}, {
						value: 5,
						label: '二手交易'
					}, {
						value: 6,
						label: '顺风车'
					}, {
						value: 7,
						label: '房屋租赁'
					}, {
						value: 8,
						label: '招聘'
					}, {
						value: 9,
						label: '合作'
					}, {
						value: 10,
						label: '便民电话'
					}];
				}else if(this.url === '/commodityR'){
					this.kind = 2;
					this.filters.options = [{
						value: -1,
						label: '未通过'
						}, {
						value: 0,
						label: '审核成功'
					}, {
						value: 1,
						label: '发送系统通知'
					}, {
						value: 2,
						label: '删除'
					}];
					this.filters.typeList = [{
						value: 0,
						label: '女性专区'
						}, {
						value: 1,
						label: '特色小吃'
						}, {
						value: 2,
						label: '餐饮美食'
					}, {
						value: 3,
						label: '服装排版'
					}, {
						value: 4,
						label: '更多电商'
					}];
				}else if(this.url === '/videoR'){
					this.kind = 3;
					this.filters.options = [{
						value: -1,
						label: '未通过'
						}, {
						value: 0,
						label: '推送至精彩/推荐'
					}, {
						value: 1,
						label: '发送系统通知'
					}];
					this.filters.typeList = [{
						value: 0,
						label: '推荐'
					}, {
						value: 1,
						label: '精彩小视频'
					}];
				}else if(this.url === '/userR'){
					this.kind = 4;
					this.filters.options = [{
						value: -1,
						label: '取消禁言/封号'
					},{
						value: 0,
						label: '设置禁言/封号'
					}, {
						value: 1,
						label: '系统通知'
					}];
					this.filters.typeList = [{
						value: 0,
						label: '封号相关'
					}, {
						value: 1,
						label: '禁言相关'
					}];
				}

				this.listLoading = true;

				let para = {
                    kind: this.kind,
                    operationType: this.filters.operationType,
                    type: this.filters.type,
					pageNum: this.page,
					pageSize: this.pageSize,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1]
				};

				this.$http.post('madmin/operation/record', this.qs.stringify(para)).then(data => {
					
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
			//详情
			details(id) {
				this.$router.push({
					path: '/userD',
					query: {
						id: id
					}
				})
			}
		},
		created() {
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
	
</style>