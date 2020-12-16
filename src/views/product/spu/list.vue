<template>
  <div>
    <AddSku v-if="isSkuShow" :spuItem="spuItem" />

    <div v-else>
      <CategorySelector :disabled="!isSpuShow" />
      <SpuList
        v-if="isSpuShow"
        @showUpdateList="showUpdateList"
        @showSkuList="showSkuList"
      />
      <UpdateSpu v-else @showSpuList="showSpuList" :rowItem="rowItem" />
    </div>
  </div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector";
import SpuList from "./spuList";
import UpdateSpu from "./updateSpu";
import AddSku from "./addSku";

export default {
  name: "Spu",
  data() {
    return {
      isSpuShow: true, // spu列表显示
      isSkuShow: false, // sku列表显示
      rowItem: {},
      spuItem: {},
    };
  },
  /*  addSku(row) {
      console.log(row);
      category3Id: 236
          description: "萨达"
          id: 2414
          spuImageList: null
          spuName: "安安"
          spuSaleAttrList: null
          tmId: null 
    }, */

  methods: {
    // 进入修改spu页面
    showUpdateList(row) {
      this.isSpuShow = false;
      this.rowItem = { ...row };
    },
    // 保存或取消修改的spu
    showSpuList(category3Id) {
      this.isSpuShow = true;
      this.$nextTick(() => {
        this.$bus.$emit("getList", { category3Id });
      });
    },
    // 进入增加sku
    showSkuList(row) {
      this.isSkuShow = true;
      this.spuItem = { ...row };
    },
  },
  components: {
    CategorySelector,
    SpuList,
    UpdateSpu,
    AddSku,
  },
};
</script>
