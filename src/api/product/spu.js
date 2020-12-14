import request from '@/utils/request'

const api_name = "/admin/product"

export default {
    // 获取SPU分页列表信息
    getSpuPageList({ category3Id, page, limit }) {
        return request({
            method: "GET",
            url: `${api_name}/${page}/${limit}`,
            params: {
                category3Id
            }
        })
    },

    // 获取SPU基本信息
    getSpuById(spuId) {
        return request({
            method: "GET",
            url: `${api_name}/getSpuById/${spuId}`
        })
    },

    // 保存SPU信息
    saveSpuInfo() {
        return request({
            method: "POST",
            url: `${api_name}/saveSpuInfo`
        })
    },

    // 更改SPU信息
    updateSpuInfo() {
        return request({
            method: "POST",
            url: `${api_name}/updateSpuInfo`
        })
    },

    // 删除SPU项
    deleteSpu(spuId) {
        return request({
            method: "DELETE",
            url: `${api_name}/deleteSpu/${spuId}`
        })
    },

    // 获取SPU销售属性列表
    getBaseSaleAttrList() {
        return request({
            method: "GET",
            url: `${api_name}/baseSaleAttrList`
        })
    },
}
