<template>
  <el-card>
    <el-form
      :model="sku"
      :rules="rules"
      ref="sku"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="SPU名称" prop="spuName"
        >{{ spu.spuName }}
      </el-form-item>

      <el-form-item label="SKU名称" prop="skuName">
        <el-input v-model="sku.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          v-model="sku.price"
          controls-position="right"
          placeholder="SKU价格"
          :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          v-model="sku.weight"
          controls-position="right"
          placeholder="SKU价格"
          :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="规则描述" prop="description">
        <el-input
          type="textarea"
          v-model="sku.description"
          placeholder="SKU规则描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性" prop="attrList">
        <div
          class="skulist-select-container"
          v-for="attr in attrList"
          :key="attr.id"
          style="margin: 0 0 10px 60px"
        >
          <span>{{ attr.attrName }}</span>
          <el-select v-model="sku.attrName" placeholder="请输入">
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="attrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="销售属性" prop="saleAttrList">
        <div
          class="skulist-select-container"
          v-for="sale in saleAttrList"
          :key="sale.id"
          style="margin: 0 0 10px 30px"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-select v-model="sku.saleAttrName" placeholder="请输入">
            <el-option
              v-for="saleValue in sale.spuSaleAttrValueList"
              :key="saleValue.id"
              :label="saleValue.saleAttrValueName"
              :value="saleValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="图片列表" prop="imgList">
        <el-table :data="imgList" border style="width: 100%; margin: 20px 0">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="imgUrl" label="图片" width="200">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"> </el-table-column>
          <el-table-column label="操作" width="200">
            <template>
              <el-button type="primary" size="mini">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "AddSku",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem, // 传过来的spu数据
      sku: {}, // 收集到的数据
      attrList: [], // 平台属性数据
      saleAttrList: [], // 销售属性数据
      imgList: [], // 图片列表
      rules: {},
      category: {},
    };
  },
  methods: {
    // 获取平台属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this.spu;
      const result = await this.$API.attr.getAttrInfoList({
        category1Id,
        category2Id,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取平台属性数据成功");
        this.attrList = result.data;
      } else {
        this.$message.error("获取平台属性数据失败");
      }
    },
    // 获取销售属性数据
    async getSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("获取销售属性数据成功");
        this.saleAttrList = result.data;
      } else {
        this.$message.error("获取销售属性数据失败");
      }
    },
    // 获取图片列表
    async getImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("获取图片列表成功");
        this.imgList = result.data;
      } else {
        this.$message.error("获取图片列表失败");
      }
    },
  },
  mounted() {
    this.getAttrList();
    this.getSaleAttrList();
    this.getImageList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left

.skulist-select-container
  display: inline-block
  margin-right: 20px
</style>
