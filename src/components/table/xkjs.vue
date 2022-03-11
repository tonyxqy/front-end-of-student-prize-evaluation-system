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
        v-model="listQuery.maj"
        placeholder="认定等级"
        clearable
        style="width: 130px"
        class="filter-item"
      >
        <el-option v-for="item in maj" :key="item" :label="item" :value="item" />
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
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        style="background-color: #484c7f;border-color:#484c7f"
      >Export</el-button>
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
        label="奖项名称"
        prop="id"
        sortable
        align="center"
        width="150"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.hdmc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖项" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jx }}</span>
        </template>
      </el-table-column>

      <el-table-column label="认定级别" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.rdjb }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分值" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.fz }}</span>
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
    <el-dialog title="用户创建" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="学号" prop="xh">
          <el-input v-model="ruleForm.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="xm">
          <el-input v-model="ruleForm.grade"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="hdmc">
          <el-input v-model="ruleForm.major"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="hdmc">
          <el-input v-model="ruleForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="修改权限" prop="hdmc">
          <el-button type="danger" plain @click="dialog=!dialog">修改权限</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, delList, changestatus,getxkfl} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import MarkdownEditor from "@/components/MarkdownEditor";
import axios from "axios";
import { nanoid } from "nanoid";


// arr to obj, such as { CN : "China", US : "USA" }


export default {
  name: "ComplexTable",
  components: { Pagination },
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
  },
  computed: {
    tables() {
      if (
        this.listQuery.title == null &&
        this.listQuery.type == null &&
        this.listQuery.maj == null
      ) {
        return this.list;
      }
      if (
        this.listQuery.title == null &&
        this.listQuery.type == null &&
        this.listQuery.maj == ""
      ) {
        return this.list;
      }
      if (
        this.listQuery.title == "" &&
        this.listQuery.type == null &&
        this.listQuery.maj == null
      ) {
        return this.list;
      }
      console.log(
        this.listQuery.title,
        this.listQuery.type,
        this.listQuery.maj
      );
      const item = this.listQuery.title;
      const type = this.listQuery.type;
      const maj = this.listQuery.maj;
      if (item || type || maj) {
        return this.list.filter(data => {
          if (item || type || maj)
            return Object.keys(data).some(key => {
              return String(data[key]).indexOf(item || type || maj) > -1;
            });
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
      create: false,
      formLabelWidth: "180px",
      loading: false,
      edit: true,
      ruleForm: {
        id: "",
        name: "",
        sex: "",
        password: "",
        major: "",
        grade: "",
        authority: {
          applyAdd: 0,
          modifyPersonalInfo: 0,
          modifyOtherInfo: 0,
          auditCommand: 0,
          auditPass: 0,
          bulkImport: 0,
          readRwardInfo: 0,
          award: 0,
          courseContestsLoading: 0
        }
      },
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        maj: undefined
      },
      maj: ["A", "B", "C"],
      dialogFormVisible: false,
      dialogStatus: "",
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  watch: {},
  methods: {
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
      getxkfl().then(response => {
        this.list = response.data;
        setTimeout(() => {
          this.listLoading = false;
          console.log(this.list);
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.title = null;
      this.listQuery.maj = null;
      this.listQuery.type = null;
    },
    handleModifyStatus(row, rowid) {
      let data = {
        id: rowid,
        dqzt: 1
      };
      changestatus(data);
      this.$notify({
        title: "初审成功",
        message: `已经审核通过`,
        type: "success",
        duration: 2000
      });
      this.list.splice(this.list.findIndex(v => v.id === rowid), 1);
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    handleCreate() {
      this.ruleForm.id = "";
      this.ruleForm.name = "";
      this.ruleForm.sex = "";
      this.ruleForm.major = "";
      this.ruleForm.password = "";
      this.create = true;
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.ruleForm = row;
      this.dialogFormVisible = true;
    },
    handleDelete(row, rowid) {
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
    },
    // handleDownload() {
    //   this.downloadLoading = true;
    //   import("@/vendor/Export2Excel").then(excel => {
    //     const tHeader = [
    //       "学号",
    //       "姓名",
    //       "获奖日期",
    //       "活动名称",
    //       "奖项",
    //       "当前状态-0为已提交，1为待审核，2为审核通过"
    //     ];
    //     const filterVal = ["xh", "xm", "hjrq", "hdmc", "jx", "dqzt"];
    //     const data = this.formatJson(filterVal);
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: "table-list"
    //     });
    //     this.downloadLoading = false;
    //   });
    // },
    // formatJson(filterVal) {
    //   return this.list.map(v =>
    //     filterVal.map(j => {
    //       if (j === "hjrq") {
    //         return this.$moment(v[j]).format("YYYY-MM-DD");
    //       } else {
    //         return v[j];
    //       }
    //     })
    //   );
    // },
    getSortClass: function(key) {
      console.log(key);
    },
    // onSubmit() {
    //   console.log(this.ruleForm);
    //   this.dialogFormVisible = false;
    //   var that = this;
    //   //   grade: this.ruleForm.grade,
    //   //   password: this.ruleForm.password,
    //   if (!this.create) {
    //     const submititem = {
    //       id: this.ruleForm.id,
    //       name: this.ruleForm.name,
    //       sex: this.ruleForm.sex,
    //       major: this.ruleForm.major,
    //       applyAdd: this.ruleForm.authority.applyAdd,
    //       modifyPersonalInfo: this.ruleForm.authority.modifyPersonalInfo,
    //       modifyOtherInfo: this.ruleForm.authority.modifyOtherInfo,
    //       auditCommand: this.ruleForm.authority.auditCommand,
    //       auditPass: this.ruleForm.authority.auditPass,
    //       bulkImport: this.ruleForm.authority.bulkImport,
    //       readRwardInfo: this.ruleForm.authority.readRwardInfo,
    //       award: this.ruleForm.authority.award,
    //       courseContestsLoading: this.ruleForm.authority.courseContestsLoading
    //     };
    //     axios({
    //       method: "put",
    //       url: "http://47.103.85.74:8081/stuInfo/update",
    //       headers: {
    //         key: "Content-Type",
    //         value: "application/json"
    //       },
    //       data: submititem
    //     }).then(response => {
    //       that.getList();
    //       console.log(response);
    //       this.$notify({
    //         title: "Success",
    //         message: "authority update Successfully",
    //         type: "success",
    //         duration: 2000
    //       });
    //     });
    //   } else {
    //     const submititem = {
    //       id: this.ruleForm.id,
    //       name: this.ruleForm.name,
    //       sex: this.ruleForm.sex,
    //       major: this.ruleForm.major,
    //       applyAdd: this.ruleForm.authority.applyAdd,
    //       modifyPersonalInfo: this.ruleForm.authority.modifyPersonalInfo,
    //       modifyOtherInfo: this.ruleForm.authority.modifyOtherInfo,
    //       auditCommand: this.ruleForm.authority.auditCommand,
    //       auditPass: this.ruleForm.authority.auditPass,
    //       bulkImport: this.ruleForm.authority.bulkImport,
    //       readRwardInfo: this.ruleForm.authority.readRwardInfo,
    //       award: this.ruleForm.authority.award,
    //       courseContestsLoading: this.ruleForm.authority.courseContestsLoading
    //     };
    //     const user = {
    //       username: this.ruleForm.name,
    //       password: this.ruleForm.password,
    //       authority: "student"
    //     };
    //     axios({
    //       method: "post",
    //       url: "http://47.103.85.74:8080/register",
    //       headers: {
    //         key: "Content-Type",
    //         value: "application/json"
    //       },
    //       data: user
    //     }).then(response => {
    //       that.getList();
    //       console.log(response);
    //       this.$notify({
    //         title: "Success",
    //         message: "authority added Successfully",
    //         type: "success",
    //         duration: 2000
    //       });
    //     });
    //     axios({
    //       method: "post",
    //       url: "http://47.103.85.74:8081/stuInfo/register",
    //       headers: {
    //         key: "Content-Type",
    //         value: "application/json"
    //       },
    //       data: submititem
    //     }).then(response => {
    //       that.getList();
    //       console.log(response);
    //       this.$notify({
    //         title: "Success",
    //         message: "authority added Successfully",
    //         type: "success",
    //         duration: 2000
    //       });
    //     });
    //   }
    // }
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