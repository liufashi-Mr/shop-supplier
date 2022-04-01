import axios from "utils/request.js"
export const updateQuick = (options) => axios.post('/store/updateQuick', options)