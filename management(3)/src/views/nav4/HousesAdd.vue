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
                    <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请填写标题', trigger: 'blur' }]">
                        <el-input v-model="editForm.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="房屋地址" prop="place" :rules="[{ required: true, message: '请填写房屋地址', trigger: 'blur' }]">
                        <el-input v-model="editForm.place"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="房型" prop="layout" :rules="[{  message: '请填写房型', trigger: 'blur' }]">
                        <el-input v-model="editForm.layout"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="手机号" prop="phone" :rules="[{  message: '请填写手机号', trigger: 'blur' }]">
                        <el-input v-model="editForm.phone" type="number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="房租" prop="rent" :rules="[{ required: true, message: '请填写房租', trigger: 'blur' }]">
                        <el-input v-model="editForm.rent" type="number">
                            <template slot="append">元/月</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="面积" prop="space" :rules="[{  message: '请填写房屋面积', trigger: 'blur' }]">
                        <el-input v-model="editForm.space" type="number">
                            <template slot="append">m<sup>2</sup></template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="付款方式" prop="deposit" :rules="[{  message: '请填写付款方式', trigger: 'blur' }]">
                        <el-input v-model="editForm.deposit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="朝向" prop="position" :rules="[{  message: '请填写房屋朝向', trigger: 'blur' }]">
                        <el-input v-model="editForm.position"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="楼层" prop="floor" :rules="[{  message: '请填写房屋楼层', trigger: 'blur' }]">
                        <el-input v-model="editForm.floor"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="房屋信息" prop="info" :rules="[{ required: true, message: '请填写待遇福利', trigger: 'blur' }]">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="editForm.info" auto-complete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="房屋信息" prop="info">
                <el-checkbox-group v-model="editForm.info">
                    <el-checkbox label="wifi">wifi</el-checkbox>
                    <el-checkbox label="床">床</el-checkbox>
                    <el-checkbox label="衣柜">衣柜</el-checkbox>
                    <el-checkbox label="沙发">沙发</el-checkbox>
                    <el-checkbox label="洗衣机">洗衣机</el-checkbox>
                    <el-checkbox label="热水器">热水器</el-checkbox>
                    <el-checkbox label="可做饭">可做饭</el-checkbox>
                </el-checkbox-group>
            </el-form-item> -->
            <el-form-item label="图片" prop="photo" :rules="[{required: false,  message: '请选择图片', trigger: 'blur' }]">
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
                editForm: {
                    userId:'',
                    title:'',
                    rent: '',
                    deposit: '',
                    layout: '',
                    space: '',
                    position: '',
                    floor: '',
                    place: '',
                    info: '',
                    phone: '',
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

                            this.$http.post('mrent/add', this.qs.stringify(this.editForm)).then(data => {
                                
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
