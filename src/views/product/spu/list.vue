<template>
  <div><CategorySelector @getList="getSpuList" /><SpuList /></div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector";
import SpuList from "./spuList";

export default {
  name: "Spu",
  methods: {
    getSpuList({ category3Id }) {
      this.$API.spu.getSpuPageList(category3Id,);
    },
  },
  components: {
    CategorySelector,
    SpuList,
  },
};
</script>
