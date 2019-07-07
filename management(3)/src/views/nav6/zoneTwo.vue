<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.content" placeholder="关键词"></el-input>
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
					<el-button type="primary" plain @click="addEdit">发布{{$route.name}}</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="28"></el-table-column>
			<el-table-column prop="id" label="ID" min-width="50"></el-table-column>
			<el-table-column v-if="publish.type !== '0'" prop="title" label="标题" min-width="80">
				<template scope="scope">
					<div class="maxH">{{scope.row.title}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="content" label="内容" min-width="80">
				<template scope="scope">
					<div class="maxH" v-if="scope.row.content" v-html="decodeURIComponent(scope.row.content)"></div>
				</template>
			</el-table-column>
			<el-table-column prop="photo" label="图片" min-width="100">
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
			<el-table-column prop="likeNum" label="点赞数" min-width="63" align="center">
				<template scope="scope">
					<span v-if="scope.$index !== current||form.type !== 0" @click="handleClick(scope.$index, scope.row.id, scope.row.likeNum, 0)">{{scope.row.likeNum}}</span>
					<el-input class="paddingM" v-focus="{ cls: 'el-input',tag: 'input', foc: count }" v-if="scope.$index == current&&form.type === 0" v-model="form.num" @blur="handleBlur()"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="commentNum" label="评论数" min-width="63" align="center"></el-table-column>
			<el-table-column prop="viewNum" label="浏览数" min-width="63" align="center">
				<template scope="scope">
					<span v-if="scope.$index !== current||form.type !== 1" @click="handleClick(scope.$index, scope.row.id, scope.row.viewNum, 1)">{{scope.row.viewNum}}</span>
					<el-input class="paddingM" v-focus="{ cls: 'el-input',tag: 'input', foc: count }" v-if="scope.$index == current&&form.type === 1" v-model="form.num" @blur="handleBlur()"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" :formatter="status" min-width="76" align="center"></el-table-column>
			<!-- <el-table-column prop="nickname" label="发布者" align="center" min-width="64"></el-table-column> -->
			<el-table-column prop="nickname" label="发布者" align="center" min-width="64">
				<template scope="scope">
					<el-button @click="Click(scope.row)" type="text" size="small">{{scope.row.nickname}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="发布时间" sortable min-width="100" align="center"></el-table-column>
			<el-table-column label="操作" :min-width="mWdth" align="center">
				<template scope="scope">
					<el-row class="line">
						<el-row>
							<el-button type="primary" size="small" @click="details(scope.row.id,'details')">详情</el-button>
						</el-row>
						<el-row v-if="scope.row.status === 0">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row,-1)">上热门</el-button>
						</el-row>
						<el-row v-else-if="scope.row.status === 1">
							<el-row>
								<el-button v-if="publish.type === '4' " size="small" @click="details(scope.row.id ,'answer')">回答</el-button>
								<el-button v-else size="small" @click="details(scope.row.id ,'comment')">评论</el-button>
							</el-row>
							<el-row v-if="publish.type === '0'">
								<el-row>
									<el-button v-if="scope.row.top === 1" type="danger" plain size="small" @click="down(scope.$index, scope.row)">取消置顶</el-button>
									<el-button v-else type="primary" size="small" plain @click="top(scope.$index, scope.row)">置顶</el-button>
								</el-row>
								<el-row>
									<el-button v-if="scope.row.recommend === 0" type="success" plain size="small" @click="wonderful(scope.row.id, 0, 1)">推荐</el-button>
									<el-button v-else type="success" plain size="small" @click="wonderful(scope.row.id, 0, 0)">取消推荐</el-button>
								</el-row>
								<el-row>
									<el-button type="warning" plain size="small" @click="push(scope.row.id)">推送</el-button>
								</el-row>
							</el-row>
						</el-row>
						<el-row v-else>
							<el-button type="danger" size="small" @click="handleDel(scope.row.id)">删除</el-button>
						</el-row>
					</el-row>
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
						<el-radio :label="1">上热门</el-radio>
						<el-radio :label="-1">不上热门</el-radio>
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

		<!--发布界面-->
		<el-dialog title="发布" :visible.sync="publishVisible" :close-on-click-modal="false" @close="dialogClose" width="620px">
			<el-form :model="publish" label-width="80px" ref="publish">
				<el-form-item label="用户ID" prop="userId" :rules="[{ required: true, message: '请填写用户ID', trigger: 'blur' }]">
                    <el-input v-model="publish.userId" type="number"></el-input>
                </el-form-item>
                <el-form-item v-if="publish.type !=0 " label="标题" prop="title" :rules="[{ required: true, message: '请填写标题', trigger: 'blur' }]">
                    <el-input v-model="publish.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
                    <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 10}" v-model="publish.content" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="photo">
                    <el-upload action="" :http-request="Upload" list-type="picture-card" :multiple="false" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" accept="image/*" :limit="9" :on-exceed="handleExceed" :file-list="fileList">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="publishVisible = false">取消</el-button>
				<el-button type="primary" @click.native="publishSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
	</section>
</template>

<script>
	var getLastUrl=(str,yourStr)=>str.slice(str.lastIndexOf(yourStr)+1);

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
				mWdth: 304,
				filters: {
					content: '',
					options: [{
						value: '0',
						label: '审核中'
						}, {
						value: '1',
						label: '上热门'
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
				sels: [],//列表选中列
				editLoading: false,
				
				editForm: {
					adminId: 0,
					circleIds: '',
					status: 1,
					reason: ''
				},
				publishVisible: false,
				fileList: [],
                publish: {
                    userId:'',
                    title:'',
                    kind: 1,
                    photo: [],
                    content:'',
                    type: 0
                },
                dialogImageUrl: '',
                dialogVisible: false,
				form:{
					ids: '',
					type: -1,
					num: '',
				},
				current: -1,
				count: false
			}
		},
		methods: {
			handleBlur(){
				this.count = false;
				this.$confirm('确认修改吗？', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mcircle/total', this.qs.stringify(this.form)).then(data => {
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
							this.current = -1;
							this.type = -1;
							this.getData();
						}
					})
				});
			},
			handleClick(index, id, v, k) {
				this.count = true;
				this.current = index;
				this.form.ids = id;
				this.form.num = v;
				this.form.type = k;
            },
			dialogClose(){
                this.fileList = [];
            },
			addEdit(){
				this.publishVisible = true;
			},
			beforeAvatarUpload(file) {
                this.listLoading = true;
			},
			Upload(file) {
                var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
				client().put(fileName, file.file).then(result => {
                    this.fileList.push(result);
                    this.publish.photo.push(result.url);
                    this.listLoading = false;
				}).catch(function (err) {
	       		
	 			});
            },
            handleRemove(file, fileList) {
                this.publish.photo.remove(file.url);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleExceed(files, fileList){
                this.$message.warning('当前限制选择 9 个文件');
            },
            publishSubmit: function () {
				this.$refs.publish.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.listLoading = true;
                            if(Array.isArray(this.publish.photo)&&this.publish.photo.length>0){
                                this.publish.photo = this.publish.photo.join(",");
                            }
                            this.$http.post('mcircle/add', this.qs.stringify(this.publish)).then(data => {
                                
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
									this.$refs['publish'].resetFields();
                            		this.publishVisible = false;
                                }
                            })
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
			status(row, column) {
				return row.status === 0 ? '审核中' : row.status === 1 ? '不上热门' : '未通过';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			//获取数据列表
			getData(){
				this.listLoading = true;
				let para = {
					type: getLastUrl(window.location.href,'/'),
					pageNum: this.page,
					pageSize: this.pageSize,
					status: this.filters.status,
					content: this.filters.content,
					beginTime: this.filters.date[0],
					endTime: this.filters.date[1],
					isTop:2,
					isAdminPublish: getLastUrl(window.location.href,'/')==0?0:'',
				};
				this.publish.type = para.type;
				console.log("11111111111111111");
				console.log(para.type);
				console.log("22222222222222222");
				this.$http.post('mcircle/all', this.qs.stringify(para)).then(data => {
					if(this.publish.type > 0){
						this.mWdth = 150
					}else{
						this.mWdth = 364
					}

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
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.editForm.circleIds = row.id;
				this.editForm.adminId = sessionStorage.getItem('id');
			},
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.listLoading = true;
							this.$http.post('mcircle/update', this.qs.stringify(this.editForm)).then(data => {
								
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
			editTop(para){
				this.listLoading = true;
				this.$http.post('mcicle/top', this.qs.stringify(para)).then(data => {
					
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
			},
			//置顶
			top(index, row) {
				this.$confirm('确认置顶吗?', '提示', {}).then(() => {
					let para = { circleIds: row.id,top: 1};
					this.editTop(para);
				}).catch(() => {

				});
			},
			//取消置顶
			down(index, row) {
				this.$confirm('确认取消置顶吗?', '提示', {}).then(() => {
					let para = { circleIds: row.id,top: 0};
					this.editTop(para);
				}).catch(() => {

				});
			},
			//设为精彩
			wonderful(id, type, statu) {
				this.$confirm('确认执行吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mcircle/wonderful', this.qs.stringify({circleIds: id,type: type, status: statu, adminId: sessionStorage.getItem('id')})).then(data => {
						
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
			//推送
			push(id) {
				this.$confirm('确认推送该内容吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mcircle/push', this.qs.stringify({id: id})).then(data => {
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
						}
						this.listLoading = false;
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
					this.$http.post('mcircle/remove', this.qs.stringify({circleIds: id, adminId: sessionStorage.getItem('id')})).then(data => {
						
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
			batchRemove() {
				var ids = this.sels.map(item => item.id).toString();
				this.handleDel(ids);
			},
			//详情/评论/回答
			details(id, href) {
				this.$router.push({
					path: '/' + href,
					query: {
						id: id
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
	video{
		width: 100%;
	}
	.cell img{
		max-width: 100%;
	}
	.top{
        margin-top: 30px;
    }
    .foot{
        text-align: center;
        padding-top: 60px;
    }
</style>