<template>
	<section v-loading="listLoading">
		<el-row>
			<el-col :span="20">
				<!--加盟-->
				<el-card class="box-card" style="margin-top:30px">
					<div slot="header" class="clearfix">
						<span>加盟中心信息</span>
						<el-button @click="editJoin()" style="float: right; padding: 3px 0" type="text">修改</el-button>
					</div>
					<div class="text item">
						<el-row>
							<el-col :span="3">电话:</el-col>
							<el-col :span="20">{{join.phone}}</el-col>
						</el-row>
						<el-row>
							<el-col :span="3">加盟信息:</el-col>
							<el-col :span="20" v-html="join.info.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></el-col>
						</el-row>
					</div>
				</el-card>
				<!--推广-->
				<el-card class="box-card" style="margin-top:40px">
					<div slot="header" class="clearfix">
						<span>推广规则</span>
						<el-button @click="editExt()" style="float: right; padding: 3px 0" type="text">修改</el-button>
					</div>
					<div class="text item">
						<el-row>
							<el-col :span="3">推广规则:</el-col>
							<el-col :span="20" v-html="promotion.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></el-col>
						</el-row>
					</div>
				</el-card>
			</el-col>
		</el-row>
        
        <!--加盟编辑界面-->
		<el-dialog title="加盟信息" :visible.sync="joinFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="joinForm" label-width="80px" ref="joinForm">
                <el-form-item label="联系电话" prop="phone" :rules="[{ required: true, message: '请填写联系电话', trigger: 'blur' }]">
                    <el-input v-model="joinForm.phone"></el-input>
                </el-form-item>
				<el-form-item label="加盟信息" prop="info" :rules="[{ required: true, message: '请填写加盟信息', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="joinForm.info" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="joinFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="joinSubmit" :loading="joinLoading">提交</el-button>
			</div>
		</el-dialog>

        <!--推广规则界面-->
		<el-dialog title="推广规则" :visible.sync="extFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="extForm" label-width="80px" ref="extForm">
				<el-form-item label="推广规则" prop="content" :rules="[{ required: true, message: '请填写推广规则', trigger: 'blur' }]">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="extForm.content" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="extFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="extSubmit" :loading="extLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				join: {
                    id: '',
                    info: '',
                    phone: ''
                },
                promotion:{
                    id: '',
                    content: ''
                },
				listLoading: false,
				joinFormVisible: false,
				joinLoading: false,
				joinForm: {
					id: '',
                    info: '',
                    phone: ''
                },
                extFormVisible: false,
				extLoading: false,
				extForm: {
                    id: '',
					content: ''
				}
			}
		},
		methods: {
			getData:function (){
				this.listLoading = true;
				this.$http.post('mjoin/get').then(data => {
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
						this.join = Object.assign({}, res.data);
					}
                });

                this.$http.post('mpromotion/get').then(data => {
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
						this.promotion = Object.assign({}, res.data);
						this.listLoading = false;
					}
				});
            },
            //显示加盟编辑界面
			editJoin() {
				this.joinFormVisible = true;
				this.joinForm = Object.assign({}, this.join);
			},
			//加盟
			joinSubmit: function () {
				this.$refs.joinForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.joinLoading = true;
							this.$http.post('mjoin/update', this.qs.stringify(this.joinForm)).then(data => {
								
								let  res = data.data;
								if (res.status !== 0) {
									this.$message({
										message: res.msg,
										type: 'error'
									});
								} else {
									this.joinLoading = false;
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['joinForm'].resetFields();
									this.joinFormVisible = false;
									this.getData();
								}
							});
						});
					}
				});
            },
            //显示推广编辑界面
			editExt() {
				this.extFormVisible = true;
				this.extForm = Object.assign({}, this.promotion);
			},
			//推广
			extSubmit: function () {
				this.$refs.extForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.extLoading = true;
							this.$http.post('mpromotion/update', this.qs.stringify(this.extForm)).then(data => {
								
								let  res = data.data;
								if (res.status !== 0) {
									this.$message({
										message: res.msg,
										type: 'error'
									});
								} else {
									this.extLoading = false;
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['extForm'].resetFields();
									this.extFormVisible = false;
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

<style scoped>
    .el-row+div.el-row{
        margin-top: 10px;
    }
</style>