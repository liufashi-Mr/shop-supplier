import axios from "utils/request.js"
export const deleteSpu = (options) => axios.post('/store/deleteSpu', options)
