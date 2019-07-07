<template>
	<section v-loading="listLoading">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.content" placeholder="关键词"></el-input>
				</el-form-item>
                <el-form-item v-if="addForm.type !== 'list'">
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
				<el-form-item class="fr" v-if="addForm.type !== 'list'">
					<el-button type="primary" plain @click="handleChange(addForm.type)">分类</el-button>
				</el-form-item>
				<el-form-item class="fr" v-if="addForm.type !== 'list'">
					<el-button type="primary" plain @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column prop="id" label="ID" width="55"></el-table-column>
            <el-table-column prop="name" label="店铺名称"></el-table-column>
			<el-table-column prop="place" label="店铺地址"></el-table-column>
			<el-table-column prop="categoryName" label="店铺分类"></el-table-column>
			<el-table-column prop="phone" label="联系电话"></el-table-column>
			<el-table-column prop="logo" label="店铺logo">
                <template scope="scope">
                    <img class="logo" :src="scope.row.logo" />
				</template>
            </el-table-column>
			<el-table-column prop="type" label="店铺类型" :formatter="type" min-width="80"></el-table-column>
            <el-table-column prop="nickname" label="用户昵称">
				<template scope="scope">
					<el-button @click="Click(scope.row)" type="text" size="small">{{scope.row.nickname}}</el-button>
				</template>
			</el-table-column>
            <el-table-column prop="status" label="状态" :formatter="status"></el-table-column>
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-row class="line">
						<el-button size="small" @click="details(scope.$index, scope.row, 'D')">详情</el-button>
                    	<el-button v-if="scope.row.status === 0" type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
						<el-row v-if="scope.row.status === 1">
							<el-button type="primary" plain size="small" @click="details(scope.$index, scope.row, 'M')">商品</el-button>
							<el-button v-if="scope.row.recommend === 0" type="success" plain size="small" @click="wonderful(scope.row.id, 1)">推荐</el-button>
							<el-button v-else type="success" plain size="small" @click="wonderful(scope.row.id, 0)">取消推荐</el-button>
						</el-row>
					</el-row>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-row class="toolbar">
			<el-button size="small" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination class="fr" layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total">
			</el-pagination>
		</el-row>

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
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="600px">
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="用户ID" prop="userId" :rules="[{ required: true, message: '请填写用户ID', trigger: 'blur' }]">
                    <el-input v-model="addForm.userId" type="number"></el-input>
                </el-form-item>
				<el-form-item label="店铺名称" prop="name" :rules="[{ required: true, message: '请填写店铺名称', trigger: 'blur' }]">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
				<el-form-item label="店铺地址" prop="place" :rules="[{ required: true, message: '请填写店铺地址', trigger: 'blur' }]">
                    <el-input v-model="addForm.place"></el-input>
                </el-form-item>
				<el-form-item v-if="addForm.type != 0" label="店铺分类" prop="explicit" :rules="[{ required: true, message: '请选择店铺分类', trigger: 'blur' }]">
					<el-select v-model="addForm.explicit" style="width:100%">
						<el-option v-for="item in option" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机号" prop="phone" :rules="[{ required: true, message: '请填写手机号', trigger: 'blur' }]">
                    <el-input v-model="addForm.phone" type="number"></el-input>
                </el-form-item>
				<el-form-item label="店铺介绍" prop="information" :rules="[{ required: true, message: '请填写店铺介绍', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.information" auto-complete="off"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="店铺logo" prop="logo" :rules="[{ required: true, message: '请上传店铺logo', trigger: 'blur' }]">
							<el-upload class="avatar-uploader photo" :http-request="(res)=>{return Upload(res, 'logo', 0)}" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png">
								<img v-if="addForm.logo" :src="addForm.logo" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="店铺封面" prop="cover" :rules="[{ required: true, message: '请上传店铺封面', trigger: 'blur' }]">
							<el-upload class="avatar-uploader photo" :http-request="(res)=>{return Upload(res, 'cover', 0)}" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png">
								<img v-if="addForm.cover" :src="addForm.cover" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	var getLastUrl=(str,yourStr)=>str.slice(str.lastIndexOf(yourStr)+1);
	
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
					adminId: 0,
					ids: 0,
					status: 1,
					reason: ''
				},
				sels: [],
				option: [],
				addFormVisible: false,
				addLoading: false,
				addForm: {
					userId:'',
                    name:'',
                    phone: '',
                    place: '',
                    cover: '',
                    logo: '',
                    information: '',
                    type: 0,
                    explicit: ''
				}
			}
		},
		methods: {
			type: function (row, column) {
				return row.type === 1 ? '女性专区' : row.type === 2?'特色小吃' : row.type === 3?'餐饮美食': row.type === 4?'服装排版': row.type === 5?'更多电商':' ';
			},
			beforeAvatarUpload(file) {
                this.listLoading = true;
            },
			Upload(file, index, type) {
                var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
				client().put(fileName, file.file).then(result => {
                    if(type === 0){
                        this.addForm[index] = result.url;
                    }else{
                        this[index].push(result);
                        this.addForm[index].push(result.url);
                    }
                    this.listLoading = false;
				}).catch(function (err) {
                    console.log(err)
	 			});
            },
			status: function (row, column) {
				return row.status === 0 ? '审核中' : row.status === 1?'审核通过':'未通过';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
            },
			//获取列表
			getData:function (){
				this.addForm.type =getLastUrl(window.location.href,'/');
				this.listLoading = true;
				let para = {
					pageNum: this.page,
                    pageSize: this.pageSize,
                    status: this.filters.status,
                    content: this.filters.content,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1]
				};
				
				if(this.addForm.type === 'list'){
					para.status = 0
				}else{
					para.type = this.addForm.type
				}
				
				this.$http.post('mstore/list', this.qs.stringify(para)).then(data => {
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
			Click(row){
				this.$router.push({
					path: '/userD',
					query: {
						id: row.userId
					}
				})
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				// if(this.addForm.type == 2){
				// 	this.options = [{
				// 		id: '0',
				// 		name: '麻辣汤/烧烤'
				// 		}, {
				// 		id: '1',
				// 		name: '炒饭/炒面'
				// 	}, {
				// 		id: '2',
				// 		name: '水果/蛋糕'
				// 	}, {
				// 		id: '3',
				// 		name: '奶茶/小吃'
				// 	}, {
				// 		id: '4',
				// 		name: '火锅/烤鱼'
				// 	}, {
				// 		id: '5',
				// 		name: '西餐/日料'
				// 	}, {
				// 		id: '6',
				// 		name: '烤鸡/汉堡'
				// 	}, {
				// 		id: '7',
				// 		name: '茶点/饺类'
				// 	}, {
				// 		id: '8',
				// 		name: '精品快餐'
				// 	}, {
				// 		id: '9',
				// 		name: '汤粉/砂锅煲'
				// 	}]
				// }else if(this.addForm.type == 3){
				// 	this.options = [{
				// 		id: '0',
				// 		name: '青少年'
				// 		}, {
				// 		id: '1',
				// 		name: '儿童'
				// 	}, {
				// 		id: '2',
				// 		name: '中年人'
				// 	}, {
				// 		id: '3',
				// 		name: '老年人'
				// 	}]
				// }else if(this.addForm.type == 4){
					this.$http.post('http://www.jiaxiangapp.com/jx/user/category/list', this.qs.stringify({parentId: this.addForm.type,
					type: 1,
					pageNum: 1,
					pageSize: 1000})).then(data => {
						let  res = data.data;
						if (res.status !== 0) {
							this.$message({
								message: res.msg,
								type: 'error'
							});
						} else {
							this.option = res.data;
						}
					});
					this.addForm.category = this.addForm.explicit
				// }
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.listLoading = true;
							this.addForm.category = this.addForm.explicit
                            this.$http.post('mstore/add', this.qs.stringify(this.addForm)).then(data => {
                                
                                let  res = data.data;
                                this.listLoading = false;
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
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
                                }
                            })
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
			selsChange: function (sels) {
				this.sels = sels;
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
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.handleDel(ids);
			},
			//详情
			details: function (index, row, m) {
				this.$router.push({
					path: '/list'+m,
					query: {
						id: row.id
					}
				})
			},
			handleChange(type){
				console.log(type)
				this.$router.push({
					path: '/listF',
					query: {
						id: parseInt(type)
					}
				})
			}
		},
		mounted() {
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
	.logo{
		display: block;
		width: 45px;
		height: 45px;
		border-radius: 50%;
	}
</style>