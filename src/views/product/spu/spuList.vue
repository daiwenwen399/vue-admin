<template>
  <el-card>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      :disabled="!attrList.category3Id"
      @click="$emit('showUpdateList', attrList)"
      >添加SPU</el-button
    >

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="spuList"
      border
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="$emit('showSkuList', { ...row, ...attrList })"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$emit('showUpdateList', { ...row, ...attrList })"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      layout="prev, pager, next,jumper,sizes,total"
      :current-page="page"
      :page-size.sync="limit"
      :page-sizes="[3, 6, 9]"
      :total="total"
      @size-change="getSpuPageList(page, $event)"
      @current-change="getSpuPageList($event, limit)"
      class="trademark_pagination"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "SpuList",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      attrList: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      spuList: [],
      loading: false,
    };
  },
  methods: {
    // 三级分类列表改变触发的函数
    getSpuList(attrList) {
      this.attrList = attrList;
      const { page, limit } = this;
      this.getSpuPageList(page, limit);
    },
    // 三级列表变化时触发，清空列表数据
    clearSpuList() {
      this.spuList = [];
      this.attrList.category3Id = "";
      this.page = 1;
      this.limit = 3;
      this.total = 0;
    },
    // 获取分页数据
    async getSpuPageList(page, limit) {
      this.loading = true;
      const { category3Id } = this.attrList;
      const result = await this.$API.spu.getSpuPageList({
        category3Id,
        page,
        limit,
      });
      if (result.code === 200) {
        this.$message.success("获取分页列表成功");
        this.spuList = result.data.records;
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
      } else {
        this.$message.error("获取分页列表失败");
      }
      this.loading = false;
    },
  },
  mounted() {
    this.$bus.$on("getList", this.getSpuList);
    this.$bus.$on("clearList", this.clearSpuList);
  },
  beforeDestroy() {
    this.$bus.$off("getList", this.getSpuList);
    this.$bus.$off("clearList", this.clearSpuList);
  },
};
</script>

<style lang="less" scoped>
</style>
