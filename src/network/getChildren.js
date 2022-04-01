import axios from "utils/request.js"
export const getChildrenName = (options) => axios.post('/wares/getSecond', options)
