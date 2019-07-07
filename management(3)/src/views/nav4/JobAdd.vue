<template>
    <section v-loading="listLoading">
        <el-form :model="editForm" label-width="120px" ref="editForm">
            <el-row class="top" :span="20">
                <el-col :span="10">
                    <el-form-item label="用户ID" prop="userId" :rules="[{ required: true, message: '请填写用户ID', trigger: 'blur' }]">
                        <el-input v-model="editForm.userId" type="number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24"></el-col>
                <el-col :span="10">
                    <el-form-item label="职位名称" prop="work" :rules="[{ required: true, message: '请填写职位名称', trigger: 'blur' }]">
                        <el-input v-model="editForm.work"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="工作地点" prop="place" :rules="[{required: true, message: '请填写工作地点', trigger: 'blur' }]">
                        <el-input v-model="editForm.place"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="手机号" prop="phone" :rules="[{required: true,  message: '请填写手机号', trigger: 'blur' }]">
                        <el-input v-model="editForm.phone" type="number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="薪资" prop="salary" :rules="[{ required: true, message: '请填写薪资', trigger: 'blur' }]">
                        <el-input v-model="editForm.salary"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="职业要求" prop="require" :rules="[{required: true,  message: '请填写职业要求', trigger: 'blur' }]">
                        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="editForm.require" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="待遇福利" prop="welfare" :rules="[{  message: '请填写待遇福利', trigger: 'blur' }]">
                        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="editForm.welfare" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="职位描述" prop="introduce" :rules="[{  message: '请填写职位描述', trigger: 'blur' }]">
                        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="editForm.introduce" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24"></el-col>
                <el-col :span="10">
                    <el-form-item label="公司名称" prop="companyName" :rules="[{  message: '请填写公司名称', trigger: 'blur' }]">
                        <el-input v-model="editForm.companyName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="公司规模" prop="companyScale" :rules="[{ message: '请填写公司规模', trigger: 'blur' }]">
                        <el-input v-model="editForm.companyScale" type="number">
                            <template slot="append">/人</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="公司性质" prop="companyProperty" :rules="[{  message: '请选择公司性质', trigger: 'blur' }]">
					    <el-select v-model="editForm.companyProperty">
						    <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value"></el-option>
					    </el-select>
				    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="公司行业" prop="companyIndustry" :rules="[{  message: '请选择公司行业', trigger: 'blur' }]">
					    <el-select v-model="editForm.companyIndustry">
						    <el-option v-for="item in industryList" :key="item.value" :label="item.value" :value="item.value"></el-option>
					    </el-select>
				    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="公司图片" prop="photo" :rules="[{required: false,  message: '请选择图片', trigger: 'blur' }]">
                <el-upload action="" :http-request="(res)=>{return Upload(res, 'photo', 1)}" list-type="picture-card" :multiple="false" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" accept="image/*" :limit="9" :on-exceed="handleExceed" :file-list="photo">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
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
                options: [{
                    value: '国企'
                }, {
                    value: '私企'
                }],
                industryList: [{
                    value: '互联网/IT/电子/通信'
                }, {
                    value: '广告/传媒/文化/体育'
                }, {
                    value: '金融'
                }, {
                    value: '教育培训'
                }, {
                    value: '制药/医疗'
                }, {
                    value: '交通/物流/贸易/零售'
                }, {
                    value: '专业服务'
                }, {
                    value: '房地产/建筑'
                }, {
                    value: '汽车'
                }, {
                    value: '机械/制造'
                }, {
                    value: '消费品'
                }, {
                    value: '服务员'
                }, {
                    value: '能源/化工/环保'
                }, {
                    value: '政府/非盈利机构/其他'
                }],
                editForm: {
                    userId:'',
                    work:'',
                    place: '',
                    phone: '',
                    require: '',
                    salary: '',
                    welfare: '',
                    introduce: '',
                    companyName: '',
                    companyScale: '',
                    companyProperty: '',
                    companyIndustry: '',
                    photo: []
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

                            if(Array.isArray(this.editForm.photo)&&this.editForm.photo.length>0){
                                this.editForm.photo = this.editForm.photo.join(",");
                            }

                            this.$http.post('mrecruit/add', this.qs.stringify(this.editForm)).then(data => {
                                
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
                                    this.fileList = [];
                                    this.$refs['editForm'].resetFields();
                                    this.photo = [];
                                    this.realPhoto = [];
                                }
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
