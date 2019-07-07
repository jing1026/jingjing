<template>
    <section v-loading="listLoading">
        <el-form :model="editForm" label-width="120px" ref="editForm">
            <el-row class="top" :span="20">
                <el-col :span="18">
                    <el-form-item label="用户ID" prop="userId" :rules="[{ required: true, message: '请填写用户ID', trigger: 'blur' }]">
                        <el-input v-model="editForm.userId" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请填写标题', trigger: 'blur' }]">
                        <el-input v-model="editForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="商品简介" prop="introduce" :rules="[{ required: true, message: '请填写简介', trigger: 'blur' }]">
                        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="editForm.introduce" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone" :rules="[{ required: true, message: '请填写联系电话', trigger: 'blur' }]">
                        <el-input v-model="editForm.phone" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '请填写价格', trigger: 'blur' }]">
                        <el-input v-model="editForm.price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" prop="parentType" :rules="[{ required: true, message: '请选择分类', trigger: 'blur' }]">
                        <el-select v-model="editForm.parentType">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易方式" prop="tradeMethod">
                        <el-radio-group v-model="editForm.tradeMethod">
                            <el-radio :label="'自提'">自提</el-radio>
                            <el-radio :label="'同城面交'">同城面交</el-radio>
                            <el-radio :label="'邮寄'">邮寄</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="轮播图" prop="photo" :rules="[{ required: true, message: '请选择图片', trigger: 'blur' }]">
                        <el-upload action="" :http-request="(res)=>{return Upload(res, 'photo', 1)}" list-type="picture-card" :multiple="false" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" accept="image/*" :limit="9" :on-exceed="handleExceed" :file-list="photo">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="实拍图" prop="realPhoto" :rules="[{ required: true, message: '请选择图片', trigger: 'blur' }]">
                        <el-upload action="" :http-request="(res)=>{return Upload(res, 'realPhoto', 1)}" list-type="picture-card" :multiple="false" :on-preview="handlePictureCardPreview" :on-remove="(res, list)=>{return handleRemove(res, list, 'realPhoto')}" :before-upload="beforeAvatarUpload" accept="image/*" :limit="9" :on-exceed="handleExceed" :file-list="realPhoto">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row class="foot">
            <el-button type="primary" @click="submit">确认发布</el-button>
        </el-row>
        
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

    export default {
        data(){
            return{
                listLoading: false,
                photo: [],
                realPhoto: [],
                options: [{
                    value: '0',
                    label: '手机'
                    }, {
                    value: '1',
                    label: '汽车'
                }, {
                    value: '2',
                    label: '数码'
                }, {
                    value: '3',
                    label: '其他'
                }],
                editForm: {
                    parentType: '',
                    userId:'',
                    title:'',
                    price: '',
                    photo: [],
                    introduce: '',
                    tradeMethod: '自提',
                    realPhoto: [],
                    status: '1',
                    phone: '',
                    wxPay:"wxPay",
                    aliPay:"aliPay",
                },
                dialogImageUrl: '',
                dialogVisible: false
            }
        },
        methods:{
            beforeAvatarUpload(file) {
                this.listLoading = true;
            },
			Upload(file, index, type) {
                var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
				client().put(fileName, file.file).then(result => {
                    if(type === 0){
                        this.editForm[index] = result.url;
                    }else{
                        this[index].push(result);
                        this.editForm[index].push(result.url);
                    }
                    this.listLoading = false;
				}).catch(function (err) {
                    console.log(err)
	 			});
            },
            handleRemove(file, fileList, index) {
                this.editForm[index].remove(file.url);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleExceed(files, fileList){
                this.$message.warning('当前限制选择 9 个文件');
            },
            submit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.listLoading = true;

                            if(Array.isArray(this.editForm.photo)&&this.editForm.photo.length!=0){
                                this.editForm.photo = this.editForm.photo.join(",");
                                 console.log("photophotophotophotophoto"); 
                                 console.log(typeof this.editForm.photo); 
                            }

                            if(Array.isArray(this.editForm.realPhoto)&&this.editForm.realPhoto.length!=0){
                                this.editForm.realPhoto = this.editForm.realPhoto.join(",");
                                 console.log("realPhotorealPhotorealPhotorealPhoto"); 
                                 console.log(typeof this.editForm.realPhoto); 
                            }
                            if(this.editForm.phone){
                                  this.editForm.phone=parseInt(this.editForm.phone);
                                  console.log("phonephonephonephonephone"); 
                                  console.log(typeof this.editForm.phone); 
                            }
                             console.log("11111111111111111111"); 
                             console.log(this.editForm); 
                             //console.log(typeof this.qs.stringify(this.editForm).phone); 
                             console.log(typeof this.qs.stringify(this.editForm).realPhoto); 
                             //console.log(typeof this.editForm.phone); 
                             console.log(typeof this.editForm.realPhoto); 
                             console.log(this.qs.stringify(this.editForm)); 
                            this.$http.post('mused/add', this.qs.stringify(this.editForm)).then(data => {
                                
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
                                    this.fileList = [];
                                    this.$refs['editForm'].resetFields();
                                    this.photo = [];
                                    this.realPhoto = [];
                                }
                                
                                this.listLoading = false;
                            })
						});
					}
				});
			}
        }
    }
</script>

<style scoped>
    .top{
        margin-top: 30px;
    }
    .foot{
        text-align: center;
        padding-top: 60px;
    }
</style>
