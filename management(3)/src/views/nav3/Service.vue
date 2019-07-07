<template>
  <section>
    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleEdit()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="headIcon" label="头像">
				<template scope="scope">
					<img class="headIcon" :src="scope.row.headIcon" />
				</template>
			</el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" min-width="120">
				<template scope="scope">
					<el-button size="small" @click="details(scope.row)">查看</el-button>
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
		<el-dialog title="编辑" :visible.sync="addFormVisible" :close-on-click-modal="false" width="500px">
			<el-form :model="addForm" label-width="80px" ref="addForm">
        <el-form-item label="账号" prop="account" :rules="[{ required: true, message: '请填写账号', trigger: 'blur' }]">
					<el-input v-model="addForm.account" type="number" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请填写密码', trigger: 'blur' }]">
					<el-input v-model="addForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname" :rules="[{ required: true, message: '请填写昵称', trigger: 'blur' }]">
					<el-input v-model="addForm.nickname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户头像" prop="headIcon" :rules="[{ required: true, message: '请选择用户头像', trigger: 'blur' }]">
					<el-upload class="avatar-uploader head-icon" :http-request="Upload" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png">
						<img v-if="addForm.headIcon" :src="addForm.headIcon" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
  import { client } from '../../common/js/alioss'

  export default {
    data () {
      return {
        list: [],
        total: 0,
        page: 1,
        pageSize: 10,
        listLoading: false,
        addFormVisible: false,
        addLoading: false,
        
        addForm: {
          id: 0,
          nickname: '',
          account: '',
          headIcon: '',
          password: ''
        }
      }
    },
    methods:{
      handleCurrentChange(val) {
        this.page = val;
        this.getData();
      },
      //获取列表
      getData:function (){
        this.listLoading = true;
        let para = {
          pageNum: this.page,
          pageSize: this.pageSize
        };
          
        this.$http.post('custom/service/list', this.qs.stringify(para)).then(data => {
          
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
      beforeAvatarUpload(file) {
				const isPNG = file.type === 'image/png'||file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isPNG) {
				this.$message.error('上传图片只能是 PNG/JPG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isPNG && isLt2M;
			},
			Upload(file) {
				var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
				client().put(fileName, file.file).then(result => {
					this.addForm.headIcon = result.url;
				}).catch(function (err) {
          console.log(err);
	 			});
      },
      //显示编辑界面
      handleEdit(row) {
        this.addFormVisible = true;
        if(row !== undefined){
					this.addForm = Object.assign({}, row);
				}else{
          this.addForm = {
            nickname: '',
            account: '',
            headIcon: '',
            password: ''
          };
        }
        
      },
      //编辑
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              
              let url = '';
							if(this.addForm.id !== undefined){
								url = 'custom/service/update'
							}else{
								url = 'custom/service/add'
							}

							this.$http.post(url, this.qs.stringify(this.addForm)).then(data => {
                
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
                  this.$refs['addForm'].resetFields();
                  this.addFormVisible = false;
                  this.getData();
                }
              });
            });
          }
        });
      },
      //删除
			handleDel: function (index, row) {
				this.$confirm('确认删除吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					this.$http.post('custom/service/delete', this.qs.stringify(para)).then(data => {
						
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
			details(row){
        sessionStorage.setItem('hx', JSON.stringify(row));
				this.$router.push({
					path: '/serviceM',
					query: {
						id: row.hxId
					}
				})
			}
    },
    created() {
      this.getData();
    }
  }
</script>
<style scoped>
  .headIcon{
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
</style>
