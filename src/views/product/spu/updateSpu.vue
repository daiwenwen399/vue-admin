<template>
  <el-card>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item prop="name" label="SPU名称">
        <el-input
          v-model="ruleForm.name"
          placeholder="请输入SPU名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择品牌">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="ruleForm.desc"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="delivery">
        <el-upload
          class="avatar-uploader"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :show-file-list="false"
        >
          <!-- :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload" -->
          <img v-if="false" :src="trademarkForm.logoUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="销售属性" prop="type">
        <el-select v-model="ruleForm.region" placeholder="还有3个未选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table
          v-loading="loading"
          :data="spuList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
          <el-table-column prop="description" label="SPU描述">
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
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "UpdateSpu",
  data() {
    return {
      ruleForm: {},
      rules: {},
    };
  },
};
</script>

<style lang="less" scoped>
</style>
