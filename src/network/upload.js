import axios from "utils/request.js"
export const upload = (options) => axios.post('/upload/upload', options)