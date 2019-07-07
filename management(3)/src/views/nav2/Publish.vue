<template>
    <section v-loading="listLoading">
        <el-form class="top" :model="editForm" label-width="85px" ref="editForm">
            <el-form-item label="用户ID" prop="userId" :rules="[{ required: true, message: '请填写用户ID', trigger: 'blur' }]">
                <el-input v-model="editForm.userId" type="number"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请填写标题', trigger: 'blur' }]">
                <el-input v-model="editForm.title"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]">
                <quill-editor id="editor" v-model="editForm.content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"></quill-editor>
                <el-upload class="avatar-uploader" :http-request="Upload" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="image/*"></el-upload>
            </el-form-item>
            <el-form-item label="视频" prop="url" :rules="[{ required: true, message: '请选择视频', trigger: 'blur' }]">
                <el-upload class="avatar-uploader photo" :http-request="Upload" :multiple="false" :show-file-list="false" action="" :before-upload="beforeAvatarUpload" accept="video/*">
                <video id="myVideo" v-if="publish.url" :src="publish.url" :poster="publish.photo" controls></video>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
        </el-form>
        <el-row class="foot">
            <el-button type="primary" @click="submit">确认发布</el-button>
        </el-row>
    </section>
</template>

<script>
    import { client } from '../../common/js/alioss'

    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],// toggled buttons
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }], // outdent/indent
        [{ 'direction': 'rtl' }], // text direction
        [{ 'align': [] }],
        ['image']
    ]

    export default {
        data(){
            return{
                listLoading: false,
                editForm: {
                    userId:'',
                    kind: 1,
                    title: '',
                    content:'',
                    type: 1,
                    photo:[]
                },
                editorOption: {
                    placeholder: '',
                    theme: 'snow',  // or 'bubble'
                    modules: {
                        toolbar: {
                            container: toolbarOptions,  // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                    // 触发input框选择图片文件
                                        document.querySelector('.avatar-uploader input').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                },

                photo: [],
                dialogImageUrl: '',
                dialogVisible: false
            }
        },
        methods:{
            beforeAvatarUpload(file) {
                this.listLoading = true;
			},
			Upload(file) {
                var fileName = 'webStorage/web_' + file.file.uid+Math.floor(Math.random()*10000) + file.file.name.substr(file.file.name.indexOf("."));
                let quill = this.$refs.myQuillEditor.quill;
				client().put(fileName, file.file).then(result => {
                    let length = quill.getSelection().index;
                    quill.insertEmbed(length, 'image', result.url);
                    quill.setSelection(length + 1);
                    this.listLoading = false;
				}).catch(function (err) {
	       		
	 			});
            },
            //失去焦点事件
            onEditorBlur(editor){

            },
            //获得焦点事件
            onEditorFocus(editor){

            },
            //编辑器文本发生变化
            onEditorChange({editor,html,text}){
                this.editForm.photo=[]
            },
            submit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
                        if(Array.isArray(this.editForm.photo)){
                            let imgs = editor.querySelectorAll("img");

                            for(var i=0;i<imgs.length;i++){
                                if(i<3){
                                    this.editForm.photo.push(imgs[i].src)
                                }
                            }
                            this.editForm.photo = this.editForm.photo.join(",");
                        }
                    
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.publish.duration = Math.round(document.getElementById("myVideo").duration);
							this.listLoading = true;
                            this.$http.post('mcircle/add', this.qs.stringify(this.editForm)).then(data => {
                                
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
                                    this.$refs['editForm'].resetFields();
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
    .quill-editor {
        height: 450px;
    }
</style>
