<template>
  <div>
    <CategorySelector :disabled="!isSpuShow" />
    <SpuList v-if="isSpuShow" @showUpdateList="showUpdateList" />
    <UpdateSpu v-else @showSpuList="showSpuList" :rowItem="rowItem" />
  </div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector";
import SpuList from "./spuList";
import UpdateSpu from "./updateSpu";

export default {
  name: "Spu",
  data() {
    return {
      isSpuShow: true,
      rowItem: {},
    };
  },
  methods: {
    showUpdateList(row) {
      this.isSpuShow = false;
      this.rowItem = { ...row };
    },
    showSpuList(category3Id) {
      this.isSpuShow = true;
      this.$nextTick(() => {
        this.$bus.$emit("getList", { category3Id });
      });
    },
  },
  components: {
    CategorySelector,
    SpuList,
    UpdateSpu,
  },
};
</script>
