<template>
	<section v-loading="listLoading">
		<el-row>
            <h3>{{data.title}}</h3>
        </el-row>
        <el-row>
            <el-col :span="4">类型：
                {{data.type === 0 ? '动态' : data.type === 1 ? '文章' : data.type === 2 ? '求助' : data.type === 3 ? '讨论' : data.type === 4 ? '问答' : data.type === 5 ? '视频' : data.type === 6 ? '回答' :'未知'}}
            </el-col>
            <el-col :span="4">状态：
                {{data.status === 0 ? '审核中' : data.status === 1 ? '审核通过' : data.status === -1 ? '未通过' :'未知'}}
            </el-col>
            <el-col :span="4">昵称: {{data.nickname}}</el-col>
            <el-col :span="4">
                <el-col :span="6">头像:</el-col>
                <el-col :span="10">
                    <img :src="data.headIcon" style="width:45px;height:45px;border-radius:50%;vertical-align:middle;" />
                </el-col>
            </el-col>
            <el-col :span="6">时间: {{data.createTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="20" v-html="data.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></el-col>
            <el-col class="photo" v-if="data.photo&&data.type!==1&&data.type!==5&&(data.url==''||data.url==null)" style="margin-top:20px;">
                <el-row>
                    <el-col :span="8" v-for="item in data.photo.split(',')" :key="item.index"><img :src="item" /></el-col>
                </el-row>
            </el-col>
        </el-row>
		<el-row v-if="data.type === 5||(data.type===0&&data.url!=''&&data.url!=null)" style="margin-top:20px;">
			<video :src="data.url" :poster="data.photo" controls></video>
		</el-row>
        <el-row style="margin-top:30px;">
            <el-col :span="2" v-if="data.areaName">{{data.areaName}}</el-col>
            <el-col :span="2" v-if="data.top">已置顶</el-col>
            <el-col :span="2" v-if="data.wonderful">精彩</el-col>
            <el-col :span="4">点赞数: {{data.likeNum}}</el-col>
            <el-col :span="4">评论数: {{data.commentNum}}</el-col>
            <el-col :span="4">浏览数: {{data.viewNum}}</el-col>
        </el-row>
        <el-row style="margin:30px 0 40px 0;" v-if="data.status === 0">
            <el-col :span="6" :offset="4">
                <el-button type="success" size="small" @click="adopt()">上热门</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="danger" size="small" @click="handleEdit()">忽略</el-button>
            </el-col>
        </el-row>

        <!--编辑界面-->
		<!-- <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="原因" prop="reason" :rules="[{ required: true, message: '请填写原因', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.reason" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog> -->
	</section>
</template>

<script>
	import util from '../../common/js/util'
	
	export default {
		data() {
			return {
                listLoading: false,
                data:{
                    areaName: "",
                    commentNum: '',
                    content: "",
                    createTime: "",
                    duration: "",
                    forwardNum: "",
                    headIcon: "",
                    id: "",
                    likeNum: "",
                    nickname: "",
                    originalId: "",
                    photo: "",
                    status: "",
                    title: "",
                    top: "",
                    type: "",
                    url: "",
                    userId: "",
                    viewNum: "",
                    wonderful: ""
                },
                editFormVisible: false,
				sels: [],//列表选中列
				editLoading: false,
				
				editForm: {
					reason: ''
				}
			}
		},
		methods: {
			//获取数据
			getData:function (){
				this.listLoading = true;
				this.$http.post('mcircle/info', this.qs.stringify({id: this.$route.query.id})).then(data => {
					
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
            examine(para){
				this.listLoading = true;
				this.$http.post('mcircle/update', this.qs.stringify(para)).then(data => {
					
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
					    this.$router.go(-1);//回退到上一页
					}
				})
			},
            //通过
			adopt() {
				//alert("11111111111111");
				//this.$router.go(-1);//回退到上一页
				this.$confirm('确认通过该记录吗?', '提示', {}).then(() => {
					let para = { circleIds: this.data.id, status: 1,isTop:1,adminId: sessionStorage.getItem('id')};
					this.examine(para);
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				const para = { circleIds: this.data.id, status: -1,isTop:2,reason: '', adminId: sessionStorage.getItem('id')};	
				this.examine(para);

				//alert("111111111");
				//alert(row);
				//alert(row.id);
				//console.log(row);
				//console.log(row.id);
				//return false;

				// this.editFormVisible = true;
				//this.sels = row.id;
			},
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							let para = { circleIds: this.data.id, status: -1,isTop:2,reason: this.editForm.reason, adminId: sessionStorage.getItem('id')};
							console.log("11111111111111111");
					        console.log(para);
					        console.log("11111111111111111");
							this.examine(para);
							this.$refs['editForm'].resetFields();
                            this.editFormVisible = false;
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

<style scoped>
	.head-icon{
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
    .photo img{
        max-width: 80%;
    }
	video{
		max-width: 300px;
	}
</style>