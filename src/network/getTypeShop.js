import axios from "utils/request.js"
export const getTypeShop = (options) => axios.post('/type/getproduct', options)