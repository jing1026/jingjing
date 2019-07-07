<template>
    <section v-loading="listLoading">
        <el-row v-if="url === '/analysis'">
            <el-row class="header" :gutter="30">
                <el-col :span="7">
                    <dir class="grid">
                        <div class="title">用户总数</div>
                        <div class="num">{{data.userData.totalNum}}</div>
                    </dir>
                </el-col>
                <el-col :span="7">
                    <dir class="grid">
                        <div class="title">今日登录数量</div>
                        <div class="num">{{data.userData.loginNum}}</div>
                    </dir>
                </el-col>
                <el-col :span="7">
                    <dir class="grid">
                        <div class="title">今日新增用户数</div>
                        <div class="num">{{data.userData.increaseNum}}</div>
                    </dir>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:40px">
                <el-col :span="14">
                    <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
                </el-col>
                <el-col :span="10">
                    <div id="tools" style="width:100%;height:400px;"></div>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:40px">
                <el-col :span="12">
                    <div id="age" style="width:100%;height:400px;"></div>
                </el-col>
                <el-col :span="12">
                    <div id="sex" style="width:100%;height:400px;"></div>
                </el-col>
            </el-row>
        </el-row>

        <el-row v-else-if="url === '/register'">
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button v-for="(todo, index) in todos" :key="index" @click="handleClick(index, todo.value)" :class="{ active:index == current}" type="primary" plain size="small">{{todo.text}}</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions0" @change="selectTime"></el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
             <el-col :span="24" style="margin-top:30px;">
                 <div id="download" style="width:100%;height:500px;"></div>
             </el-col>
        </el-row>
        <el-row v-else-if="url === '/model'">
            <el-col :span="24" style="margin-top:30px;">
                <div id="model" style="width:100%;height:500px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    let echarts = require('echarts/lib/echarts')
    require('echarts/map/js/china')

    export default {
        data() {
            return {
                listLoading: false,
                age: [],
                sex: [],
                data: {
                    ageNum: [],
                    areaData: [],
                    phoneType: {},
                    sexNum: [],
                    userData: {}
                },
                url: '',
                form: {},
                pickerOptions0: {
					disabledDate(time) {
						return time.getTime() > Date.now() - 8.64e6;
					}
                },
                name: [],
                value: [],
                date: '',
                current:0,
                todos: [
                    { text: '7天', value: 7 },
                    { text: '14天', value: 14 },
                    { text: '30天', value: 30 }
                ],
                phone: {}
            }
        },
        methods: {
            selectTime(value){
                this.current = -1;
                this.form = {
                    startTime: value[0],
                    endTime: value[1]
                };
                this.getData();
            },
            handleClick(index, e) {
                this.date = '',
                this.current = index;
                this.form = {
                    day: e
                };
                this.getData();
            },
            getData(){
                this.url = this.$route.path;
                this.listLoading = true;
                if(this.url === '/analysis'){
                    this.$http.post('muser/user/analysis').then(data => {
                        
                        let  res = data.data;
                        if (res.status !== 0) {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        } else {
                            this.listLoading = false;
                            this.data = Object.assign({}, res.data);

                            this.age = this.data.ageNum.map(function (item) {
                                return item['name']; 
                            });

                            this.sex = this.data.sexNum.map(function (item) {
                                return item['name']; 
                            });

                            this.analysis();
                        }
                    });
                }else if(this.url === '/register'){
                    this.$http.post('muser/download/count', this.qs.stringify(this.form)).then(data => {
                        
                        let  res = data.data;
                        if (res.status !== 0) {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        } else {
                            this.listLoading = false;
                            
                            this.name = res.data.map(function (item) {
                                return item['createTime']; 
                            });

                            this.value = res.data.map(function (item) {
                            　　return item['num']; 
                            });

                            this.register();
                        }
                    });
                }else if(this.url === '/model'){
                    this.$http.post('muser/phone/count').then(data => {
                        
                        let  res = data.data;
                        if (res.status !== 0) {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        } else {
                            this.listLoading = false;
                            this.phone = res.data;
                            this.model();
                        }
                    });
                }
            },
            analysis() {
                var userChart = echarts.init(document.getElementById('myChart'));
                userChart.setOption({
                    title : {
                        text: '用户地域分布',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    visualMap: {
                        left: 'left',
                        top: 'bottom',
                        calculable : true,
                        color: ['orangered','yellow','lightskyblue']
                    },
                    series : [
                        {
                            name: '用户数',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: this.data.areaData
                        }
                    ]
                });

                var toolsChart = echarts.init(document.getElementById('tools'));
                toolsChart.setOption({
                    title : {
                        text: '访问终端',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series : [
                        {
                            name: '访问方式',
                            type: 'pie',
                            radius : '55%',
                            data: this.data.phoneType,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            label: {
                                normal: {
                                    position: 'inner',
                                    formatter: '{b}\n{d}%',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 14,
                                        lineHeight:20
                                    }
                                }
                            }
                        }
                    ]
                })
                
                var ageChart = echarts.init(document.getElementById('age'));
                ageChart.setOption({
                    color: ['#28a1f2'],
                    title: {
                        text: '用户年龄分布'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color:'#999'
                            }
                        },
                        axisTick:false,
                        data: this.age,
                    },
                    yAxis:{
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color:'#999'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                type:'dotted'
                            }
                        }
                    },
                    series: [
                        {
                            name: '用户数',
                            type: 'bar',
                            barMaxWidth:50,
                            data: this.data.ageNum,
                        }
                    ]
                });
                var sexChart = echarts.init(document.getElementById('sex'));
                sexChart.setOption({
                    color: ['#6ab0b8'],
                    title: {
                        text: '用户性别分布',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color:'#999'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color:'#999'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                type:'dotted'
                            }
                        },
                        data: this.sex
                    },
                    series: [
                        {
                            name: '用户数',
                            type: 'bar',
                            barMaxWidth:50,
                            itemStyle: {
                                normal:{  
                                    color: function (params){
                                        var colorList = ['#e89589','#0072bb','#5a5a5a']
                                        return colorList[params.dataIndex];
                                    }
                                }
                            },
                            data: this.data.sexNum
                        }
                    ]
                });
            },
            register(){
                var appChart = echarts.init(document.getElementById('download'));
                appChart.setOption({
                    title: {
                            text: '用户注册统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color:'#999'
                            }
                        },
                        axisTick:false,
                        //boundaryGap: false,
                        data: this.name
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color:'#999'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                type:'dotted'
                            }
                        }
                    },
                    series: [
                        {
                            name:'新增用户数',
                            type:'line',
                            stack: '总量',
                            color:"#28a1f2",
                            data:this.value
                        }
                    ]
                });
            },
            model(){
                var modelChart = echarts.init(document.getElementById('model'));
                modelChart.setOption({
                    title : {
                        text: '用户机型分析'
                    },
                    tooltip : {
                        show: true,
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        y:"10%"
                    },
                    series : [
                        {
                            name: '型号',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            data: this.phone,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            label: {
                                normal: {
                                    position: 'outside',
                                    formatter: '{b}\n{d}%',
                                    textStyle: {
                                        fontSize: 14,
                                        lineHeight:20,
                                        rich: {
                                            a: {
                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                })
            }
        },
        mounted() {
            this.getData();
        },
		watch: {
			"$route": "getData"
		}
    }
</script>

<style scoped lang="scss">
    .header{
        text-align: center;
        margin: 10px 0;
        .grid{
            border: 1px solid #f0f0f0;
            padding: 16px 0;
            border-radius: 4px;
        }
        .title{
            font-size: 18px;
            line-height: 30px;
            margin-bottom: 6px;
        }
        .num{
            font-size: 20px;
            font-weight: bold;
        }
    }
    .el-button.active{
        background: #409EFF;
        border-color: #409EFF;
        color: #FFF;
    }
</style>
