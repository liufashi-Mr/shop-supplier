import Vue from "vue"
// 按需引入
import {
    Layout,Button,Message,Menu,Icon,Breadcrumb,Input,Table,Pagination,Popconfirm,List,Card,Avatar,InputNumber,Modal,Cascader ,Select,Upload,Radio,DatePicker,Tag
} from "ant-design-vue"
import revertUTF8 from '../code/codeChange'
// use使用
const vueUse = {
    Layout,Button,Message,Menu,Icon,Breadcrumb,Input,Table,Pagination,Popconfirm,List,Card,Avatar,InputNumber,Modal,Cascader ,Select,Upload,Radio,DatePicker,Tag
}
Object.keys(vueUse).forEach(item => {
    Vue.use(vueUse[item])
})
Vue.prototype.$message = Message;
Vue.prototype.reverseCode=revertUTF8
