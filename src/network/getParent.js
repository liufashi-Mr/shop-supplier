import axios from "utils/request.js"
export const getParentName = (options) => axios.post('/type/getParentName', options)
