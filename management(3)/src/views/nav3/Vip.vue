<template>
	<section>
		<el-row class="header" :gutter="30">
			<el-col :span="7">
				<dir class="grid">
					<div class="title">今日总额</div>
					<div class="num">{{data.dayCount}}</div>
				</dir>
			</el-col>
			<el-col :span="7">
				<dir class="grid">
					<div class="title">本月总额</div>
					<div class="num">{{data.monthCount}}</div>
				</dir>
			</el-col>
			<el-col :span="7">
				<dir class="grid">
					<div class="title">总金额</div>
					<div class="num">{{data.sumCount}}</div>
				</dir>
			</el-col>
		</el-row>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.way" placeholder="支付方式">
						<el-option v-for="item in filters.wayList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
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
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" min-width="60"></el-table-column>
            <el-table-column prop="orderNo" label="订单号" min-width="140"></el-table-column>
			<el-table-column prop="duration" label="时长(天)"></el-table-column>
            <el-table-column prop="price" label="金额(元)"></el-table-column>
			<el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column prop="way" label="支付方式" :formatter="way"></el-table-column>
			<el-table-column prop="status" label="状态" :formatter="status"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable min-width="110"></el-table-column>
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
				data: {},
				filters: {
					content: '',
					options: [{
						value: '0',
						label: '未支付'
						}, {
						value: '1',
						label: '已支付'
					}],
                    status: '',
                    wayList: [{
						value: '0',
						label: '支付宝'
						}, {
						value: '1',
						label: '微信'
					}],
        			way: '',
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
				listLoading: false
			}
		},
		created(){
			this.$http.post('morder/money/count').then(data => {
					let  res = data.data;
					if (res.status !== 0) {
						
					} else {
						this.data = Object.assign({}, res.data);
					}
				});
		},
		methods: {
			//状态
			status: function (row, column) {
				return row.status === 0 ? '未支付' :'已支付';
            },
            way(row, column){
                return row.way === 0 ? '支付宝' : '微信';
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
                    way: this.filters.way,
					status: this.filters.status,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1]
				};
				
				this.$http.post('morder/list', this.qs.stringify(para)).then(data => {
					
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
            }
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped lang="scss">
	.header{
        text-align: center;
        margin: 10px 0;
        .grid{
            border: 1px solid #f0f0f0;
            padding: 16px 0;
            border-radius: 4px;
        }
        .title{
            font-size: 18px;
            line-height: 30px;
            margin-bottom: 6px;
        }
        .num{
            font-size: 20px;
            font-weight: bold;
        }
    }
</style>