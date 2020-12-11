import request from '@/utils/request'

const api_name = "/admin/product/baseTrademark"

export default {
    // 获取品牌分页列表
    getPageList(page, limit) {
        return request({
            method: "GET",
            url: `${api_name}/${page}/${limit}`
        })
    },

    // 新增品牌信息
    addTrademark(data) {
        return request({
            method: "POST",
            url: `${api_name}/save`,
            data,
        })
    },

    // 修改品牌信息
    updataTrademark(data) {
        return request({
            method: "PUT",
            url: `${api_name}/update`,
            data,
        })
    },

    // 删除品牌
    deleteTrademark(id) {
        return request({
            method: "DELETE",
            url: `${api_name}/remove/${id}`
        })
    }
}