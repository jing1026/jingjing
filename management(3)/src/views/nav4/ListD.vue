<template>
	<section v-loading="listLoading">
		<el-row>
            <h3>{{data.name}}</h3>
        </el-row>
        <el-row>
            <el-col :span="3">店铺地址:</el-col>
            <el-col :span="6">{{data.place}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="3">类型:</el-col>
            <el-col :span="6">{{data.type === 0 ? '女性专区' : data.type === 1 ? '特色小吃' : data.type === 2 ? '餐饮美食' : data.type === 3 ? '服装排版' : data.type === 4 ? '更多电商' :'未知'}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="3">手机号:</el-col>
            <el-col :span="6">{{data.phone}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="3">店铺logo:</el-col>
            <el-col :span="6"><img style="width:60px;height:60px;border-radius:50%;vertical-align:middle;" :src="data.logo" /></el-col>
        </el-row>
        <el-row>
            <el-col :span="3">店铺封面:</el-col>
            <el-col :span="6"><img :src="data.cover" /></el-col>
        </el-row>
        <el-row>
            <el-col :span="3">店铺介绍:</el-col>
            <el-col :span="9" v-html="data.information.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')"></el-col>
        </el-row>
        <el-row>
            <el-col :span="3">分类:</el-col>
            <el-col :span="6">{{data.explicit}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="3">创建时间:</el-col>
            <el-col :span="6">{{data.createTime}}</el-col>
        </el-row>
        <el-table :data="data.goods" stripe highlight-current-row style="width: 100%;">
			<el-table-column prop="id" label="ID" width="55"></el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
			<el-table-column prop="content" label="商品详情"></el-table-column>
			<el-table-column prop="price" label="商品价格"></el-table-column>
			<el-table-column prop="photo" label="商品图" width="160">
                <template scope="scope">
					<el-row v-if="scope.row.url">
						<video :src="scope.row.url" :poster="scope.row.photo" controls></video>
					</el-row>
					<el-row v-else>
						<el-row class="maxH" v-if="scope.row.photo">
							<el-row v-for="item in scope.row.photo.split(',')" :key="item.index">
								<img :src="item" />
							</el-row>
						</el-row>
					</el-row>
				</template>
            </el-table-column>
			<el-table-column prop="status" label="状态" :formatter="status"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
			
		</el-table>

		<!--工具条-->
		<el-row class="toolbar">
			<el-pagination class="fr" layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total">
			</el-pagination>
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
				list: [],
				total: 0,
				page: 1,
				pageSize: 10,
                listLoading: false,
                data:{
                    cover: '',
                    createTime: '',
                    explicit: '',
                    id: '',
                    name: '',
                    phone: '',
                    place: '',
                    status: '',
                    type: '',
                    userId: '',
                    logo: '',
                    information: ''
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
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			status: function (row, column) {
				return row.status === 0 ? '审核中' : row.status === 1?'通过':'未通过';
			},
			getData:function (){
				this.listLoading = true;
				this.$http.post('mstore/info/identity', this.qs.stringify({id:this.$route.query.id})).then(data => {
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
                        this. data = Object.assign({}, res.data);
						this.listLoading = false;
						if(this.data.type === 2){
							switch (this.data.explicit){
								case 0:
									return this.data.explicit = "麻辣汤/烧烤";
									break;
								case 1:
									return this.data.explicit = "炒饭/炒面";
									break;
								case 2:
									return this.data.explicit = "水果/蛋糕";
									break;
								case 3:
									return this.data.explicit = "奶茶/小吃";
									break;
								case 4:
									return this.data.explicit = "火锅/烤鱼";
									break;
								case 5:
									return this.data.explicit = "西餐/日料";
									break;
								case 6:
									return this.data.explicit = "烤鸡/汉堡";
									break;
								case 7:
									return this.data.explicit = "茶点/饺类";
									break;
								case 8:
									return this.data.explicit = "精品快餐";
									break;
								case 9:
									return this.data.explicit = "汤粉/砂锅煲";
									break;
							}
						}else if(this.data.type === 3){
							switch (this.data.explicit){
								case 0:
									return this.data.explicit = "青少年";
									break;
								case 1:
									return this.data.explicit = "儿童";
									break;
								case 2:
									return this.data.explicit = "中年人";
									break;
								case 3:
									return this.data.explicit = "老年人";
									break;
							}
						}else if(this.data.type === 4){
							this.$http.post('mcommerce/kind/name', this.qs.stringify({id: this.data.explicit})).then(data => {
								let  res = data.data;
								if (res.status !== 0) {
									
								} else {
									this.data.explicit = res.data
								}
							})
						}

					}
				});
			},
            examine(para){
				this.listLoading = true;
				this.$http.post('mstore/update', this.qs.stringify(para)).then(data => {
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
					let para = { ids: this.data.id,status: 1, adminId: sessionStorage.getItem('id')};
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
							let para = { ids: this.data.id, status: -1,reason: this.editForm.reason, adminId: sessionStorage.getItem('id')};
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