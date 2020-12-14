<template>
  <div>
    <CategorySelector :disabled="isAddTableShow" />
    <!-- 展示属性区域 -->
    <el-card v-show="!isAddTableShow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attrInfoList.length"
        @click="addAttr"
        >添加属性</el-button
      >
      <el-table
        :data="attrInfoList"
        border
        style="width: 100%"
        v-loading="isLoading"
      >
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
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attr.attrName"
        @click="addAttrValue"
        >添加属性值</el-button
      >
      <el-table :data="attr.attrValueList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              size="mini"
              ref="input"
              v-if="row.edit"
              v-model="row.valueName"
              autofocus
              @blur="switchSpan(row, $index)"
              @keyup.enter.native="row.edit = false"
            ></el-input>
            <span
              v-else
              @click="switchInput(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`确定删除${row.valueName}吗？`"
              @onConfirm="delOneValue($index)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        :disabled="!attr.attrValueList.length"
        @click="saveAttrList"
        >保存</el-button
      >
      <el-button @click="isAddTableShow = false">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector";
export default {
  name: "AttrList",
  data() {
    return {
      attrList: {},
      attrInfoList: [], // 所有属性信息列表
      attr: {
        attrName: "",
        attrValueList: [],
      },
      isAddTableShow: false, // 是否显示添加属性表格
      isLoading: false, // 加载状态
    };
  },
  methods: {
    // 根据分类获取所有属性信息列表
    async getAttrList(attrList) {
      this.isLoading = true;
      // 保存一份便于之后发请求使用
      this.attrList = attrList;
      const result = await this.$API.attr.getAttrInfoList(attrList);
      if (result.code === 200) {
        this.attrInfoList = result.data;
      } else {
        this.$message.error("获取属性信息列表失败");
      }
      this.isLoading = false;
    },
    // 点击修改属性按钮
    edit(row) {
      this.isAddTableShow = true;
      // 为了防止attr变化时直接修改原数据
      this.attr = { ...row };
      // 深度克隆：防止对象中对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(row));
    },
    // 点击添加属性按钮
    addAttr() {
      this.isAddTableShow = true;
      // 清空表单内容
      this.attr.attrName = "";
      this.attr.attrValueList = [];
      this.attr.id = "";
    },
    // 切换span变成input
    switchInput(row) {
      this.$set(row, "edit", true);
      // 让input聚焦
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 切换input变成span
    switchSpan(row, index) {
      const valueName = row.valueName.trim();
      if (!valueName) {
        this.delOneValue(index);
        return;
      }
      row.edit = false;
    },
    // 点击添加属性值按钮
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 删除单个属性值按钮
    delOneValue(index) {
      // 删除这一行就行了，请求在保存时统一发
      this.attr.attrValueList.splice(index, 1);
    },
    // 保存修改的属性值
    async saveAttrList() {
      this.isLoading = true;
      const result = await this.$API.attr.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("保存成功");
        this.isAddTableShow = false;
        this.getAttrList(this.attrList);
      } else {
        this.$message.error("保存失败");
      }
      this.isLoading = false;
    },
    // 清空列表数据
    clearSpuList() {
      this.attrList = {};
      this.attrInfoList = [];
    },
  },
  components: {
    CategorySelector,
  },
  mounted() {
    this.$bus.$on("getList", this.getAttrList);
    this.$bus.$on("clearList", this.clearSpuList);
  },
  // 绑定全局事件总线，在组件卸载时要清除掉
  beforeDestroy() {
    this.$bus.$off("getList", this.getAttrList);
    this.$bus.$off("clearList", this.clearSpuList);
  },
};
</script>

<style lang="sass" scope>
.el-table
  margin: 20px 0
</style>