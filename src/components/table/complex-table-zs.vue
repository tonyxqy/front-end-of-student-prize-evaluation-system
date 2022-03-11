<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="模糊查询"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.years"
        placeholder="获奖年份"
        clearable
        style="width: 130px"
        class="filter-item"
      >
        <el-option v-for="item in years" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="奖项等级"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.level"
        placeholder="审核情况"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in tags" :key="item.key" :label="item" :value="item" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        style="background-color: #484c7f;border-color:#484c7f margin-left:10px"
      >显示所有</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;background-color: #484c7f;border-color:#484c7f"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >Add</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        style="background-color: #484c7f;border-color:#484c7f"
      >Export</el-button>
      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left:15px;"
        @change="tableKey=tableKey+1"
      >reviewer</el-checkbox>
    </div>

    <el-table
      @selection-change="handleSelectionChange"
      :key="id"
      v-loading="listLoading"
      :data="tables"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:10px"
      :default-sort="{prop: 'id', order: 'descending'}"
    >
      <el-table-column
        label="学生学号"
        prop="id"
        sortable
        align="center"
        width="150"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.xh }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="date" label="获奖日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ $moment(row.hjrq).format('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.hdmc }}</span>
          <el-tag>{{ row.jx | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{$moment(row.tjsj).format('YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.dqzt | statusFilter">{{ row.dqzt==0?'等待初审':row.dqzt==1?'初审通过':'终审通过' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="350"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="openpic(row.wb)">查看证明材料</el-button>
          <el-button v-if="row.dqzt=='2'" size="mini" type="success" disabled>审核通过</el-button>
          <el-button
            v-if="row.dqzt=='0'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,row.id,row.xh)"
          >等待初审</el-button>
          <el-button
            v-if="row.dqzt=='1'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,row.id,row.xh)"
          >等待终审</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,row.id)"
          >审核否决</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog title="获奖信息创建" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="学号" prop="xh">
          <el-input v-model="ruleForm.xh"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="ruleForm.xm"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="xm">
          <el-input v-model="ruleForm.nj"></el-input>
        </el-form-item>
        <el-form-item label="活动名称" prop="hdmc">
          <el-input v-model="ruleForm.hdmc"></el-input>
        </el-form-item>
        <el-form-item label="奖项等级" prop="jxdj">
          <el-select v-model="ruleForm.jx" placeholder="请选择奖项等级">
            <el-option label="一等奖" value="一等奖"></el-option>
            <el-option label="二等奖" value="二等奖"></el-option>
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
          <el-button @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="editor-container" v-show="false">
        <markdown-editor
          ref="markdownEditor"
          v-model="content"
          :language="language"
          height="400px"
        />
      </div>
      <div class="component-item">
        <el-button v-waves icon="el-icon-document" @click="getHtml">查看证明材料</el-button>
      </div>
      <div v-html="html" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle,
  delList,
  changestatus
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import MarkdownEditor from "@/components/MarkdownEditor";
import axios from "axios";
import { nanoid } from "nanoid";

const calendarTypeOptions = [
  { key: "一等奖", display_name: "一等奖" },
  { key: "二等奖", display_name: "二等奖" },
  { key: "三等奖", display_name: "三等奖" },
  { key: "鼓励奖", display_name: "鼓励奖" },
  { key: "其他", display_name: "其他" }
];
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination, MarkdownEditor },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  computed: {
    language() {
      return this.languageTypeList["zh"];
    },
    tables() {
      if (
        this.listQuery.title == null &&
        this.listQuery.type == null &&
        this.listQuery.level == null &&
        this.listQuery.years == null
      ) {
        return this.list;
      }
      if (
        this.listQuery.title == null &&
        this.listQuery.type == null &&
        this.listQuery.level == null &&
        this.listQuery.years == ""
      ) {
        return this.list;
      }
      if (
        this.listQuery.title == "" &&
        this.listQuery.type == null &&
        this.listQuery.level == null &&
        this.listQuery.years == null
      ) {
        return this.list;
      }
      console.log(
        this.listQuery.title,
        this.listQuery.type,
        this.listQuery.level,
        this.listQuery.years
      );
      const item = this.listQuery.title;
      const type = this.listQuery.type;
      const level = this.tags.findIndex(i => i == this.listQuery.level);
      const year = this.listQuery.years;
      if (item || type || level || year) {
        console.log(level == -1);
        return this.list.filter(data => {
          if (level == -1) {
            if (!year) {
              if (item || type)
                return Object.keys(data).some(key => {
                  return String(data[key]).indexOf(item || type) > -1;
                });
            } else {
              if (item || type)
                return (
                  Object.keys(data).some(key => {
                    return String(data[key]).indexOf(item || type) > -1;
                  }) && data.hjrq.slice(0, 4) == year
                );
              else {
                return data.hjrq.slice(0, 4) == year;
              }
            }
          } else {
            if (!year) {
              if (item || type)
                return (
                  Object.keys(data).some(key => {
                    return String(data[key]).indexOf(item || type) > -1;
                  }) && data.dqzt == level
                );
              else {
                return data.dqzt == level;
              }
            } else {
              if (item || type)
                return (
                  Object.keys(data).some(key => {
                    return String(data[key]).indexOf(item || type) > -1;
                  }) &&
                  data.dqzt == level &&
                  data.hjrq.slice(0, 4) == year
                );
              else {
                return data.dqzt == level && data.hjrq.slice(0, 4) == year;
              }
            }
          }
        });
      }
      return this.list;
    },
    total() {
      return this.tables.length;
    }
  },
  data() {
    return {
      edit: true,
      ruleForm: {
        id: "",
        nj: "",
        xh: "",
        xm: "",
        hdmc: "",
        hjsj: new Date(),
        jx: "",
        wb: ``,
        tjsj: new Date(),
        dqzt: 0
      },
      html: "",
      content: "",
      languageTypeList: {
        en: "en_US",
        zh: "zh_CN",
        es: "es_ES"
      },
      tags: ["已提交", "初审通过", "终审通过"],
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        level: undefined,
        years: undefined
      },
      dialogVisible: false,
      years: ["2022", "2021", "2020"],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,

      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published"
      },

      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },

      dialogPvVisible: false,
      pvData: [],

      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },

      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  watch: {
    "listQuery.level"() {
      if (this.tags.findIndex(i => i == this.listQuery.level) == -1) {
        this.listLoading = true;
        this.list = [];
        console.log("______________++++++++++++++");
        fetchList({ dqzt: 0 }).then(response => {
          this.list.push.apply(this.list, response.data);
          console.log(this.list);
        });
        fetchList({ dqzt: 1 }).then(response => {
          this.list.push.apply(this.list, response.data);
          console.log(this.list);
        });
        fetchList({ dqzt: 2 }).then(response => {
          this.list.push.apply(this.list, response.data);
          this.listLoading = false;
          console.log(this.list);
        });
      } else {
        this.listLoading = true;
        let data = {
          dqzt: this.tags.findIndex(i => i == this.listQuery.level)
        };
        fetchList(data).then(response => {
          this.list = response.data;
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000);
        });
      }
    }
  },
  methods: {
    getHtml() {
      this.html = null;
      this.edit = false;
      this.html = this.$refs.markdownEditor.getHtml();
      console.log(this.html);
    },
    openpic(wb) {
      this.content = wb;
      this.html = null;
      this.dialogVisible = true;
      console.log(wb);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          console.log(_);
          done();
        })
        .catch(_ => {
          console.log(_);
        });
    },
    getList() {
      this.listLoading = true;
      fetchList({ dqzt: 1 }).then(response => {
        this.list = response.data;
        this.listQuery.level = "初审通过";
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
          console.log(this.list);
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.title = null;
      this.listQuery.years = null;
      this.listQuery.type = null;
      this.listQuery.level = null;
    },
    handleModifyStatus(row, rowid,rowxh) {
      let data = {
        id: rowid,
        dqzt: 2
      };
      changestatus(data);
      this.$notify({
        title: "终审成功",
        message: `已经审核通过`,
        type: "success",
        duration: 2000
      });
      this.list.splice(this.list.findIndex(v => v.id === rowid), 1);
      var that = this;
      axios({
        method: "POST",
        url: "http://47.103.85.74:8111/sendingMessage",
        headers: {
          key: "Content-Type",
          value: "application/json"
        },
        data: {
          sender: this.$store.state.stuInfo.name,
          message: `申请终审通过`,
          recipient: rowxh
        }
      }).then(response => {
        console.log(response);
        that.updated();
      });
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      console.log(order);
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.ruleForm = row;
      this.dialogFormVisible = true;
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row, rowid, rowxh) {
      let data = {
        id: rowid
      };
      delList(data);
      this.$notify({
        title: "否决成功",
        message: `已经否决`,
        type: "success",
        duration: 2000
      });

      this.list.splice(this.list.findIndex(v => v.id === rowid), 1);
      var that = this;
      axios({
        method: "POST",
        url: "http://47.103.85.74:8111/sendingMessage",
        headers: {
          key: "Content-Type",
          value: "application/json"
        },
        data: {
          sender: this.$store.state.stuInfo.name,
          message: `申请被否决`,
          recipient: rowxh
        }
      }).then(response => {
        console.log(response);
        that.updated();
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "学号",
          "姓名",
          "获奖日期",
          "活动名称",
          "奖项",
          "当前状态-0为已提交，1为待审核，2为审核通过"
        ];
        const filterVal = ["xh", "xm", "hjrq", "hdmc", "jx", "dqzt"];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === "hjrq") {
            return this.$moment(v[j]).format("YYYY-MM-DD");
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function(key) {
      console.log(key);
    },
    onSubmit() {
      this.dialogFormVisible = false;
      var that = this;
      if (this.ruleForm.id != "") {
        const submititem = {
          id: this.ruleForm.id,
          xh: this.ruleForm.xh,
          xm: this.ruleForm.xm,
          nj: this.ruleForm.nj,
          hdmc: this.ruleForm.hdmc,
          hjrq: this.ruleForm.hjsj,
          jx: this.ruleForm.jx,
          wb: this.ruleForm.wb,
          tjsj: this.ruleForm.tjsj,
          dqzt: this.ruleForm.dqzt
        };
        axios({
          method: "put",
          url: "http://47.103.85.74:8088/application/update",
          headers: {
            key: "Content-Type",
            value: "application/json"
          },
          data: submititem
        }).then(response => {
          that.getList();
          console.log(response);
          this.$notify({
            title: "Success",
            message: "Update Successfully",
            type: "success",
            duration: 2000
          });
          var that = this;
          axios({
            method: "POST",
            url: "http://47.103.85.74:8111/sendingMessage",
            headers: {
              key: "Content-Type",
              value: "application/json"
            },
            data: {
              sender: this.$store.state.stuInfo.name,
              message: `申请被否决`,
              recipient: "root"
            }
          }).then(response => {
            console.log(response);
            that.updated();
          });
        });
      } else {
        const submititem = {
          id: nanoid(),
          xh: this.ruleForm.xh,
          xm: this.ruleForm.xm,
          nj: this.ruleForm.nj,
          hdmc: this.ruleForm.hdmc,
          hjrq: this.ruleForm.hjsj,
          jx: this.ruleForm.jx,
          wb: this.ruleForm.wb,
          tjsj: this.ruleForm.tjsj,
          dqzt: 2
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
      }
    }
  }
};
</script>
<style >
.te-md-splitter {
  width: 100% !important;
}
.editor-container {
  margin-bottom: 30px;
}
.tag-title {
  margin-bottom: 5px;
}
</style>