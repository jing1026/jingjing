<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增商品</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column prop="id" label="ID" width="60"></el-table-column>
			<el-table-column prop="content" label="商品介绍">
				<template scope="scope">
					<div class="maxH" v-html="scope.row.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></div>
				</template>
			</el-table-column>
            <el-table-column prop="photo" label="商品图" width="160">
                <template scope="scope">
					<el-row v-if="scope.row.url">
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
			<el-table-column prop="status" label="状态" :formatter="status"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button size="small" @click="details(scope.$index, scope.row)">详情</el-button>
					<el-button v-if="scope.row.status === 0" type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button size="small" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

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

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="dialogClose" width="620px">
            <el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="标题" prop="name" :rules="[{ required: true, message: '请填写标题', trigger: 'blur' }]">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
				<el-form-item label="价格" prop="price" :rules="[{ required: true, message: '请填写价格', trigger: 'blur' }]">
                    <el-input v-model="addForm.price"></el-input>
                </el-form-item>
				<el-form-item label="商品简介" prop="introduce" :rules="[{ required: true, message: '请填写商品简介', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="addForm.introduce" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item v-if="type === 0||type === 1" label="视频" prop="vodUrl">
                    <el-upload class="avatar-uploader photo" :http-request="Upvideo" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="video/*">
						<video id="myVideo" v-if="addForm.vodUrl" :src="addForm.vodUrl" :poster="addForm.vodCover" controls></video>
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
                </el-form-item> -->
                <el-form-item v-if="type === 0||type === 2" label="商品图片" prop="photo">
                    <el-upload action="" :http-request="(res)=>{return Upload(res, 'addForm')}" list-type="picture-card" :multiple="false" :on-preview="handlePictureCardPreview" :on-remove="(res)=>{return handleRemove(res, 'addForm')}" :before-upload="beforeAvatarUpload" accept="image/*" :limit="9" :on-exceed="handleExceed" :file-list="fileList">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
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
                editFormVisible: false,
				editLoading: false,
				
				editForm: {
					adminId: 0,
					ids: 0,
					status: 1,
					reason: ''
				},
				fileList: [],
				addFormVisible: false,
				addLoading: false,
				
				addForm: {
                    otherId: '',
					photo: [],
					introduce: '',
					vodUrl: '',
					vodCover: '',
					status: '',
					// duration: ''
                },
                dialogImageUrl: '',
				dialogVisible: false,
				type: 0,
				sels: []
			}
		},
		methods: {
			// Upvideo(file) {
            //     var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
			// 	client().put(fileName, file.file).then(result => {
			// 		this.type = 1;
			// 		this.addForm.vodUrl = result.url;
			// 		this.addForm.vodCover = result.url + '?x-oss-process=video/snapshot,t_10000,m_fast';
            //         this.listLoading = false;
			// 	}).catch(function (err) {
			// 		console.log(err)
	 		// 	});
			// },
			dialogClose(){
                this.fileList = [];
            },
            beforeAvatarUpload(file) {
                this.listLoading = true;
			},
			Upload(file, index) {
                var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
				client().put(fileName, file.file).then(result => {
					this.type = 2;
                    this.fileList.push(result);
                    this[index]['photo'].push(result.url);
                    this.listLoading = false;
				}).catch(function (err) {
	       			this.$message({
                        message: err,
                        type: 'error'
                    });
	 			});
            },
            handleRemove(file, index) {
                this[index].photo.remove(file.url);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleExceed(files, fileList){
                this.$message.warning('当前限制选择 9 个文件');
            },
			status: function (row, column) {
				return row.status === 0 ? '审核中' : row.status === 1?'通过':'未通过';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取数据列表
			getData:function (){
				this.listLoading = true;
				let para = {
                    id: this.$route.query.id,
					pageNum: this.page,
					pageSize: this.pageSize
				};

				this.$http.post('mstore/info/goods', this.qs.stringify(para)).then(data => {
					
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
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					otherId: this.$route.query.id,
					photo: [],
					introduce: '',
					vodUrl: '',
					vodCover: '',
					status: ''
				};
				this.type = 0;
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							// this.publish.duration = Math.round(document.getElementById("myVideo").duration);
                            this.addLoading = true;
                            if(Array.isArray(this.addForm.photo)&&this.addForm.photo.length>0){
                                this.addForm.photo = this.addForm.photo.join(",");
                            }
                            
							this.$http.post('mstore/info/goods/add', this.qs.stringify(this.addForm)).then(data => {
								
								let  res = data.data;
								if (res.status !== 0) {
									this.$message({
										message: res.msg,
										type: 'error'
									});
								} else {
									this.addLoading = false;
									this.$message({
										message: '提交成功',
										type: 'success'
                                    });
                                    this.fileList = [];
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getData();
								}
							});
						});
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
							this.$http.post('mstore/goods/update', this.qs.stringify(this.editForm)).then(data => {
								
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
			//详情
			details: function (index, row, m) {
				this.$router.push({
					path: '/info',
					query: {
						id: row.id
					}
				})
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除
			handleDel(id) {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mstore/goods/delete', this.qs.stringify({ids: id, adminId: sessionStorage.getItem('id')})).then(data => {
						
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
		}
	}

</script>

<style scoped>
	.el-row video{
		width: 60%;
	}
	#myVideo{
		width: 100%;
		height: 100%;
	}
</style>