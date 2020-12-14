<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    <!-- 添加的弹出框 -->
    <el-dialog
      :title="`${trademarkForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
      <span>
        <el-form
          :model="trademarkForm"
          :rules="rules"
          ref="trademarkForm"
          label-width="100px"
        >
          <el-form-item label="品牌名称" prop="tmName">
            <el-input v-model="trademarkForm.tmName"></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO" prop="logoUrl">
            <!--
              允许跨域：目标服务器地址: 代理配置中 (vue.config.js)
                action="http://182.92.128.115/admin/product/fileUpload"
                
              不允许跨域，就使用proxy
                action="/dev-api/admin/product/fileUpload"
                /dev-api -> request.js 代理
              在main.js中定义 Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API
           -->
            <el-upload
              class="avatar-uploader"
              :action="`${$BASE_API}/admin/product/fileUpload`"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="trademarkForm.logoUrl"
                :src="trademarkForm.logoUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p>只能上传jpg/png文件，且不超过50kb</p>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="records"
      border
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template v-slot="scope">
          <img :src="scope.row.logoUrl" alt="logo" class="trademark_img" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="warning" icon="el-icon-edit" @click="edit(row)"
            >修改</el-button
          >

          <el-button type="danger" icon="el-icon-delete" @click="del(row)"
            >删除</el-button
          >
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
      visible: false, // 弹出框默认隐藏
      loading: false, // 加载中的样式
      // 新增品牌收集数据
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      // 新增品牌表单校验规则
      rules: {
        tmName: [
          {
            required: true,
            // message: "请输入品牌名称",
            // 自定义检验规则
            validator: this.validator,
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌logo" }],
      },
    };
  },
  methods: {
    // 获取品牌数据的方法
    async getTrademarkList(page, limit) {
      this.loading = true;
      const result = await this.$API.trademark.getPageList(page, limit);
      if (result.code === 200) {
        this.$message.success("获取品牌数据成功");
        this.records = result.data.records;
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
      } else {
        this.$message.error("获取品牌数据失败");
        this.loading = false;
      }
      this.loading = false;
    },
    // 自定义表单校验的规则
    validator(rule, value, callback) {
      /** 可以复用
       * rule 校验的字段名
       * value 校验的字段值
       * callback 决定表单校验成功/失败，必须调用
       */
      if (!value) {
        callback(new Error("请输入品牌名称"));
        return;
      } else if (value.length < 2 || value.length > 10) {
        callback(new Error("输入品牌名称的长度应为2-10位"));
        return;
      }
      callback();
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
    handleAvatarSuccess(file) {
      this.trademarkForm.logoUrl = file.data;
    },
    // 点击添加按钮
    add() {
      // 弹出框显示、清空表单内容、清除校验规则
      this.visible = true;
      this.trademarkForm = { tmName: "", logoUrl: "" };
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
    },
    // 点击修改按钮
    edit(row) {
      this.visible = true;
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      // 将当前行的信息赋值给表单
      this.trademarkForm = { ...row };
    },
    // 增加以及修改品牌信息
    submitForm(from) {
      // 校验表单
      this.$refs[from].validate(async (valid) => {
        // 表单验证通过valid为true，失败为false
        if (valid) {
          const { trademarkForm } = this;
          // 校验通过，判断是修改还是删除
          const isUpdate = !!trademarkForm.id;
          let result;
          if (isUpdate) {
            // 如果是修改要判断数据是否有变化
            const record = this.records.find(
              (record) => record.id === trademarkForm.id
            );
            if (
              record.tmName === trademarkForm.tmName &&
              record.logoUrl === trademarkForm.logoUrl
            ) {
              this.$message.warning("不能提交和之前一样的数据");
              return;
            }
            // 如果有变化就发送修改的请求
            result = await this.$API.trademark.updataTrademark(trademarkForm);
          } else {
            // 如果是增加就发送增加品牌信息的请求
            result = await this.$API.trademark.addTrademark(trademarkForm);
          }

          // 请求发送成功提示
          if (result.code === 200) {
            this.$message.success(`${isUpdate ? "修改" : "添加"}品牌数据成功`);
            // 隐藏上传框
            this.visible = false;
            // 重新加载品牌数据列表
            this.getTrademarkList(this.page, this.limit);
          } else {
            this.$message.error(`${isUpdate ? "修改" : "添加"}品牌数据失败`);
          }
        }
      });
    },
    // 删除品牌信息
    del(row) {
      this.$confirm("你确定要删除品牌数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$API.trademark.deleteTrademark(row.id);
          this.$message.success("删除成功!");
          this.getTrademarkList(this.page, this.limit);
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
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

// 上传框
.avatar-uploader .el-upload
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