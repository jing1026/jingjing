<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" plain @click="handleAdd()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" min-width="40"></el-table-column>
			<el-table-column prop="cover" label="音乐封面">
                <template scope="scope">
					<img class="covers" :src="scope.row.cover" />
				</template>
            </el-table-column>
            <el-table-column prop="cover" label="音乐">
                <template scope="scope">
					<audio :src="scope.row.url" controls="controls">浏览器不支持语音播放，换个浏览器试试</audio>
				</template>
            </el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable min-width="60"></el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleAdd(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="addFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="addForm" label-width="80px" ref="addForm">
                <el-form-item label="音乐名称" prop="name" :rules="[{ required: true, message: '请填写音乐名称', trigger: 'blur' }]">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="音乐封面" prop="cover" :rules="[{ required: true, message: '请选择音乐封面', trigger: 'blur' }]">
					<el-upload class="avatar-uploader photo" :http-request="(res)=>{return Upload(res, 'cover')}" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png">
						<img v-if="addForm.cover" :src="addForm.cover" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
                <el-form-item label="音乐" prop="url" :rules="[{ required: true, message: '请选择音乐', trigger: 'blur' }]">
                    <el-upload class="avatar-uploader photo" :http-request="(res)=>{return Upload(res, 'url')}" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="audio/*">
                        <audio v-if="addForm.url" :src="addForm.url" controls="controls"></audio>
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
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
    import { client } from '../../common/js/alioss'
	import util from '../../common/js/util'
	
	export default {
		data() {
			return {
				list: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				addFormVisible: false,
				addLoading: false,
				addForm: {
					id: 0,
                    name: '',
                    cover: '',
                    url: ''
				}
			}
		},
		methods: {
            beforeAvatarUpload(file) {
                this.listLoading = true;
			},//图片上传到阿里云
            Upload(file, index) {
				var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
				client().put(fileName, file.file).then(result => {
					this.addForm[index] = result.url;
				}).catch(function (err) {
                    console.log(err);
	 			});
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
					pageSize: this.pageSize
				};
				
				this.$http.post('mroom/music/list', this.qs.stringify(para)).then(data => {
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
			handleAdd: function (row) {
				this.addFormVisible = true;
				if(row !== undefined){
					this.addForm = Object.assign({}, row);
				}else{
                    this.addForm ={
                        id: 0,
                        name: '',
                        cover: '',
                        url: ''
                    }
                }
			},
			//编辑
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let url = '';
							if(this.addForm.id !== 0){
								url = 'mroom/music/update'
							}else{
								url = 'mroom/music/add'
							}

							this.$http.post(url, this.qs.stringify(this.addForm)).then(data => {
								let  res = data.data;
								if (res.status !== 0) {
									this.$message({
										message: res.msg,
										type: 'error'
									});
								} else {
									this.addLoading = false;
									this.$message({
										message: '成功',
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
			},
			//删除
			handleDel(id) {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mroom/music/delete', this.qs.stringify({id: id})).then(data => {
						
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
			}
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>
    .covers{
        display: block;
        max-height: 80px;
    }
    audio{
        max-width: 100%;
    }
</style>