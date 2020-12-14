<template>
  <div>
    <!-- 分类选择器 -->
    <el-card>
      <el-form inline :model="attrList">
        <el-form-item label="一级分类">
          <el-select
            v-model="attrList.category1Id"
            placeholder="请选择"
            :disabled="disabled"
            @change="getCategory(2, $event)"
          >
            <el-option
              v-for="c1 in category1List"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="attrList.category2Id"
            placeholder="请选择"
            :disabled="disabled"
            @change="getCategory(3, $event)"
          >
            <el-option
              v-for="c2 in category2List"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="attrList.category3Id"
            placeholder="请选择"
            :disabled="disabled"
            @change="getAttrList"
          >
            <el-option
              v-for="c3 in category3List"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  props: ["disabled"],
  data() {
    return {
      attrList: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  methods: {
    // 获取分类列表的数据
    async getCategory(index, id) {
      // 当点击一级列表和二级列表时，三级列表都要清空
      if (index >= 2) {
        this.attrList.category3Id = "";
        this.category3List = [];
      }
      // 如果点击的是一级列表，二级列表也要清空
      if (index === 2) {
        this.attrList.category2Id = "";
        this.category2List = [];
      }
      // 根据列表和点击的id发送请求
      const result = await this.$API.attr[`getCategory${index}`](id);
      if (result.code === 200) {
        this[`category${index}List`] = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 点击三级分类时，要触发父组件获取属性信息的方法
    getAttrList() {
      this.$bus.$emit("getList", this.attrList);
    },
  },
  mounted() {
    this.getCategory(1);
  },
};
</script>

<style lang="sass" scoped>
.el-card
  margin-bottom: 20px
</style>
