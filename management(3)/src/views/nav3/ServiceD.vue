<template>
	<section>
		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID"></el-table-column>
			<el-table-column prop="content" label="内容" :formatter="content"></el-table-column>
			<el-table-column prop="headIcon" label="头像">
				<template scope="scope">
					<img v-if="scope.row.fromId !== editForm.hxId" class="head-icon" :src="info.headIcon" />
				</template>
			</el-table-column>
			<el-table-column prop="nickname" label="发送者">
				<template scope="scope">
					<div v-if="scope.row.fromId !== editForm.hxId">{{info.nickname}}</div>
					<div v-else>客服</div>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="时间" sortable></el-table-column>
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button v-if="scope.row.fromId !== editForm.hxId" type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">回复</el-button>
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
				<el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.content" auto-complete="off"></el-input>
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
                    hxId: 0,
                    conversationId: 0,
					content: ''
                },
				fromId: 0,
				info: {
					nickname: '',
					headIcon: ''
				}
			}
        },
        created(){
			this.info.nickname = this.$route.query.name;
			this.info.headIcon = this.$route.query.headIcon;
            var hx = JSON.parse(sessionStorage.getItem("hx"));
            this.editForm.hxId = hx.hxId;
            this.$imoption.user = hx.hxId;
            this.$imoption.pwd = hx.hxPwd;
            this.$imconn.open(this.$imoption);
            let _this = this;
            this.$imconn.listen({
                onOpened: function (message) {
                    console.log('用户已上线');
                },
                //收到文本消息
                onTextMessage: function ( message ) {
                    console.log(message);
                    _this.getData();
                }
            })
        },
		methods: {
            content(row, column){
                try { 
                    return decodeURIComponent(row.content.replace(/\+/g, '%20'));
                } catch(e) { 
                    return row.content
                }
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
                    conversationId: this.$route.query.id,
                    sortType: 1
				};
				
				this.$http.post('customer/service/msg/list', this.qs.stringify(para)).then(data => {
					
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
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm.conversationId = row.conversationId;
				this.fromId = row.fromId;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            var id = this.$imconn.getUniqueId();// 生成本地消息id
							var msg = new WebIM.message('txt', id);
							let _this = this;// 创建文本消息
							msg.set({
								msg: this.editForm.content,// 消息内容
								to: this.fromId,// 接收消息对象（用户id）
								roomType: false,
								success: function (id, serverMsgId) {
									console.log("消息发送成功");
									
									_this.editLoading = true;
									_this.$http.post('customer/service/msg/send', _this.qs.stringify(_this.editForm)).then(data => {
										
										let  res = data.data;
										if (res.status !== 0) {
											_this.$message({
												message: res.msg,
												type: 'error'
											});
										} else {
											_this.editLoading = false;
											_this.$message({
												message: '提交成功',
												type: 'success'
											});
											_this.$refs['editForm'].resetFields();
											_this.editFormVisible = false;
											_this.getData();
										}
									});

								},
								fail: function(e){
									console.log("消息发送失败");
								}
							});
							msg.body.chatType = 'singleChat';
							this.$imconn.send(msg.body);
						});
					}
				});
			},
			//详情
			details(id) {
				this.$router.push({
					path: '/reportD',
					query: {
						id: id
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
	.head-icon{
        width: 45px;
        height: 45px;
        border-radius: 50%;
    }
</style>