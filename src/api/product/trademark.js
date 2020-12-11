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
    addTrademark(banner) {
        return request({
            method: "POST",
            url: `${api_name}/save`,
            data: banner
        })
    },

    // 修改品牌信息
    updataTrademark(banner) {
        return request({
            method: "PUT",
            url: `${api_name}/updata`,
            data: banner
        })
    },

    // 删除品牌
    delTrademark(id) {
        return request({
            method: "DELETE",
            url: `${api_name}/remove/${id}`
        })
    }
}