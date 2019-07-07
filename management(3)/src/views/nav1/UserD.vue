<template>
	<section v-loading="listLoading">
		<el-row>
            <h3>{{data.nickname}}</h3>
        </el-row>
        <el-row>
            <el-col :span="4">ID:</el-col>
            <el-col :span="6">{{data.id}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">家乡号:</el-col>
            <el-col :span="6">{{data.no}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">头像:</el-col>
            <el-col :span="6">
                <img :src="data.headIcon" style="width:60px;height:60px;border-radius:50%;vertical-align:middle;" />
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="4">生日:</el-col>
            <el-col :span="6">{{data.birthday}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">性别:</el-col>
            <el-col :span="6">{{data.sex}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">手机号:</el-col>
            <el-col :span="6">{{data.phone}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">家乡:</el-col>
            <el-col :span="6">{{data.name}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">所在城市:</el-col>
            <el-col :span="6">{{data.city}}</el-col>
        </el-row>
        <el-row v-if="data.wxNickname">
            <el-col :span="4">微信昵称:</el-col>
            <el-col :span="6">{{data.qqNickname}}</el-col>
        </el-row>
        <el-row v-if="data.qqNickname">
            <el-col :span="4">QQ昵称:</el-col>
            <el-col :span="6">{{data.qqNickname}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">注册时间:</el-col>
            <el-col :span="6">{{data.createTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">感情状况:</el-col>
            <el-col :span="6">{{data.emotion}}</el-col>
        </el-row>
        <!-- <el-row v-if="data.voiceIntro">
            <el-col :span="4">语音介绍:</el-col>
            <el-col :span="6">
                <audio :src="data.voiceIntro" controls="controls">浏览器不支持语音，换个浏览器试试</audio>
            </el-col>
        </el-row> -->
        <el-row>
            <el-col :span="4">个人标签:</el-col>
            <el-col :span="6">{{data.tag}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">个性签名:</el-col>
            <el-col :span="6">{{data.sign}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">vip状态:</el-col>
            <el-col :span="6">{{data.vipStatus === 0 ? '普通用户' :'vip用户'}}</el-col>
        </el-row>
        <el-row v-if="data.vipStatus">
            <el-col :span="4">vip到期时间:</el-col>
            <el-col :span="6">{{data.vipTime}}</el-col>
        </el-row>
        <el-row v-if="data.silent">
            <el-col :span="4">禁言:</el-col>
            <el-col :span="6">已禁言</el-col>
        </el-row>
        <el-row v-if="data.silent">
            <el-col :span="4">禁言截止时间:</el-col>
            <el-col :span="6">{{data.silentTime}}</el-col>
        </el-row>
        <el-row v-if="data.ban">
            <el-col :span="4">封号:</el-col>
            <el-col :span="6">已封号</el-col>
        </el-row>
        <el-row v-if="data.ban">
            <el-col :span="4">封号截止时间:</el-col>
            <el-col :span="6">{{data.banTime}}</el-col>
        </el-row>
        <el-row v-if="data.photo">
            <el-col :span="4">照片:</el-col>
            <el-col :span="18" class="photo">
                <el-row>
                    <el-col :span="4" v-for="item in data.photo.split(',')" :key="item.index">
                        <img :src="item" />
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row style="margin-top:30px">
            <el-col :span="4">操作:</el-col>
            <el-col :span="6">
                <el-button size="small" type="primary" plain @click="handleAdd">发送通知</el-button>
            </el-col>
        </el-row>

        <!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="通知内容" prop="content" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请填写内容" v-model="addForm.content" auto-complete="off"></el-input>
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
	export default {
		data() {
			return {
                listLoading: false,
                data:{
                    ban: 0,
                    banTime: '',
                    birthday: '',
                    city: '',
                    code: '',
                    createTime: '',
                    emotion: '',
                    headIcon: '',
                    id: '',
                    informCare: '',
                    informComment: '',
                    informCommentLike: '',
                    informDialog: '',
                    informForward: '',
                    informFriend: '',
                    informLike: '',
                    informRecommend: '',
                    informStranger: '',
                    informUpdate: '',
                    informVibrate: '',
                    informVideo: '',
                    informView: '',
                    informVoice: '',
                    match: '',
                    name: '',
                    nickname: '',
                    no: '',
                    parentId: '',
                    phone: '',
                    photo: '',
                    qq: '',
                    qqNickname: '',
                    sex: '',
                    sign: '',
                    silent: '',
                    silentTime: '',
                    tag: '',
                    vipStatus: '',
                    vipTime: '',
                    voiceIntro: '',
                    voiceLength: '',
                    wx: '',
                    wxNickname: ''
                },
				addFormVisible: false,
				addLoading: false,
				
				addForm: {
                    ids: 0,
					content: ''
				}
			}
		},
		methods: {
			//获取数据
			getData:function (){
				this.listLoading = true;
				this.$http.post('muser/detail', this.qs.stringify({id:this.$route.query.id})).then(data => {
					
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
                        this.data = Object.assign({}, res.data);
						this.listLoading = false;
					}
				});
            },
            //显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    ids: this.$route.query.id,
					content: ''
				};
			},
			//通知
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							this.$http.post('mplatform/add/user', this.qs.stringify(para)).then(data => {
								
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
            max-width: 100%;
        }
    }
</style>