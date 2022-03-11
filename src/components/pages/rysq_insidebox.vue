<template>
  <transition name="animate_animated  animated_slow" appear>
    <div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
      <div class="card">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mt-5">
            <div class="lesson_name">
              <div class="project-block" :class="classbgc[random]">
                <i :class="classicon[random]"></i>
              </div>
              <span class="small text-muted project_name fw-bold"></span>
              <h6 class="mb-0 fw-bold fs-6 mb-2">{{item.jxmc}}</h6>
            </div>
            <div class="btn-group" role="group" aria-label="Basic outlined example">
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target="#editproject"
                @click="edit"
              >
                <i class="icofont-edit text-success"></i>
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target="#deleteproject"
                @click="deletedialogVisible=!deletedialogVisible"
              >
                <i class="icofont-ui-delete text-danger"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <el-dialog title="评奖评优" width="30%" :visible.sync="dialogTableVisible">
        <el-table :data="rydata">
          <el-table-column prop="xm" label="姓名" width="150"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="tongguo(scope.row)" type="text" size="small">审核通过</el-button>
              <el-button @click="butongguo(scope.row)" type="text" size="small">审核不通过</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="text" @click="dialogTableVisible=!dialogTableVisible;">确定</el-button>
      </el-dialog>

      <el-dialog title="奖项" width="30%" :visible.sync="Visible">
        <el-table :data="jxdata">
          <el-table-column prop="jx" label="奖项" width="150"></el-table-column>
          <el-table-column prop="dj" label="等级" width="150"></el-table-column>
        </el-table>
        <el-button type="text" @click="Visible=!Visible;">确定</el-button>
      </el-dialog>

      <transition
        appear
        name="animate__animated"
        enter-active-class="animate__zoomIn"
        leave-active-class="animate__hinge"
      >
        <el-dialog :visible.sync="deletedialogVisible" width="30%" :before-close="handleClose">
          <div class="modal-header">
            <h5 id="deleteprojectLabel">你确定要删除《{{item.jxmc}}》吗</h5>
          </div>
          <div class="modal-body justify-content-center flex-column d-flex">
            <i class="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
            <p class="mt-4 fs-5 text-center">点击Delete将删除你提交的奖项无论状态</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger color-fff"
              data-bs-dismiss="modal"
              @click="Mydelete"
            >Delete</button>
          </div>
        </el-dialog>
      </transition>
    </div>
  </transition>
</template>
<script>
import axios from "axios";
export default {
  props: ["item", "deleteitem", "updated"],
  data() {
    return {
      Visible: false,
      jxdata: [],
      dialogTableVisible: false,
      rydata: [],
      random: Math.floor(Math.random() * (6 - 0)) + 0,
      classbgc: [
        "light-info-bg",
        "bg-lightgreen",
        "bg-lightyellow",
        "light-success-bg",
        "light-orange-bg",
        "bg-careys-pink",
        "bg-lightblue"
      ],
      classicon: [
        "icofont-paint",
        "icofont-vector-path",
        "icofont-ui-touch-phone",
        "icofont-tick-boxed",
        "icofont-dashboard-web",
        "icofont-site-map",
        "icofont-tasks"
      ],
      flag: false,
      deletedialogVisible: false
    };
  },
  methods: {
    butongguo(row) {
      let asw = {
        sign: row.sign,
        xm: row.xm,
        state: 1
      };
      axios({
        url: "http://47.103.85.74:8087/setState",
        method: "post",
        headers: {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        },
        data: asw
      }).then(result => {
        console.log(result);
      });
    },
    tongguo(row) {
      let asw = {
        sign: row.sign,
        xm: row.xm,
        state: 2
      };
      axios({
        url: "http://47.103.85.74:8087/setState",
        method: "post",
        headers: {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        },
        data: asw
      }).then(result => {
        console.log(result);
      });
    },
    handleClick(row) {
      let as = {
        sign: row.sign,
        xm: row.xm
      };
      // console.log(AsyncLocalStorage);
      axios({
        url: "http://47.103.85.74:8087/getDetail",
        method: "post",
        headers: {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        },
        data: {
          sign: row.sign,
          xm: row.xm
        }
      }).then(result => {
        console.log(result);
        this.jxdata = result.data;
      });
      this.Visible = !this.Visible;
    },
    edit() {
      this.dialogTableVisible = !this.dialogTableVisible;
      axios({
        url: "http://47.103.85.74:8087/getName",
        method: "post",
        headers: {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        },
        data: {
          ry: this.item.jxmc
        }
      }).then(result => {
        console.log(result);
        this.rydata = result.data;
      });
    },
    Mydelete() {
      axios({
        url: "http://47.103.85.74:8089/classification/delete",
        method: "Delete",
        headers: {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        },
        data: {
          jxmc: this.item.jxmc
        }
      });
      this.deletedialogVisible = false;
      this.updated();
    }
  }
};
</script>