<template>
	<section v-loading="listLoading">
		<!--列表-->
		<el-table :data="list" stripe highlight-current-row style="width: 100%;">
			<el-table-column prop="id" label="ID"></el-table-column>
			<el-table-column prop="content" label="协议内容" min-width="500">
                <template scope="scope">
					<div class="maxH" v-if="scope.row.content" v-html="scope.row.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></div>
				</template>
            </el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

        <!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="620px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="协议内容" prop="content" :rules="[{ required: true, message: '请填写协议内容', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 12, maxRows: 18}" v-model="editForm.content" auto-complete="off"></el-input>
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
	export default {
		data() {
			return {
				list: [],
				listLoading: false,
				editFormVisible: false,
				editLoading: false,
				editForm: {
					id: 0,
                    content: ''
				},
			}
		},
		methods: {
			getData:function (){
				this.listLoading = true;
				this.$http.post('mprotocol/list').then(data => {
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
				this.editForm = Object.assign({}, row);
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							this.$http.post('mprotocol/update', this.qs.stringify(this.editForm)).then(data => {
								
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
			}
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>

</style>