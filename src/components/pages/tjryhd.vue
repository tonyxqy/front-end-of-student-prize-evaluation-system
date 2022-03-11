<template>
  <div class="components-container">
    <aside>
      <el-form :model="form" label-width="80px">
        <el-form-item style="margin-bottom:10px">
          <el-button type="success" style="float:right;" plain @click="onSubmit">编辑完成并上传</el-button>
        </el-form-item>

        <el-form-item label="荣誉名称" prop="hdmc">
          <el-input v-model="ruleForm.jxmc"></el-input>
        </el-form-item>
      </el-form>
    </aside>
    <div>
      <tinymce v-model="ruleForm.rymsxx" :height="300" />
    </div>
    <div class="editor-content" v-html="ruleForm.rymsxx" />
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
// import { nanoid } from "nanoid";
import axios from "axios";
export default {
  name: "TinymceDemo",
  components: { Tinymce },
  data() {
    return {
      ruleForm: {
        jxmc: "",
        rymsxx: `<h1 style="text-align: center;">Welcome to the TinyMCE demo!</h1>
       <ul>
        <li>这是一个给予TinyMCE开源项目制作而成的富文本编辑器</li>
        <li>他可以一定程度上完成word文档线上编辑的作用</li>
        <li>把word文档中的内容复制上来即可</li>
        <li>但需要注意的是，由于浏览器的安全策略以图片为例的文件，需要点击右上角的upload上传并使用</li>
      </ul>`
      }
    };
  },
  methods: {
    onSubmit() {
      var that = this;
      const submititem = {
        jxmc: this.ruleForm.jxmc,
        rymsxx: this.ruleForm.rymsxx
      };
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      axios({
        method: "POST",
        url: "http://47.103.85.74:8089/classification/post",
        headers: {
          key: "Content-Type",
          value: "application/json"
        },
        data: submititem
      }).then(response => {
        that.$notify({
          title: "添加成功",
          message: `成功添加该荣誉`,
          type: "success",
          duration: 2000
        });
        loading.close();
        console.log(response);
        that.updated();
        const h = this.$createElement;
      });
      axios({
        method: "POST",
        url: "http://47.103.85.74:8111/sendingMessage",
        headers: {
          key: "Content-Type",
          value: "application/json"
        },
        data: {
          sender: this.$store.state.stuInfo.name,
          message: `添加了荣誉${this.ruleForm.jxmc}`,
          recipient: "-1"
        }
      }).then(response => {
        console.log(response);
        that.updated();
      });
    }
  }
};
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>

