import axios from "utils/request.js"
export const getSkuParams = (options) => axios.post('/store/getSku', options)