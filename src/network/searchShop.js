import axios from "utils/request.js"
export const search = (options) => axios.post('/store/search', options)