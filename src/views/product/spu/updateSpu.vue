<template>
  <el-card>
    <el-form
      :model="spu"
      :rules="rules"
      ref="spu"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="SPU名称" prop="spuName">
        <el-input v-model="spu.spuName" placeholder="请输入SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="spuId">
        <el-select v-model="spu.spuId" placeholder="请选择品牌">
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :label="trademark.tmName"
            :value="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          v-model="spu.description"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="spuImg">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :file-list="imgList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- 预览图片 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
        <p>只能上传jpg/png文件，且不超过50kb</p>
      </el-form-item>
      <el-form-item label="销售属性" prop="spuSale">
        <el-select
          v-model="spu.sale"
          :placeholder="`${
            saleAttrList.length
              ? `还有${saleAttrList.length}个未选择`
              : '没有啦~~'
          }`"
        >
          <el-option
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.name"
            :value="saleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!spu.sale"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table
          :data="spuSaleAttrList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template v-slot="{ row }">
              <el-tag
                style="margin-right: 5px"
                v-for="(attrValue, index) in row.spuSaleAttrValueList"
                :key="attrValue.id"
                closable
                @close="delAttrValue(row, index)"
              >
                {{ attrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                style="width: 100px"
                size="mini"
                v-if="row.edit"
                v-model="saleAttrValue"
                ref="input"
                autofocus
                @blur="toButton(row)"
                @keyup.enter.native="toButton(row)"
              ></el-input>
              <el-button
                v-else
                icon="el-icon-plus"
                size="mini"
                @click="toEdit(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delSaleAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('showSpuList')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "UpdateSpu",
  props: ["rowItem"],
  data() {
    return {
      rules: {
        spuName: [
          { required: true, message: "请输入SPU名称", trigger: "blur" },
        ],
        spuId: [{ required: true, message: "请选择品牌" }],
        description: [
          { required: true, message: "请输入SPU描述", trigger: "blur" },
        ],
        spuImg: [{ validator: this.spuImgValidator, required: true }],
        spuSale: [
          {
            validator: this.spuSaleValidator,
            required: true,
            trigger: "submit",
          },
        ],
      },
      spu: this.rowItem,
      spuList: [],
      trademarkList: [], // 所有品牌数据
      imgUrlList: [], // spu图片
      dialogImageUrl: "", // 预览图片
      dialogVisible: false,
      baseSaleAttrList: [], // 所有销售属性列表
      spuSaleAttrList: [], // spu销售属性列表
      saleAttrValue: "", // 新增加的属性值
    };
  },
  computed: {
    // 将图片列表转换为element-ui认识的图片类型
    imgList() {
      return this.imgUrlList.map((img) => {
        return {
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
    // 销售属性还可以选择的列表
    saleAttrList() {
      return this.baseSaleAttrList.filter((saleAttr) => {
        // filter返回id不相同的
        return !this.spuSaleAttrList.find((spuSaleAttr) => {
          // find找到相同的留下来
          return spuSaleAttr.baseSaleAttrId === saleAttr.id;
        });
      });
    },
  },
  methods: {
    // 获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("获取品牌数据成功");
        this.trademarkList = result.data;
      } else {
        this.$message.error("获取品牌数据失败");
      }
    },
    // 获取spu图片
    async getImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("获取图片列表成功");
        this.imgUrlList = result.data;
      } else {
        this.$message.error("获取图片列表失败");
      }
    },
    // 获取所有销售属性列表
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList();
      if (result.code === 200) {
        this.$message.success("获取所有销售属性列表成功");
        this.baseSaleAttrList = result.data;
      } else {
        this.$message.error("获取所有销售属性列表失败");
      }
    },
    // 获取sku销售属性列表
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("获取spu销售属性列表成功");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error("获取spu销售属性列表失败");
      }
    },
    // 上传图片之前校验大小和格式的方法
    beforeAvatarUpload(file) {
      const imgType = ["image/jpeg", "image/jpg", "image/png"];
      const type = imgType.indexOf(file.type) > -1;
      const size = file.size / 1024 < 50;
      if (!type) {
        this.$message.error("上传品牌LOGO只能是 JPG、JPEG、PNG 格式！");
      }
      if (!size) {
        this.$message.error("上传品牌LOGO尺寸不能超过50kb！");
      }
      // 返回true才能上传，false不能上传
      return type && size;
    },
    // 上传成功的回调函数
    handleAvatarSuccess(res, file) {
      this.imgUrlList.push({
        uid: file.uid,
        spuId: this.spu.spuId,
        imgName: file.name,
        imgUrl: res.data,
      });
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 图片自定义校验规则
    spuImgValidator(rule, value, callback) {
      if (this.imgList.length) {
        callback();
        return;
      }
      callback(new Error("至少上传一张图片"));
    },
    // 销售列表自定义校验规则
    spuSaleValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("至少选择一个销售属性"));
        return;
      }
      const isNot = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      );
      if (isNot) {
        callback(new Error("每个销售属性必须有一个属性值"));
        return;
      }
      callback();
    },
    // 删除一个属性值
    delAttrValue(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 添加一个属性值，进入编辑模式
    toEdit(row) {
      this.$set(row, "edit", true);
      // 让input聚焦
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 退出编辑模式
    toButton(row) {
      // 如果去空格后不为空，再数组后添加
      if (this.saleAttrValue.trim() !== "") {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          spuId: row.spuId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValue,
        });
      }
      // 如果去空格后为空，直接退出编辑模式
      this.saleAttrValue = "";
      row.edit = false;
    },
    // 删除一行销售属性
    delSaleAttr(row) {
      this.spuSaleAttrList = this.spuSaleAttrList.filter((sale) => {
        return row.baseSaleAttrId !== sale.baseSaleAttrId;
      });
    },
    // 添加销售属性
    addSaleAttr() {
      const { id, sale } = this.spu; //2257,2
      const newsale = this.baseSaleAttrList.find(
        (saleAttr) => saleAttr.id === sale
      );
      this.spuSaleAttrList.push({
        baseSaleAttrId: newsale.id,
        saleAttrName: newsale.name,
        spuId: id,
        spuSaleAttrValueList: [],
      });
      this.spu.sale = "";
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getImageList();
    this.getBaseSaleAttrList();
    this.getSpuSaleAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

  &:hover
    border-color: #409EFF

.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

.avatar
  width: 178px
  height: 178px
  display: block
</style>
