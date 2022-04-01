import axios from "utils/request.js"
export const userLogin = (options) => axios.post('/store/login', options)
