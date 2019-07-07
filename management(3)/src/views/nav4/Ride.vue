<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.content" placeholder="关键词"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions0"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleCurrentChange(1)">查询</el-button>
				</el-form-item>
				<el-form-item class="fr">
					<el-button type="primary" plain @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column prop="id" label="ID" min-width="30"></el-table-column>
			<el-table-column prop="startPlace" label="出发地"></el-table-column>
			<el-table-column prop="endPlace" label="目的地"></el-table-column>
			<el-table-column prop="seatNum" label="车座数"></el-table-column>
			<el-table-column prop="phone" label="联系电话" min-width="100"></el-table-column>
			<el-table-column prop="startTime" label="出发时间"></el-table-column>
			<el-table-column prop="status" label="状态" :formatter="status" min-width="76" align="center"></el-table-column>
			<el-table-column prop="nickname" label="发布者">
				<template scope="scope">
					<el-button @click="Click(scope.row)" type="text" size="small">{{scope.row.nickname}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable min-width="100"></el-table-column>
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button size="small" @click="details(scope.row)">详情</el-button>
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
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="dialogClose" width="640px">
            <el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="用户ID" prop="userId" :rules="[{ required: true, message: '请填写用户ID', trigger: 'blur' }]">
					<el-input v-model="addForm.userId" type="number"></el-input>
				</el-form-item>
				<el-row :span="20">
					<el-col :span="12">
						<el-form-item label="出发地" prop="startPlace" :rules="[{ required: true, message: '请填写出发地', trigger: 'blur' }]">
							<el-input v-model="addForm.startPlace"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="目的地" prop="endPlace" :rules="[{ required: true, message: '请填写目的地', trigger: 'blur' }]">
							<el-input v-model="addForm.endPlace"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :span="20">
					<el-col :span="12">
						<el-form-item label="座位数" prop="seatNum" :rules="[{ required: true, message: '请填写座位数', trigger: 'blur' }]">
							<el-input v-model="addForm.seatNum" type="number"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="出发时间" prop="startTime" :rules="[{ required: true, message: '请选择出发时间', trigger: 'blur' }]">
							<el-date-picker type="datetime" placeholder="选择出发时间" v-model="addForm.startTime" :picker-options="pickerOptions1" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="联系电话" prop="phone" :rules="[{ required: true, message: '请填写联系电话', trigger: 'blur' }]">
                    <el-input v-model="addForm.phone" type="number"></el-input>
                </el-form-item>
				<el-form-item label="描述" prop="inform" :rules="[{ required: true, message: '请填写内容描述', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.inform"></el-input>
				</el-form-item>
                <el-form-item label="图片" prop="carPhoto" :rules="[{ required: true, message: '请选择图片', trigger: 'blur' }]">
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
	Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
        this.splice(index, 1);
        }
    };

    import { client } from '../../common/js/alioss'
	import util from '../../common/js/util'
	
	export default {
		data() {
			return {
				filters: {
                    content: '',
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
				sels: [],
				editFormVisible: false,
				editLoading: false,
				editForm: {
					adminId: 0,
					ids: 0,
					status: 1,
					reason: ''
				},
				pickerOptions1: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e6;
					}
				},
				fileList: [],
				addFormVisible: false,
				addLoading: false,
				addForm: {
                    userId: '',
					phone: '',
					seatNum: '',
					inform: '',
					startTime: '',
					startPlace: '',
					endPlace: '',
                    carPhoto: []
                },
                dialogImageUrl: '',
                dialogVisible: false
			}
		},
		methods: {
			dialogClose(){
                this.fileList = [];
            },
            beforeAvatarUpload(file) {
                this.listLoading = true;
			},
			Upload(file, index) {
                var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
				client().put(fileName, file.file).then(result => {
                    this.fileList.push(result);
                    this[index]['carPhoto'].push(result.url);
                    this.listLoading = false;
				}).catch(function (err) {
	       			this.$message({
                        message: err,
                        type: 'error'
                    });
	 			});
            },
            handleRemove(file, index) {
                this[index].carPhoto.remove(file.url);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleExceed(files, fileList){
                this.$message.warning('当前限制选择 9 个文件');
            },
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
					pageNum: this.page,
					pageSize: this.pageSize,
                    content: this.filters.content,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1]
				};
				
				this.$http.post('mcar/list', this.qs.stringify(para)).then(data => {
					
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
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;

                            if(Array.isArray(this.addForm.carPhoto)&&this.addForm.carPhoto.length>0){
                                this.addForm.carPhoto = this.addForm.carPhoto.join(",");
                            }

                            let para = Object.assign({}, this.addForm);
                            
							this.$http.post('mcar/add', this.qs.stringify(para)).then(data => {
								
								let  res = data.data;
								if (res.status !== 0) {
									this.$message({
										message: res.msg,
										type: 'error'
									});
								} else {
									this.$message({
										message: '提交成功',
										type: 'success'
                                    });
                                    this.fileList = [];
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getData();
								}
								this.addLoading = false;
							});
						});
					}
				});
			},
			Click(row){
				this.$router.push({
					path: '/userD',
					query: {
						id: row.userId
					}
				})
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
							this.$http.post('mcar/update', this.qs.stringify(this.editForm)).then(data => {
								
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
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除
			handleDel(id) {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mcar/delete', this.qs.stringify({ids: id, adminId: sessionStorage.getItem('id')})).then(data => {
						
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
			//详情
			details(row) {
				this.$router.push({
					path: '/rideD',
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
	.headIcon{
		width: 60px;
		height: 60px;
		border-radius: 50%
	}
</style>