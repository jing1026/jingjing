<template>
	<section>
		<!--列表-->
		<el-table :data="list" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="content" label="内容" :formatter="content"></el-table-column>
            <el-table-column prop="headIcon" label="头像">
				<template scope="scope">
					<img class="head-icon" :src="scope.row.headIcon" />
				</template>
			</el-table-column>
			<el-table-column prop="nickname" label="用户昵称"></el-table-column>
			<el-table-column prop="createTime" label="时间" sortable></el-table-column>
			<el-table-column label="操作" width="160">
				<template scope="scope">
					<el-button size="small" @click="details(scope.row)">消息记录</el-button>
				</template>
			</el-table-column>
		</el-table>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				listLoading: false
			}
		},
		methods: {
			content(row, column){
                try { 
                    return decodeURIComponent(row.content.replace(/\+/g, '%20'));
                } catch(e) { 
                    return row.content
                }
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
            },
			//获取列表
			getData:function (){
				this.listLoading = true;
				let para = {
                    hxId: this.$route.query.id,
				};
				
				this.$http.post('customer/service/conversation/list', this.qs.stringify(para)).then(data => {
					
					let  res = data.data;
					if (res.status !== 0) {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					} else {
						this.list = res.data;
						this.listLoading = false;
					}
				});
            },
            details(row){
				this.$router.push({
					path: '/serviceD',
					query: {
						id: row.id,
						name: row.nickname,
						headIcon: row.headIcon,
					}
				})
			}
		},
		mounted() {
            this.getData();
            
            let hx = JSON.parse(sessionStorage.getItem("hx"));
            this.$imoption.user = hx.hxId;
            this.$imoption.pwd = hx.hxPwd;
            this.$imconn.open(this.$imoption);
            let _this = this;
            this.$imconn.listen({
                onOpened: function (message) {
                    console.log('用户已上线');
                },
                //收到文本消息
                onTextMessage: function ( message ) {
                    console.log(message);
                    _this.getData();
                }
            })
		}
	}

</script>

<style scoped>
    .head-icon{
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
</style>