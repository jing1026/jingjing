<template>
	<section v-loading="listLoading">
		<el-row style="margin-top:30px">
            <el-col :span="4">举报者昵称:</el-col>
            <el-col :span="10">{{data.nickname}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">举报者头像:</el-col>
            <el-col :span="10">
                <img :src="data.headIcon" style="width:60px;height:60px;border-radius:50%;vertical-align:middle;" />
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="4">举报内容:</el-col>
            <el-col :span="10">{{data.content}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">举报时间:</el-col>
            <el-col :span="10">{{data.createTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">类型:</el-col>
            <el-col :span="10">{{data.type === 0 ? '动态' : data.type === 1 ? '文章' : data.type === 2 ? '求助' : data.type === 3 ? '讨论' : data.type === 4 ? '问答' : data.type === 5 ? '视频' : data.type === 6 ? '回答' : data.type === 7 ? '用户' : '评论'}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">状态:</el-col>
            <el-col :span="10">{{data.status ? '已处理' : '未处理'}}</el-col>
        </el-row>
        <el-row v-if="data.status">
            <el-col :span="4">处理结果:</el-col>
            <el-col :span="10">{{data.result}}</el-col>
        </el-row>
        <el-row>
            <h4>被举报内容</h4>
        </el-row>
        <el-row v-if="data.type === 7">
            <el-row>
                <el-col :span="4">用户ID:</el-col>
                <el-col :span="10">{{data.info.id}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">家乡号:</el-col>
                <el-col :span="10">{{data.info.no}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">用户昵称:</el-col>
                <el-col :span="10">{{data.info.nickname}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">用户头像:</el-col>
                <el-col :span="10">
                    <img :src="data.info.headIcon" style="width:60px;height:60px;border-radius:50%;vertical-align:middle;" />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">生日:</el-col>
                <el-col :span="10">{{data.info.birthday}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">性别:</el-col>
                <el-col :span="10">{{data.info.sex}}</el-col>
            </el-row>
            <el-row v-if="data.info.photo">
                <el-col :span="4">照片:</el-col>
                <el-col :span="18" class="photo">
                    <el-row>
                        <el-col :span="6" v-for="item in data.info.photo.split(',')" :key="item.index">
                            <img :src="item" />
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!-- <el-row style="margin:30px 0 40px 0;" v-if="data.status === 0">
                <el-col :span="6" :offset="4">
                    <el-button type="primary" size="small" @click="handleEdit()">操作</el-button>
                </el-col>
            </el-row> -->
        </el-row>

        <el-row v-else-if="data.type === 6 || data.type === 8">
            <el-row>
                <el-col :span="4">用户ID:</el-col>
                <el-col :span="10">{{data.info.userId}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">用户昵称:</el-col>
                <el-col :span="10">{{data.info.nickname}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">用户头像:</el-col>
                <el-col :span="10">
                    <img :src="data.info.headIcon" style="width:60px;height:60px;border-radius:50%;vertical-align:middle;" />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">评论内容:</el-col>
                <el-col :span="10">{{data.info.content.content}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">评论时间:</el-col>
                <el-col :span="10">{{data.info.createTime}}</el-col>
            </el-row>
            <!-- <el-row style="margin:30px 0 40px 0;" v-if="data.status === 0">
                <el-col :span="6" :offset="4">
                    <el-button type="primary" size="small" @click="handleDel()">删除评论</el-button>
                </el-col>
            </el-row> -->
        </el-row>

        <el-row v-else>
            <el-row>
                <el-col :span="4">ID:</el-col>
                <el-col :span="10">{{data.info.id}}</el-col>
            </el-row>
            <el-row v-if="data.info.title">
                <el-col :span="4">标题:</el-col>
                <el-col :span="10">{{data.info.title}}</el-col>
            </el-row>
            <el-row v-if="data.type === 5">
                <el-col :span="4">视频:</el-col>
                <el-col :span="10">
                    <video :src="data.info.url" :poster="data.info.photo" controls></video>
                </el-col>
            </el-row>
            <el-row v-if="data.info.photo">
                <el-col :span="4">图片:</el-col>
                <el-col :span="18" class="photo">
                    <el-row>
                        <el-col :span="6" v-for="item in data.info.photo.split(',')" :key="item.index">
                            <img :src="item" />
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">内容:</el-col>
                <el-col :span="18" v-if="data.type !== 1" v-html="data.info.content"></el-col>
                <el-col :span="18" v-else v-html="data.info.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></el-col>
            </el-row>
            <el-row>
                <el-col :span="4">发布时间:</el-col>
                <el-col :span="10">{{data.info.createTime}}</el-col>
            </el-row>

            <!-- <el-row style="margin:30px 0 40px 0;" v-if="data.status === 0">
                <el-col :span="6" :offset="4">
                    <el-button type="primary" size="small" @click="del()">删除</el-button>
                </el-col>
            </el-row> -->
        </el-row>

        <!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="类型">
					<el-radio-group v-model="editForm.type">
						<el-radio :label="1">禁言</el-radio>
						<el-radio :label="0">封号</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="截止时间" prop="endTime" :rules="[{ required: true, message: '请选择时间', trigger: 'blur' }]">
					<el-date-picker type="datetime" placeholder="选择日期时间" v-model="editForm.endTime" :picker-options="pickerOptions1" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"></el-date-picker>
				</el-form-item>
				<el-form-item label="原因" prop="reason" :rules="[{ required: true, message: '请填写原因', trigger: 'blur' }]">
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
	export default {
		data() {
			return {
                listLoading: false,
                data:{
                    content: '',
                    createTime: '',
                    headIcon: '',
                    id: '',
                    info: {},
                    nickname: '',
                    otherId: '',
                    result: '',
                    status: '',
                    type: '',
                    userId: ''
                },
                pickerOptions1: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e6;
					}
				},
				editFormVisible: false,
				editLoading: false,
				
				editForm: {
					userIds: 0,
					type: 1,
					endTime: '',
					status: 1,
					reason: ''
				}
			}
		},
		methods: {
			//获取数据
			getData:function (){
				this.listLoading = true;
				this.$http.post('mreport/info', this.qs.stringify({id:this.$route.query.id})).then(data => {
					
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
                        this. data = Object.assign({}, res.data);
						this.listLoading = false;
					}
				});
            },
            //显示编辑界面
			handleEdit() {
				this.editFormVisible = true;
				this.editForm.userIds = this.data.info.id;
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							this.$http.post('muser/deal', this.qs.stringify(this.editForm)).then(data => {
								console.log(data.data);
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
            },
            //删除评论
			handleDel() {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mcircle/comment/delete', this.qs.stringify({commentIds: this.data.info.id})).then(data => {
						
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
            //删除动态
			del() {
				this.$confirm('确认删除吗?', '提示', {}).then(() => {
					this.listLoading = true;
					this.$http.post('mcircle/remove', this.qs.stringify({circleIds: this.data.info.id})).then(data => {
						
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

<style scoped lang="scss">
    .el-row {
        margin-bottom: 10px;
        &:last-child {
        margin-bottom: 0;
        }
        img{
            max-width: 80%;
        }
    }
</style>