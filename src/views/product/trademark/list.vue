<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <!-- 表格 -->
    <el-table :data="records" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="logo" class="trademark_img" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
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
      @size-change="getTrademarkList(page, $event)"
      @current-change="getTrademarkList($event, limit)"
      class="trademark_pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      records: [], // 所有品牌数据
      page: 1, // 当前页码
      limit: 3, // 每页显示条数
      total: 0, // 总条数
      pages: 7,
    };
  },
  methods: {
    // 获取品牌数据的方法
    async getTrademarkList(page, limit) {
      const result = await this.$API.trademark.getPageList(page, limit);
      this.records = result.data.records;
      this.page = result.data.current;
      this.limit = result.data.size;
      this.total = result.data.total;
      this.pages = result.data.pages;
    },
  },
  mounted() {
    this.getTrademarkList(this.page, this.limit);
  },
};
</script>

<style lang="sass">
.trademark_img
  width: 100px
.trademark_pagination
  text-align: center
.el-pagination__sizes
  margin-left: 20px
</style>