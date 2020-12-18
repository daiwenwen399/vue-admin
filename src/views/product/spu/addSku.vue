<template>
  <el-card>
    <el-form
      :model="sku"
      :rules="rules"
      ref="skuForm"
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

      <el-form-item label="规则描述" prop="skuDesc">
        <el-input
          type="textarea"
          v-model="sku.skuDesc"
          placeholder="SKU规则描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性" prop="skuAttrValueList">
        <el-form-item
          :label="attr.attrName"
          v-for="(attr, index) in attrList"
          :key="attr.id"
          class="skulist-select-container"
        >
          <el-select
            placeholder="请输入"
            v-model="sku.skuAttrValueList[index]"
            @change="clearValidate('skuAttrValueList')"
          >
            <el-option
              v-for="value in attr.attrValueList"
              :key="value.id"
              :label="value.valueName"
              :value="`${attr.id}-${value.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>

      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <el-form-item
          :label="sale.saleAttrName"
          v-for="(sale, index) in saleAttrList"
          :key="sale.id"
          class="skulist-select-container"
        >
          <el-select
            v-model="sku.skuSaleAttrValueList[index]"
            placeholder="请输入"
            @change="clearValidate('skuSaleAttrValueList')"
          >
            <el-option
              v-for="saleValue in sale.spuSaleAttrValueList"
              :key="saleValue.id"
              :label="saleValue.saleAttrValueName"
              :value="saleValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>

      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          :data="imgList"
          border
          style="width: 100%; margin: 20px 0"
          @selection-change="selectionChange"
          row-key="id"
        >
          <el-table-column type="selection" width="55" reserve-selection>
          </el-table-column>
          <el-table-column label="图片" width="200">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"> </el-table-column>
          <el-table-column label="操作" width="200">
            <template v-slot="{ row }">
              <el-button
                v-show="!row.isDefault"
                type="primary"
                size="mini"
                @click="changeDefault(row.id)"
                >设为默认</el-button
              >
              <el-tag v-show="row.isDefault" type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button
          @click="
            $emit('skuToSpuList', {
              category1Id: spu.category1Id,
              category2Id: spu.category2Id,
              category3Id: spu.category3Id,
            })
          "
          >取消</el-button
        >
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
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      }, // 收集到的数据
      attrList: [], // 平台属性数据
      saleAttrList: [], // 销售属性数据
      imgList: [], // 图片列表
      rules: {
        skuName: [
          { required: true, message: "请输入sku名称", trigger: "change" },
        ],
        price: [{ required: true, message: "请输入价格" }],
        weight: [{ required: true, message: "请输入重量" }],
        skuDesc: [
          { required: true, message: "请输入规则描述", trigger: "change" },
        ],
        skuAttrValueList: [
          {
            required: true,
            validator: this.attrListValidator,
          },
        ],
        skuSaleAttrValueList: [
          {
            required: true,
            validator: this.saleAttrListValidator,
          },
        ],
        skuImageList: [
          {
            required: true,
            validator: this.skuImageListValidator,
          },
        ],
      },

      test: {
        category3Id: 0, //
        id: 0, //
        isSale: 0, //
        price: 0, //
        skuAttrValueList: [
          {
            attrId: 0,
            id: 0,
            skuId: 0,
            valueId: 0,
          },
        ], //
        skuDefaultImg: "string",
        skuDesc: "string", //
        skuImageList: [
          {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          },
        ], //
        skuName: "string", //
        skuSaleAttrValueList: [
          {
            id: 0,
            saleAttrValueId: 0,
            skuId: 0,
            spuId: 0,
          },
        ], //
        spuId: 0, //
        tmId: 0, //
        weight: "string", //
      },
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
    // 选择或改变默认图片
    changeDefault(id) {
      // 先把所有的图片都变为未选中默认状态，再把当前点击的变为默认状态
      this.imgList = this.imgList.map((img) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });

      this.sku.skuImageList = this.sku.skuImageList.map((img) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
    },
    // 当勾选多选框时
    selectionChange(imgList) {
      this.sku.skuImageList = imgList;
    },
    // 平台属性自定义校验规则
    attrListValidator(rule, value, callback) {
      const {
        attrList,
        sku: { skuAttrValueList },
      } = this;
      if (
        // 选择的列表长度和原列表长度一致
        skuAttrValueList.length !== attrList.length
        // 当只选择最后一个时，前面都是undefined，还要判断不为undefined
      ) {
        callback(new Error("必须选择所有属性"));
        return;
      }
      callback();
    },
    // 销售属性自定义校验规则
    saleAttrListValidator(rule, value, callback) {
      const {
        saleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      if (skuSaleAttrValueList.length !== saleAttrList.length) {
        callback(new Error("必须选择所有属性"));
      }
      callback();
    },
    // 图片表格自定义校验规则
    skuImageListValidator(rule, value, callback) {
      const {
        sku: { skuImageList },
      } = this;
      if (skuImageList.length === 0) {
        callback(new Error("至少选择一张图片"));
      }
      // 遍历图片数组，判断是否有选默认图片
      if (!skuImageList.find((img) => img.isDefault)) {
        callback(new Error("请选择一张默认图片"));
      }
      callback();
    },
    // 当某个选项被选择时，清空校验规则
    clearValidate(prop) {
      this.$refs.skuForm.clearValidate(prop);
    },
    // 保存
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          // 收集数据
          const { category3Id, tmId, id: spuId } = this.spu;
          const { spu, sku } = this;

          const skuAttrValueList = sku.skuAttrValueList.map((attr) => {
            const [attrId, valueId] = attr.split("-");
            return {
              attrId,
              valueId,
            };
          });

          const skuSaleAttrValueList = sku.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );

          const skuDefaultImg = sku.skuImageList.find((img) => img.isDefault)
            .imgUrl;

          // 发送保存请求
          const result = await this.$API.sku.saveSku({
            ...this.sku,
            spuId,
            category3Id,
            tmId,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuDefaultImg,
          });

          if (result.code === 200) {
            this.$message.success("保存成功");
            this.$emit("skuToSpuList", {
              category1Id: spu.category1Id,
              category2Id: spu.category2Id,
              category3Id: spu.category3Id,
            });
          } else {
            this.$message.error("保存失败");
          }
        }
      });
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

>>>.el-input-number .el-input__inner
  text-align: left

.skulist-select-container
  display: inline-block
  width: 30%
  margin-bottom: 10px
</style>
