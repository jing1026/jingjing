<template>
	<section v-loading="listLoading">
		<el-row style="margin-top:30px">
            <el-col :span="4">用户昵称:</el-col>
            <el-col :span="6">{{data.nickname}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="4">头像:</el-col>
            <el-col :span="6">
                <img :src="data.headIcon" style="width:60px;height:60px;border-radius:50%;vertical-align:middle;" />
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3">商品介绍:</el-col>
            <el-col :span="9" v-html="data.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></el-col>
        </el-row>
        <el-row v-if="data.url">
            <el-col :span="3">视频:</el-col>
            <el-col :span="7">
				<video width="100%" :poster="data.photo" :src="data.url" controls></video>
			</el-col>
        </el-row>
        <el-row v-else>
            <el-col :span="3">图片:</el-col>
            <el-col :span="20">
                <el-row>
                    <el-col :span="6" v-for="item in data.photo.split(',')" :key="item.index">
                        <img :src="item" />
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row style="margin:30px 0 40px 0;" v-if="data.status === 0">
            <el-col :span="6" :offset="4">
                <el-button type="success" size="small" @click="adopt()">通过</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="danger" size="small" @click="handleEdit()">拒绝</el-button>
            </el-col>
        </el-row>

        <!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
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
					nickname: '',
					photo: '',
					url: ''
                },
                editFormVisible: false,
				editLoading: false,
				editForm: {
                    ids: 0,
					reason: ''
				}
			}
		},
		methods: {
			//获取数据
			getData:function (){
				this.listLoading = true;
				this.$http.post('mstore/info/goods/Info', this.qs.stringify({id:this.$route.query.id})).then(data => {
					
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
				this.$http.post('mstore/goods/update', this.qs.stringify(para)).then(data => {
					
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
            //通过
			adopt() {
				this.$confirm('确认通过该记录吗?', '提示', {}).then(() => {
					let para = { ids: this.data.goodsId,status: 1, adminId: sessionStorage.getItem('id')};
					this.examine(para);
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
			},
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							let para = { ids: this.data.goodsId, status: -1,reason: this.editForm.reason, adminId: sessionStorage.getItem('id')};
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

<style scoped lang="scss">
    .el-row {
        margin-bottom: 10px;
        &:last-child {
        margin-bottom: 0;
        }
        img{
            max-width: 60%;
        }
    }
</style>