import axios from "utils/request.js"
export const getShopList = (options) => axios.post('/store/getShopList', options)