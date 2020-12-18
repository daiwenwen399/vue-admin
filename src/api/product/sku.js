import request from '@/utils/request'

const api_name = "/admin/product"

export default {
    // 保存sku信息
    saveSku(sku) {
        return request({
            method: "POST",
            url: `${api_name}/saveSkuInfo`,
            data: sku
        })
    },

    // 获取sku分页数据
    getSkuPageList(page, limit) {
        return request({
            method: "GET",
            url: `${api_name}/list/${page}/${limit}`
        })
    },

    // 获取sku展示数据
    getSkuInfo(skuId) {
        return request({
            method: "GET",
            url: `${api_name}/getSkuById/${skuId}`
        })
    },
}