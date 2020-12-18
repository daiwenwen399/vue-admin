<template>
  <div>
    <el-card>
      <el-table :data="skuList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>

        <el-table-column prop="skuName" label="名称"> </el-table-column>

        <el-table-column prop="skuDesc" label="描述"> </el-table-column>

        <el-table-column
          prop="skuDefaultImg"
          label="默认图片"
          width="150"
          align="center"
        >
          <template v-slot="{ row }">
            <img :src="row.skuDefaultImg" style="width: 80px" alt="商品图片" />
          </template>
        </el-table-column>

        <el-table-column prop="weight" label="重量(KG)" width="150">
        </el-table-column>

        <el-table-column prop="price" label="价格(元)" width="80">
        </el-table-column>

        <el-table-column label="操作" width="250" align="center">
          <template v-slot="{ row }">
            <el-button
              type="success"
              icon="el-icon-bottom"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="openDrawer(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>

        <!-- 分页器 -->
        <el-pagination
          layout="prev, pager, next,jumper,sizes,total"
          :current-page="page"
          :page-size.sync="limit"
          :page-sizes="[3, 6, 9]"
          :total="total"
          @size-change="getSkuList(page, $event)"
          @current-change="getSkuList($event, limit)"
          class="trademark_pagination"
        >
        </el-pagination>
      </el-table>
    </el-card>

    <!-- 抽屉区 -->
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ sku.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ sku.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ sku.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="skuAttrValue in sku.skuAttrValueList"
            :key="skuAttrValue.id"
            style="margin-right: 5px"
            >{{ skuAttrValue.attrId }} - {{ skuAttrValue.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="skuSaleAttrValue in sku.skuSaleAttrValueList"
            :key="skuSaleAttrValue.id"
            style="margin-right: 5px"
            >{{ skuSaleAttrValue.id }} -
            {{ skuSaleAttrValue.saleAttrValueId }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel trigger="click" height="400px">
            <el-carousel-item
              v-for="skuImage in sku.skuImageList"
              :key="skuImage.id"
            >
              <img :src="skuImage.imgUrl" style="width: 400px; height: 400px" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      skuList: [],
      drawer: false, // 抽屉的状态
      sku: {},
    };
  },
  methods: {
    // 获取首页数据
    async getSkuList(page, limit) {
      const result = await this.$API.sku.getSkuPageList(page, limit);
      if (result.code === 200) {
        this.$message.success("获取分页数据成功");
        this.skuList = result.data.records;
        this.total = result.data.total;
        this.page = result.data.current;
        this.limit = result.data.size;
      } else {
        this.$message.error("获取分页数据失败");
      }
    },
    // 获取sku数据
    async openDrawer(row) {
      this.drawer = true;
      const result = await this.$API.sku.getSkuInfo(row.id);
      if (result.code === 200) {
        this.$message.success("获取sku数据成功");
        this.sku = result.data;
      } else {
        this.$message.error("获取sku数据失败");
      }
    },
    /* category3Id: 236
      id: 1301
      isSale: 1
      price: 220
      skuAttrValueList: null
      skuDefaultImg: "http://182.92.128.115:8080/group1/M00/00/AC/rBFUDF_YHXeAKpurAAA_eWGKVhY764.jpg"
      skuDesc: "↵小新牌四件套~~~·超可爱"
      skuImageList: null
      skuName: " 小新牌四件套~~~"
      skuSaleAttrValueList: null
      spuId: 2257
      tmId: 5953
      weight: "10.00" */
  },
  mounted() {
    this.getSkuList(this.page, this.limit);
  },
};
</script>

<style lang="sass" scoped>
>>>.el-form-item__label
  width: 150px

>>>.el-drawer__body
  .el-row
    height: 40px
    .el-col
      line-height: 40px
      &.el-col-5
        font-size: 18px
        font-weight: bold
        text-align: right
        margin-right: 20px
</style>