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
    saveSpuInfo(spu) {
        return request({
            method: "POST",
            url: `${api_name}/saveSpuInfo`,
            data: spu,
        })
    },

    // 更改SPU信息
    updateSpuInfo(spu) {
        return request({
            method: "POST",
            url: `${api_name}/updateSpuInfo`,
            data: spu,
        })
    },

    // 删除SPU项
    deleteSpu(spuId) {
        return request({
            method: "DELETE",
            url: `${api_name}/deleteSpu/${spuId}`
        })
    },

    // 获取所有品牌数据
    getTrademarkList() {
        return request({
            method: "GET",
            url: `${api_name}/baseTrademark/getTrademarkList`
        })
    },

    // 获取spu图片
    getSpuImageList(spuId) {
        return request({
            method: "GET",
            url: `${api_name}/spuImageList/${spuId}`
        })
    },

    // 获取所有销售属性列表
    getBaseSaleAttrList() {
        return request({
            method: "GET",
            url: `${api_name}/baseSaleAttrList`
        })
    },

    // 获取spu销售属性列表
    getSpuSaleAttrList(spuId) {
        return request({
            method: "GET",
            url: `${api_name}/spuSaleAttrList/${spuId}`
        })
    },
}
