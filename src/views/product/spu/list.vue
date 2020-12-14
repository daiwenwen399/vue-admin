<template>
  <div><CategorySelector /><SpuList /><UpdateSpu /></div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector";
import SpuList from "./spuList";
import UpdateSpu from "./updateSpu";

export default {
  name: "Spu",
  methods: {},
  components: {
    CategorySelector,
    SpuList,
    UpdateSpu,
  },
};
</script>
