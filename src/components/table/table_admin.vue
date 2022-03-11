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
        placeholder="专业"
        clearable
        style="width: 130px"
        class="filter-item"
      >
        <el-option v-for="item in maj" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="性别"
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
        label="学/工号"
        prop="id"
        sortable
        align="center"
        width="150"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-select v-model="ruleForm.pos" placeholder="角色"></el-select>
      <el-table-column label="姓名" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
          <el-tag>{{ row.sex | typeFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="专业" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="grade" label="年级" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{row.grade}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="350"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="handleUpdate_password(row) ">修改密码</el-button>
          <el-button size="mini" type="primary" @click="handleUpdate(row) ">修改信息</el-button>
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
        <el-form-item label="修改密码" prop="hdmc">
          <el-button type="danger" plain @click="dialogVisible=!dialogVisible">修改密码</el-button>
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

    <el-drawer
      title="权限修改!"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" style="margin-left:20px">
          <el-form-item label="权限_添加申请" :label-width="formLabelWidth">
            <el-radio v-model="ruleForm.authority.applyAdd" label="0" style="margin-left:10px">不允许</el-radio>
            <el-radio v-model="ruleForm.authority.applyAdd" label="1">允许</el-radio>
          </el-form-item>
          <el-form-item label="权限_修改个人申请信息" :label-width="formLabelWidth">
            <el-radio
              v-model="ruleForm.authority.modifyPersonalInfo"
              label="0"
              style="margin-left:10px"
            >不允许</el-radio>
            <el-radio v-model="ruleForm.authority.modifyPersonalInfo" label="1">允许</el-radio>
          </el-form-item>
          <el-form-item label="权限_修改他人申请信息" :label-width="formLabelWidth">
            <el-radio
              v-model="ruleForm.authority.modifyOtherInfo"
              label="0"
              style="margin-left:10px"
            >不允许</el-radio>
            <el-radio v-model="ruleForm.authority.modifyOtherInfo" label="1">允许</el-radio>
          </el-form-item>
          <el-form-item label="权限_审核意见" :label-width="formLabelWidth">
            <el-radio
              v-model="ruleForm.authority.auditCommand"
              label="0"
              style="margin-left:10px"
            >不允许</el-radio>
            <el-radio v-model="ruleForm.authority.auditCommand" label="1">允许</el-radio>
          </el-form-item>
          <el-form-item label="权限_通过审核" :label-width="formLabelWidth">
            <el-radio v-model="ruleForm.authority.auditPass" label="0" style="margin-left:10px">不允许</el-radio>
            <el-radio v-model="ruleForm.authority.auditPass" label="1">允许</el-radio>
          </el-form-item>
          <el-form-item label="权限_批量导入" :label-width="formLabelWidth">
            <el-radio v-model="ruleForm.authority.bulkImport" label="0" style="margin-left:10px">不允许</el-radio>
            <el-radio v-model="ruleForm.authority.bulkImport" label="1">允许</el-radio>
          </el-form-item>
          <el-form-item label="权限_查阅获奖信息" :label-width="formLabelWidth">
            <el-radio
              v-model="ruleForm.authority.readRwardInfo"
              label="0"
              style="margin-left:10px"
            >不允许</el-radio>
            <el-radio v-model="ruleForm.authority.readRwardInfo" label="1">允许</el-radio>
          </el-form-item>
          <el-form-item label="权限_评奖评优" :label-width="formLabelWidth">
            <el-radio v-model="ruleForm.authority.award" label="0" style="margin-left:10px">不允许</el-radio>
            <el-radio v-model="ruleForm.authority.award" label="1">允许</el-radio>
          </el-form-item>
          <el-form-item label="权限_录入学科竞赛分类表" :label-width="formLabelWidth">
            <el-radio
              v-model="ruleForm.authority.courseContestsLoading"
              label="0"
              style="margin-left:10px"
            >不允许</el-radio>
            <el-radio v-model="ruleForm.authority.courseContestsLoading" label="1">允许</el-radio>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="dialog=!dialog" style="margin-left:40px">确定</el-button>
        </div>
      </div>
    </el-drawer>

    <el-dialog title="密码修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span slot="footer" class="dialog-footer">
        <el-form :model="form" label-width="80px">
          <el-form-item label="密码" prop="hdmc">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatepassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, delList, changestatus, getuser } from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import MarkdownEditor from "@/components/MarkdownEditor";
import axios from "axios";
import { nanoid } from "nanoid";

const calendarTypeOptions = [
  { key: "男", display_name: "男" },
  { key: "女", display_name: "女" }
];
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

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
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
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
      dialog: false,
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
      dialogVisible: false,
      maj: ["CS", "ZK", "WA"],
      calendarTypeOptions,
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
      getuser().then(response => {
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
    handleUpdate_password(row) {
      this.ruleForm = row;
      this.dialogVisible = true;
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
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["hdmc", "jx", "rdjb", "fz"];
        const filterVal = ["hdmc", "jx", "rdjb", "fz"];
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
    updatepassword() {
      this.dialogVisible = false;
      const user = {
        username: this.ruleForm.id,
        password: this.ruleForm.password
      };var that = this
      axios({
        method: "put",
        url: "http://47.103.85.74:8080/user/update",
        headers: {
          key: "Content-Type",
          value: "application/json"
        },
        data: user
      }).then(response => {
        that.getList();
        console.log(response);
        this.$notify({
          title: "Success",
          message: "password Successfully",
          type: "success",
          duration: 2000
        });
      });
    },
    onSubmit() {
      console.log(this.ruleForm);
      this.dialogFormVisible = false;
      var that = this;
      //   grade: this.ruleForm.grade,
      //   password: this.ruleForm.password,
      if (!this.create) {
        const submititem = {
          id: this.ruleForm.id,
          name: this.ruleForm.name,
          sex: this.ruleForm.sex,
          major: this.ruleForm.major,
          applyAdd: this.ruleForm.authority.applyAdd,
          modifyPersonalInfo: this.ruleForm.authority.modifyPersonalInfo,
          modifyOtherInfo: this.ruleForm.authority.modifyOtherInfo,
          auditCommand: this.ruleForm.authority.auditCommand,
          auditPass: this.ruleForm.authority.auditPass,
          bulkImport: this.ruleForm.authority.bulkImport,
          readRwardInfo: this.ruleForm.authority.readRwardInfo,
          award: this.ruleForm.authority.award,
          courseContestsLoading: this.ruleForm.authority.courseContestsLoading
        };
        const user = {
          username: this.ruleForm.id,
          password: this.ruleForm.password
        };
        axios({
          method: "put",
          url: "http://47.103.85.74:8080/user/update",
          headers: {
            key: "Content-Type",
            value: "application/json"
          },
          data: user
        }).then(response => {
          that.getList();
          console.log(response);
          this.$notify({
            title: "Success",
            message: "password Successfully",
            type: "success",
            duration: 2000
          });
        });
        axios({
          method: "put",
          url: "http://47.103.85.74:8081/stuInfo/update",
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
            message: "authority update Successfully",
            type: "success",
            duration: 2000
          });
        });
      } else {
        const submititem = {
          id: this.ruleForm.id,
          name: this.ruleForm.name,
          sex: this.ruleForm.sex,
          major: this.ruleForm.major,
          applyAdd: this.ruleForm.authority.applyAdd,
          modifyPersonalInfo: this.ruleForm.authority.modifyPersonalInfo,
          modifyOtherInfo: this.ruleForm.authority.modifyOtherInfo,
          auditCommand: this.ruleForm.authority.auditCommand,
          auditPass: this.ruleForm.authority.auditPass,
          bulkImport: this.ruleForm.authority.bulkImport,
          readRwardInfo: this.ruleForm.authority.readRwardInfo,
          award: this.ruleForm.authority.award,
          courseContestsLoading: this.ruleForm.authority.courseContestsLoading
        };
        const user = {
          username: this.ruleForm.id,
          password: this.ruleForm.password,
          authority: "student"
        };
        axios({
          method: "post",
          url: "http://47.103.85.74:8080/user/register",
          headers: {
            key: "Content-Type",
            value: "application/json"
          },
          data: user
        }).then(response => {
          that.getList();
          console.log(response);
          this.$notify({
            title: "Success",
            message: "authority added Successfully",
            type: "success",
            duration: 2000
          });
        });
        axios({
          method: "post",
          url: "http://47.103.85.74:8081/stuInfo/register",
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
            message: "authority added Successfully",
            type: "success",
            duration: 2000
          });
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