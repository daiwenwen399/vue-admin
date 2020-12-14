<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>

    <!-- 表格 -->
    <el-table :data="[]" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="SPU名称"> </el-table-column>
      <el-table-column prop="dec" label="SPU描述"> </el-table-column>
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
      :current-page="1"
      :page-size="3"
      :page-sizes="[3, 6, 9]"
      :total="10"
      class="trademark_pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "SpuList",
};
</script>

<style lang="less" scoped>
</style>
