<template>
  <div>
    <CategorySelector @getAttrList="getAttrList" />
    <!-- 添加属性区域 -->
    <el-card>
      <el-button type="primary" icon="el-icon-plus">添加</el-button>
      <el-table :data="attrInfoList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import CategorySelector from "./CategorySelector";
export default {
  name: "AttrList",
  data() {
    return {
      attrInfoList: [],
    };
  },
  methods: {
    async getAttrList(attrList) {
      const result = await this.$API.attr.getAttrInfoList(attrList);
      if (result.code === 200) {
        this.attrInfoList = result.data;
      } else {
        this.$message.error("获取属性信息列表失败");
      }
    },
  },
  components: {
    CategorySelector,
  },
};
</script>

<style lang="sass">
</style>