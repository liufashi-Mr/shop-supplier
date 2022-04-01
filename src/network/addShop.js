import axios from "utils/request.js"
export const addSpu = (options) => axios.post('/store/addSpu', options)
export const addSku = (options) => axios.post('/store/addSku', options)

