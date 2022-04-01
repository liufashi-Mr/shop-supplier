import axios from "@/utils/request"

export const getOrder=(data)=>{
    return axios({
        method:"post",
        url:"/order/getOrder",
        data,
    })
}

export const getOrderDetail=(data)=>{
    return axios({
        method:"post",
        url:"/order/getOrderDetail",
        data,
    })
}
export const updateOrder=(data)=>{
    return axios({
        method:"post",
        url:"/order/updateOrder",
        data,
    })
}
export const deleteOrder=(data)=>{
    return axios({
        method:"post",
        url:"/order/deleteOrder",
        data
    })
}
export const addDelivery=(data)=>{
    return axios({
        method:"post",
        url:"/delivery/addDelivery",
        data
    })
}
export const getBackStock=(data)=>{
    return axios({
        method:"post",
        url:"/order/getBackStock",
        data
    })
}
export const getBackStockDetail=(data)=>{
    return axios({
        method:"post",
        url:"/order/getBackStockDetail",
        data
    })
}
export const updateBackStock=(data)=>{
    return axios({
        method:'post',
        url:'order/updateBackStock',
        data,
    })
}
