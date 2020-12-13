import request from '@/utils/request'

const api_name = "/admin/product"

export default {
    // 获取一级分类数据
    getCategory1() {
        return request({
            method: "GET",
            url: `${api_name}/getCategory1`
        })
    },

    // 获取二级分类数据
    getCategory2(category1Id) {
        return request({
            method: "GET",
            url: `${api_name}/getCategory2/${category1Id}`
        })
    },

    // 获取三级分类数据
    getCategory3(category2Id) {
        return request({
            method: "GET",
            url: `${api_name}/getCategory3/${category2Id}`
        })
    },

    // 获取分类对应的属性数据
    getAttrInfoList({ category1Id, category2Id, category3Id }) {
        return request({
            method: "GET",
            url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
        })
    },

    // 获取属性值列表
    getAttrValueList(attrId) {
        return request({
            method: "GET",
            url: `${api_name}/getAttrValueList/${attrId}`
        })
    },

    // 保存修改的属性值
    saveAttrInfo(data) {
        return request({
            method: "POST",
            url: `${api_name}/saveAttrInfo`,
            data
        })
    },

    // 删除属性值
    deleteAttr(attrId) {
        return request({
            method: "DELETE",
            url: `${api_name}/deleteAttr/${attrId}`
        })
    }
}