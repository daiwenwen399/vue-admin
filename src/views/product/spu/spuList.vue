<template>
  <el-card>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      :disabled="!attrList.category3Id"
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
        <template>
          <el-button type="primary" icon="el-icon-plus"></el-button>
          <el-button type="primary" icon="el-icon-edit"></el-button>
          <el-button type="info" icon="el-icon-info"></el-button>
          <el-button type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- <el-pagination
          :page-size.sync="limit"

      @size-change="getTrademarkList(page, $event)"
      @current-change="getTrademarkList($event, limit)"
    > -->
    <el-pagination
      layout="prev, pager, next,jumper,sizes,total"
      :current-page="page"
      :page-size="limit"
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
        category3Id: "",
      },
      spuList: [],
      loading: false,
    };
  },
  methods: {
    // 三级分类列表改变触发的函数
    getSpuList({ category3Id }) {
      this.attrList.category3Id = category3Id;
      const { page, limit } = this;
      this.getSpuPageList(page, limit);
    },
    // 获取分页数据
    async getSpuPageList(page, limit) {
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
    },
  },
  mounted() {
    this.$bus.$on("getList", this.getSpuList);
  },
  beforeDestroy() {
    this.$bus.$off("getList", this.getSpuList);
  },
};
</script>

<style lang="less" scoped>
</style>
