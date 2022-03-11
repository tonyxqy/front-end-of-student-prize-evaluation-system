<template>
  <transition name="animate_animated" appear>
    <el-dialog title="获奖信息创建" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="活动名称" prop="hdmc">
          <el-select
            v-model="ruleForm.hdmc"
            filterable
            allow-create
            default-first-option
            placeholder="活动名称"
          >
            <el-option v-for="item in options" :key="item.index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="奖项等级" prop="jxdj">
          <el-select
            v-model="ruleForm.jx"
            filterable
            allow-create
            default-first-option
            placeholder="奖项等级"
            @focus="getlevel"
            :loading="loading"
          >
            <el-option v-for="item in jxoptions" :key="item.index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获奖时间" required>
          <el-col :span="11">
            <el-form-item prop="hjsj">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.hjsj"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="奖项描述" prop="desc">
          <div class="editor-container">
            <markdown-editor
              v-show="edit"
              ref="markdownEditor"
              v-model="ruleForm.wb"
              :language="language"
              height="400px"
            />
          </div>
          <el-button
            v-show="edit"
            style="margin-top:10px;"
            type="primary"
            icon="el-icon-document"
            @click="getHtml"
            v-waves
          >奖状描述编辑完成</el-button>
          <el-button
            v-show="!edit"
            type="primary"
            icon="el-icon-document"
            @click="edit=true"
            v-waves
          >编辑奖状描述</el-button>
          <div v-html="html" />
          <!-- <el-input type="textarea" v-model="ruleForm.wb"></el-input> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="closedia">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </transition>
</template>
<script>
import MarkdownEditor from "@/components/MarkdownEditor";
import { nanoid } from "nanoid";
import axios from "axios";
export default {
  components: { MarkdownEditor },
  props: ["dialogFormVisible", "updated"],
  data() {
    return {
      jxoptions: [],
      options: [],
      edit: true,
      html: "",
      languageTypeList: {
        en: "en_US",
        zh: "zh_CN",
        es: "es_ES"
      },
      flag: false,
      ruleForm: {
        hdmc: "",
        hjsj: new Date(),
        jx: "",
        wb: ``,
        tjsj: new Date(),
        dqzt: 0
      },
      dialogTableVisible: false,
      formLabelWidth: "320px"
    };
  },
  computed: {
    language() {
      return this.languageTypeList["zh"];
    }
  },
  methods: {
    getlevel() {
      axios({
        method: "POST",
        url: "http://47.103.85.74:8111/getRewardGrade",
        headers: {
          key: "Content-Type",
          value: "application/json"
        },
        data: {
          name: this.ruleForm.hdmc
        }
      }).then(response => {
        console.log(response);
        this.jxoptions = response.data;
      });
    },

    onSubmit() {
      this.dialogFormVisible = false;
      var that = this;
      this.$emit("close");
      const submititem = {
        id: nanoid(),
        xh: this.$store.state.stuInfo.id,
        xm: this.$store.state.stuInfo.name,
        nj: parseInt(this.$store.state.stuInfo.grade),
        hdmc: this.ruleForm.hdmc,
        hjrq: this.ruleForm.hjsj,
        jx: this.ruleForm.jx,
        wb: this.ruleForm.wb,
        tjsj: this.ruleForm.tjsj,
        dqzt: this.ruleForm.dqzt
      };
      axios({
        method: "POST",
        url: "http://47.103.85.74:8088/application/insert",
        headers: {
          key: "Content-Type",
          value: "application/json"
        },
        data: submititem
      }).then(response => {
        console.log(response);
        that.updated();
      });
    },
    getHtml() {
      this.html = this.$refs.markdownEditor.getHtml();
      console.log(this.html);
      this.edit = false;
    },
    closedia() {
      this.dialogFormVisible = false;
      this.$emit("close");
    }
  },
  mounted() {
    axios({
      method: "get",
      url: "http://47.103.85.74:8111/getRewardName",
      headers: {
        key: "Content-Type",
        value: "application/json"
      }
    }).then(response => {
      console.log(response.data);
      this.options = response.data;
    });
  }
};
</script><style>
.editor-container {
  margin-bottom: 30px;
}
.tag-title {
  margin-bottom: 5px;
}
/* .te-preview{
  width:100% !important
} */
.tui-editor .te-md-splitter {
  width: 100% !important;
}
</style>
