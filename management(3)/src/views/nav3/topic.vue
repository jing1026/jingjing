<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.content" placeholder="搜索标题"></el-input>
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
			<el-table-column prop="id" label="ID" width="60"></el-table-column>
			<el-table-column prop="title" label="标题"></el-table-column>
			<el-table-column prop="content" label="内容" min-width="200">
				<template scope="scope">
					<div v-html="scope.row.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></div>
				</template>
			</el-table-column>
            <!-- <el-table-column prop="photo" label="图片" min-width="100">
				<template scope="scope">
					<el-row class="maxH" v-if="scope.row.photo">
						<el-row v-for="item in scope.row.photo.split(',')" :key="item.index">
							<img :src="item" />
						</el-row>
					</el-row>
				</template>
			</el-table-column> -->
			<el-table-column prop="createTime" label="创建时间" sortable>
				<template scope="scope">
					<span>{{scope.row.createTime}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="240">
				<template scope="scope">
					<!-- <el-button size="small" @click="comment(scope.row.id)">查看评论</el-button> -->
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

        <!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" @close="dialogClose" width="620px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
                <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请填写标题', trigger: 'blur' }]">
                    <el-input v-model="editForm.title"></el-input>
                </el-form-item>
				<el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.content" auto-complete="off"></el-input>
				</el-form-item>
                <!-- <el-form-item label="图片" prop="photo" :rules="[{ required: true, message: '请选择图片', trigger: 'blur' }]">
                    <el-upload action="" :http-request="(res)=>{return Upload(res, 'editForm')}" list-type="picture-card" :multiple="false" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" accept="image/*" :limit="9" :on-exceed="handleExceed" :file-list="fileList">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="dialogClose" width="620px">
            <el-form :model="addForm" label-width="80px" ref="addForm">
                <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请填写标题', trigger: 'blur' }]">
                    <el-input v-model="addForm.title"></el-input>
                </el-form-item>
				<el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.content" auto-complete="off"></el-input>
				</el-form-item>
                <!-- <el-form-item label="图片" prop="photo" :rules="[{ required: true, message: '请选择图片', trigger: 'blur' }]">
                    <el-upload action="" :http-request="(res)=>{return Upload(res, 'addForm')}" list-type="picture-card" :multiple="false" :on-preview="handlePictureCardPreview" :on-remove="(res)=>{return handleRemove(res, 'addForm')}" :before-upload="beforeAvatarUpload" accept="image/*" :limit="9" :on-exceed="handleExceed" :file-list="fileList">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item> -->
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
					date: '',
					status: ''
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
                fileList: [],
				editFormVisible: false,
				editLoading: false,
				editForm: {
					id: 0,
					title: '',
                    content: '',
                    // photo: []
				},
				addFormVisible: false,
				addLoading: false,
				addForm: {
                    title: '',
					content: '',
					userId: 1,
                    // photo: []
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
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取数据列表
			getData:function (){
				this.listLoading = true;
				let para = {
					pageNum: this.page,
					pageSize: this.pageSize,
					content: this.filters.content,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1],
					status: this.filters.status,
				};
				this.$http.post('mcircleTopic/list', this.qs.stringify(para)).then(data => {
					
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
					title: '',
					content: '',
					userId: 1,
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
                            
							this.$http.post('mcircleTopic/add', this.qs.stringify(para)).then(data => {
								
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
                this.editForm = Object.assign({}, row);
                // let arr = this.editForm.photo.split(",");
                // this.editForm.photo =  arr;
                for (var i = 0; i < arr.length; i++) {
                    let list  = new Object();
                    // list.url = arr[i];
                    this.fileList.push(list);
                }
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            // if(this.editForm.photo.length>0){
                            //     this.editForm.photo = this.editForm.photo.join(",");
                            // }
							this.$http.post('mcircleTopic/update', this.qs.stringify(this.editForm)).then(data => {
								
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
                                    this.fileList = [];
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getData();
								}
							});
						});
					}
				});
			},
            //删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { topicIds: row.id };
					this.$http.post('mcircleTopic/batchDel', this.qs.stringify(para)).then(data => {
						
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
			// comment(id){
			// 	this.$router.push({
			// 		path: '/comment',
			// 		query: {
			// 			subject: 1,
			// 			id: id
			// 		}
			// 	})
			// }
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>
	.cell img{
		max-width: 80%;
	}
</style>