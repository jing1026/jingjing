import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Admin from './views/nav1/Admin.vue'
import Analysis from './views/nav1/Analysis.vue'
import Record from './views/nav1/Record.vue'
import User from './views/nav1/User.vue'
import UserD from './views/nav1/UserD.vue'
import Content from './views/nav1/Content.vue'
import Shop from './views/nav1/Shop.vue'
import Video from './views/nav2/Video.vue'
import xVideo from './views/nav2/xVideo.vue'
import cVideo from './views/nav2/cVideo.vue'
import Article from './views/nav2/Article.vue'
import Zone from './views/nav2/Zone.vue'
import Answer from './views/nav2/Answer.vue'
import Main from './views/nav2/Main.vue'
import Recommend from './views/nav2/Recommend.vue'
import Publish from './views/nav2/Publish.vue'
import Details from './views/nav2/Details.vue'
import Comment from './views/nav2/Comment.vue'
import Providers from './views/nav3/Providers.vue'
import Theme from './views/nav3/Theme.vue'
import Announcement from './views/nav3/announcement.vue'
import Topic from './views/nav3/topic.vue'
import Features from './views/nav3/features.vue'
import Chat from './views/nav3/Chat.vue'
import Vip from './views/nav3/Vip.vue'
import Public from './views/nav3/Public.vue'
import PublicD from './views/nav3/PublicD.vue'
import Report from './views/nav3/Report.vue'
import ReportD from './views/nav3/ReportD.vue'
import Feedback from './views/nav3/Feedback.vue'
import Region from './views/nav3/Region.vue'
import Inform from './views/nav3/Inform.vue'
import Option from './views/nav3/Option.vue'
import Service from './views/nav3/Service.vue'
import ServiceM from './views/nav3/ServiceM.vue'
import ServiceD from './views/nav3/ServiceD.vue'
import Photo from './views/nav3/Photo.vue'
import Music from './views/nav3/Music.vue'
import Agreement from './views/nav3/Agreement.vue'
import Join from './views/nav3/Join.vue'
import Convenience from './views/nav4/Convenience.vue'
import Market from './views/nav4/Market.vue'
import MarketD from './views/nav4/MarketD.vue'
import MarketAdd from './views/nav4/MarketAdd.vue'
import Ride from './views/nav4/Ride.vue'
import RideD from './views/nav4/RideD.vue'
import Houses from './views/nav4/Houses.vue'
import HousesD from './views/nav4/HousesD.vue'
import HousesAdd from './views/nav4/HousesAdd.vue'
import Job from './views/nav4/Job.vue'
import JobAdd from './views/nav4/JobAdd.vue'
import JobD from './views/nav4/JobD.vue'
import Cooperation from './views/nav4/Cooperation.vue'
import CooperationD from './views/nav4/CooperationD.vue'
import List from './views/nav4/List.vue'
import ListD from './views/nav4/ListD.vue'
import ListM from './views/nav4/ListM.vue'
import ListF from './views/nav4/ListF.vue'
import Info from './views/nav4/Info.vue'

import articleOne from './views/nav5/articleOne.vue'
import mainOne from './views/nav5/mainOne.vue'
import videoOne from './views/nav5/videoOne.vue'
import xvideoOne from './views/nav5/xvideoOne.vue'
import cvideoOne from './views/nav5/cvideoOne.vue'
import zoneOne from './views/nav5/zoneOne.vue'

import articleTwo from './views/nav6/articleTwo.vue'
import mainTwo from './views/nav6/mainTwo.vue'
import videoTwo from './views/nav6/videoTwo.vue'
import xvideoTwo from './views/nav6/xvideoTwo.vue'
import cvideoTwo from './views/nav6/cvideoTwo.vue'
import zoneTwo from './views/nav6/zoneTwo.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user',//前面的图标
        leaf: true,//是否只有一个节点
        children: [
            { path: '/user', component: User, name: '用户管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '圈子管理',
        iconCls: 'fa fa-circle-o',
        children: [
            { path: '/main', component: Main, name: '全部' },
            { path: '/video', component: Video, name: '视频' },
            { path: '/article', component: Article, name: '文章' },
            { path: '/trends/0', component: Zone, name: '动态' },
            { path: '/interlocution/4', component: Zone, name: '问答' },
            { path: '/seek/2', component: Zone, name: '求助' },
            { path: '/discuss/3', component: Zone, name: '讨论' },
            { path: '/xvideo', component: xVideo, name: '偶遇小视频' },
            { path: '/cvideo', component: cVideo, name: '偶遇长视频' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '员工检查-上热门',
        iconCls: 'fa fa-circle-o',
        children: [
            { path: '/mainOne', component: mainOne, name: '全部' },
            { path: '/videoOne', component: videoOne, name: '视频' },
            { path: '/articleOne', component: articleOne, name: '文章' },
            { path: '/trendsOne/0', component: zoneOne, name: '动态' },
            { path: '/interlocutionOne/4', component: zoneOne, name: '问答' },
            { path: '/seekOne/2', component: zoneOne, name: '求助' },
            { path: '/discussOne/3', component: zoneOne, name: '讨论' },
            { path: '/xvideoOne', component: xvideoOne, name: '偶遇小视频' },
            { path: '/cvideoOne', component: cvideoOne, name: '偶遇长视频' }
        ]
    },
    
    {
        path: '/',
        component: Home,
        name: '员工检查-忽略',
        iconCls: 'fa fa-circle-o',
        children: [
            { path: '/mainTwo', component: mainTwo, name: '全部' },
            { path: '/videoTwo', component: videoTwo, name: '视频' },
            { path: '/articleTwo', component: articleTwo, name: '文章' },
            { path: '/trendsTwo/0', component: zoneTwo, name: '动态' },
            { path: '/interlocutionTwo/4', component: zoneTwo, name: '问答' },
            { path: '/seekTwo/2', component: zoneTwo, name: '求助' },
            { path: '/discussTwo/3', component: zoneTwo, name: '讨论' },
            { path: '/xvideoTwo', component: xvideoTwo, name: '偶遇小视频' },
            { path: '/cvideoTwo', component: cvideoTwo, name: '偶遇长视频' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '精彩内容',
        iconCls: 'fa fa-video-camera',
        children: [
            { path: '/recommend/0', component: Recommend, name: '推荐内容' },
            { path: '/recommend/1', component: Recommend, name: '精彩小视频' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商街管理',
        iconCls: 'fa fa-shopping-bag',
        children: [
            { path: '/list', component: List, name: '店铺审核' },
            { path: '/market', component: Market, name: '二手市场' },
            { path: '/ride', component: Ride, name: '顺风车' },
            { path: '/convenience', component: Convenience, name: '便民电话' },
            { path: '/houses', component: Houses, name: '房屋租赁' },
            { path: '/job', component: Job, name: '求职招聘' },
            { path: '/cooperation', component: Cooperation, name: '找合作' },
            { path: '/food/3', component: List, name: '餐饮美食' },
            { path: '/snacks/2', component: List, name: '特色小吃' },
            { path: '/couture/4', component: List, name: '服装店' },
            { path: '/female/1', component: List, name: '女性专区' },
            { path: '/providers/5', component: List, name: '更多电商' },
           
        ]
    },
    {
        path: '/',
        component: Home,
        name: '平台管理',
        iconCls: 'fa fa-sitemap',
        children: [
            { path: '/theme', component: Theme, name: '每日主题' },
            { path: '/topic', component: Topic, name: '每日话题' },
            { path: '/features', component: Features, name: '本地特色' },
            { path: '/announcement', component: Announcement, name: '公告管理' },
            { path: '/chat', component: Chat, name: '聊天室话题' },
            { path: '/photo', component: Photo, name: '聊天室图片' },
            { path: '/music', component: Music, name: '聊天室音乐' },
            { path: '/providers', component: Providers, name: '电商分类' },
            { path: '/public', component: Public, name: '公益管理' },
            { path: '/vip', component: Vip, name: 'VIP订单' },
            { path: '/report', component: Report, name: '举报管理' },
            { path: '/feedback', component: Feedback, name: '意见反馈' },
            { path: '/region', component: Region, name: '区域管理' },
            { path: '/inform', component: Inform, name: '通知管理' },
            { path: '/service', component: Service, name: '客服管理' },
            { path: '/agreement', component: Agreement, name: '协议管理' },
            { path: '/join', component: Join, name: '加盟推广' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '数据分析',
        iconCls: 'fa fa-area-chart',
        children: [
            { path: '/analysis', component: Analysis, name: '用户数据' },
            { path: '/register', component: Analysis, name: '注册统计' },
            { path: '/model', component: Analysis, name: '机型统计' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '管理记录',
        iconCls: 'fa fa-file-text',
        children: [
            { path: '/userR', component: Record, name: '用户记录' },
            { path: '/dynamicR', component: Record, name: '动态记录' },
            { path: '/streetR', component: Record, name: '商街记录' },
            { path: '/commodityR', component: Record, name: '商品记录' },
            { path: '/videoR', component: Record, name: '视频记录' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/',
        component: Home,
        name: '',
        hidden: true,
        children: [
            { path: '/404', component: NotFound, name: '' },
            { path: '/userD', component: UserD, name: '用户信息' },
            { path: '/content', component: Content, name: '用户发表的内容' },
            { path: '/shop', component: Shop, name: '用户的店铺' },
            { path: '/publish', component: Publish, name: '发布文章' },
            { path: '/answer', component: Answer, name: '回答' },
            { path: '/comment', component: Comment, name: '评论' },
            { path: '/details', component: Details, name: '内容详情' },
            { path: '/publicD', component: PublicD, name: '公益详情' },
            { path: '/option', component: Option, name: '举报选项管理' },
            { path: '/ReportD', component: ReportD, name: '举报详情' },
            { path: '/serviceM', component: ServiceM, name: '客服记录' },
            { path: '/serviceD', component: ServiceD, name: '消息记录' },
            { path: '/rideD', component: RideD, name: '顺风车详情' },
            { path: '/marketD', component: MarketD, name: '详情' },
            { path: '/marketAdd', component: MarketAdd, name: '二手发布' },
            { path: '/housesD', component: HousesD, name: '房屋详情' },
            { path: '/housesAdd', component: HousesAdd, name: '房屋发布' },
            { path: '/jobD', component: JobD, name: '工作详情' },
            { path: '/jobAdd', component: JobAdd, name: '发布招聘' },
            { path: '/listD', component: ListD, name: '店铺详情' },
            { path: '/listM', component: ListM, name: '店铺商品' },
            { path: '/listF', component: ListF, name: '店铺分类' },
            { path: '/info', component: Info, name: '商品详情' },
            { path: '/cooperationD', component: CooperationD, name: '合作详情' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-setting',
        hidden: false,
        leaf: true,
        children: [
            { path: '/admin', component: Admin, name: '权限管理' }
        ]
    }
];

export default routes;