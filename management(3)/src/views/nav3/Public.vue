<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.content" placeholder="搜索标题"></el-input>
				</el-form-item>
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
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" width="40"></el-table-column>
            <el-table-column prop="title" label="公益标题" min-width="100"></el-table-column>
			<el-table-column prop="content" label="内容" min-width="190">
				<template scope="scope">
					<div class="maxH" v-html="scope.row.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></div>
				</template>
			</el-table-column>
			<el-table-column prop="photo" label="图片" min-width="100">
				<template scope="scope">
					<el-row class="maxH" v-if="scope.row.photo">
						<el-row v-for="item in scope.row.photo.split(',')" :key="item.index">
							<img :src="item" />
						</el-row>
					</el-row>
				</template>
			</el-table-column>
            <el-table-column prop="phone" label="手机号" min-width="105"></el-table-column>
            <el-table-column prop="type" label="类型" :formatter="type" min-width="50"></el-table-column>
			<el-table-column prop="status" label="状态" :formatter="status"></el-table-column>
			<el-table-column prop="nickname" label="发布者" min-width="95"></el-table-column>
			<el-table-column prop="createTime" label="发布时间" sortable min-width="102"></el-table-column>
			<el-table-column label="操作" min-width="148" align="center">
				<template scope="scope">
					<el-button size="small" @click="details(scope.row)">详情</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<el-button v-if="scope.row.status === 0" type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
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
				<el-form-item v-if="editForm.status === -1" label="原因" prop="reason" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
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
				<el-form-item label="用户ID" prop="userId" :rules="[{ required: true, message: '请填写用户ID', trigger: 'blur' }]">
                    <el-input v-model="addForm.userId" type="number"></el-input>
                </el-form-item>
                <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请填写标题', trigger: 'blur' }]">
                    <el-input v-model="addForm.title"></el-input>
                </el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="addForm.type">
						<el-radio :label="0">寻物</el-radio>
						<el-radio :label="1">寻人</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机号" prop="phone" :rules="[{ required: true, message: '请填写手机号', trigger: 'blur' }]">
                    <el-input v-model="addForm.phone" type="number"></el-input>
                </el-form-item>
				<el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.content" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="图片" prop="photo" :rules="[{ required: true, message: '请选择图片', trigger: 'blur' }]">
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
                    typeList: [{
						value: '0',
						label: '寻物'
						}, {
						value: '1',
						label: '寻人'
					}],
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
				editFormVisible: false,
				editLoading: false,
				
				editForm: {
					charityIds: 0,
					status: 1,
					reason: ''
				},
				fileList: [],
				addFormVisible: false,
				addLoading: false,
				
				addForm: {
					userId: '',
					title: '',
					type: 0,
					status: 1,
					phone: '',
                    content: '',
                    photo: []
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
				return row.status === 0 ? '审核中' : row.status === 1 ? '审核通过' :'未通过';
            },
            type(row, column){
                return row.type === 0 ? '寻物' : '寻人';
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
                    type: this.filters.type,
					status: this.filters.status,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1]
				};
				
				this.$http.post('mcharity/list', this.qs.stringify(para)).then(data => {
					
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
					userId: '',
					title: '',
					type: 0,
					status: 1,
					phone: '',
                    content: '',
                    photo: []
				};
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;

                            if(Array.isArray(this.addForm.photo)&&this.addForm.photo.length>0){
                                this.addForm.photo = this.addForm.photo.join(",");
                            }

                            let para = Object.assign({}, this.addForm);
                            
							this.$http.post('mcharity/add', this.qs.stringify(para)).then(data => {
								
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
				this.editForm.charityIds = row.id;
			},
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.listLoading = true;
							this.$http.post('mcharity/update', this.qs.stringify(this.editForm)).then(data => {
								
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
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					this.$http.post('mcharity/delete', this.qs.stringify(para)).then(data => {
						
						let  res = data.data;
						if (res.status !== 0) {
							this.$message({
								message: res.msg,
								type: 'error'
							});
						} else {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getData();
						}
					})
				}).catch(() => {

				});
			},
			//详情
			details(row) {
				this.$router.push({
					path: '/publicD',
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
	.cell img{
		max-width: 100%;
	}
	.el-row+div.el-row{
		margin-top: 10px;
	}
</style>