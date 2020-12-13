<template>
  <div>
    <CategorySelector @getAttrList="getAttrList" />
    <!-- 展示属性区域 -->
    <el-card v-show="!isAddTableShow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attrInfoList.length"
        @click="isAddTableShow = true"
        >添加属性</el-button
      >
      <el-table :data="attrInfoList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(row)"
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

    <!-- 添加属性区域 -->
    <el-card v-show="isAddTableShow">
      <el-form inline :model="attr" class="demo-form-inline">
        <el-form-item label="属性名">
          <el-input
            v-model="attr.attrName"
            placeholder="请输入属性名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" :disabled="!attr.attrName"
        >添加属性值</el-button
      >
      <el-table :data="attr.attrValueList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row }">
            <el-input v-if="row.edit" v-model="row.valueName"></el-input>
            <span v-else>{{ row.valueName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" :disabled="!attr.attrValueList.length"
        >保存</el-button
      >
      <el-button @click="isAddTableShow = false">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import CategorySelector from "./CategorySelector";
export default {
  name: "AttrList",
  data() {
    return {
      attrInfoList: [], // 所有属性信息列表
      attr: {
        attrName: "",
        attrValueList: [],
      },
      isAddTableShow: true,
    };
  },
  methods: {
    // 根据分类获取所有属性信息列表
    async getAttrList(attrList) {
      const result = await this.$API.attr.getAttrInfoList(attrList);
      if (result.code === 200) {
        this.attrInfoList = result.data;
      } else {
        this.$message.error("获取属性信息列表失败");
      }
    },
    // 点击修改属性按钮
    edit(row) {
      this.isAddTableShow = true;
      // 为了防止attr变化时直接修改原数据
      this.attr = { ...row };
      // 深度克隆：防止对象中对象还存在引用关系
    },
  },
  components: {
    CategorySelector,
  },
};
</script>

<style lang="sass" scope>
.el-table
  margin: 20px 0
</style>