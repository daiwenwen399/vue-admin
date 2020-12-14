<template>
  <div><CategorySelector /><SpuList /></div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector";
import SpuList from "./spuList";

export default {
  name: "Spu",
  methods: {},
  components: {
    CategorySelector,
    SpuList,
  },
};
</script>
