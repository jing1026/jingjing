<template>
	<section v-loading="listLoading" style="padding-top:30px">
		<!--列表-->
		<el-table :data="list" stripe highlight-current-row style="width: 100%;">
			<el-table-column prop="id" label="ID" width="55"></el-table-column>
            <el-table-column prop="name" label="店铺名称"></el-table-column>
			<el-table-column prop="logo" label="店铺logo">
                <template scope="scope">
                    <img class="logo" :src="scope.row.logo" />
				</template>
            </el-table-column>
            <el-table-column prop="nickname" label="用户昵称"></el-table-column>
            <el-table-column prop="type" label="店铺类型" :formatter="type" min-width="80"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="status" min-width="60"></el-table-column>
			<el-table-column label="操作" min-width="180">
				<template scope="scope">
					<el-row class="line">
						<el-button size="small" @click="details(scope.$index, scope.row, 'D')">详情</el-button>
                    	<el-button v-if="scope.row.status === 0" type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
						<el-row v-if="scope.row.status === 1">
							<el-button type="primary" plain size="small" @click="details(scope.$index, scope.row, 'M')">商品</el-button>
							<el-button v-if="scope.row.recommend === 0" type="success" plain size="small" @click="wonderful(scope.row.id, 1)">推荐</el-button>
							<el-button v-else type="success" plain size="small" @click="wonderful(scope.row.id, 0)">取消推荐</el-button>
						</el-row>
                        <el-button type="danger" size="small" @click="handleDel(scope.row.id)">删除</el-button>
					</el-row>
				</template>
			</el-table-column>
		</el-table>
        <!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="选择">
					<el-radio-group v-model="editForm.status">
						<el-radio :label="1">审核通过</el-radio>
						<el-radio :label="-1">拒绝</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="editForm.status === -1" label="原因" prop="reason" :rules="[{ required: true, message: '请填写原因', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.reason" auto-complete="off"></el-input>
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
				list: [],
				total: 0,
				page: 1,
				pageSize: 10,
                listLoading: false,
                editFormVisible: false,
				editLoading: false,
				editForm: {
					adminId: 0,
					ids: 0,
					status: 1,
					reason: ''
				}
			}
		},
		methods: {
            type: function (row, column) {
				return row.type === 0 ? '女性专区' : row.type === 1?'特色小吃' : row.type === 2?'餐饮美食': row.type === 3?'服装排版': row.type === 4?'更多电商':' ';
			},
			status: function (row, column) {
				return row.status === 0 ? '审核中' : row.status === 1?'审核通过':'未通过';
			},
			//获取列表
			getData:function (){
				this.listLoading = true;
				this.$http.post('mstore/user/list', this.qs.stringify({userId: this.$route.query.id,})).then(data => {
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
						this.list = res.data;
						this.listLoading = false;
					}
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm.ids = row.id;
				this.editForm.adminId = sessionStorage.getItem('id');
			},
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.listLoading = true;
							this.$http.post('mstore/update', this.qs.stringify(this.editForm)).then(data => {
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
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
								}
							})
						});
					}
				});
			},
			//推荐
			wonderful(id, statu) {
				this.$confirm('确认执行吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mstore/recommend', this.qs.stringify({ids: id, recommend: statu})).then(data => {
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
			//删除
			handleDel(id) {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mstore/delete', this.qs.stringify({ids: id, adminId: sessionStorage.getItem('id')})).then(data => {
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
			//详情
			details: function (index, row, m) {
				this.$router.push({
					path: '/list' + m,
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
	.logo{
		display: block;
		width: 45px;
		height: 45px;
		border-radius: 50%;
	}
</style>