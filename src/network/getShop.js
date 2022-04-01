import axios from "utils/request.js"
export const getShop = (options) => axios.post('/store/getSpu', options)