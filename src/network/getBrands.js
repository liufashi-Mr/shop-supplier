import axios from "utils/request.js"
export const getBrandName = (options) => axios.post('/store/getBrands', options)