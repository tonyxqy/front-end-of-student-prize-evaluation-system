<template>
    <div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
      <div class="card">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mt-5">
            <div class="lesson_name">
              <div class="project-block" :class="classbgc[random]">
                <i :class="classicon[random]"></i>
              </div>
              <span class="small text-muted project_name fw-bold">{{item.xh}}</span>
              <h6 class="mb-0 fw-bold fs-6 mb-2">{{item.hdmc}}</h6>
            </div>
            <div class="btn-group" role="group" aria-label="Basic outlined example">
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target="#editproject"
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
          <div class="d-flex align-items-center">
            <div class="avatar-list avatar-list-stacked pt-2">{{item.xm}}</div>
          </div>
          <div class="row g-2 pt-4">
            <div class="col-6">
              <div class="d-flex align-items-center">
                <i class="icofont-paper-clip"></i>
                <span class="ms-2">奖项：{{item.jx}}</span>
              </div>
            </div>
            <div class="col-6">
              <div class="d-flex align-items-center">
                <i class="icofont-sand-clock"></i>
                <span class="ms-2">年级：{{item.nj}}</span>
              </div>
            </div>
            <div class="col-6">
              <div class="d-flex align-items-center">
                <i class="icofont-group-students"></i>
                <span class="ms-2">提交时间：{{$moment(item.tjsj).format('YYYY-MM-DD')}}</span>
              </div>
            </div>
            <div class="col-6">
              <div class="d-flex align-items-center">
                <i class="icofont-ui-text-chat"></i>
                <span class="ms-2">获奖时间：{{$moment(item.hjsj).format('YYYY-MM-DD')}}</span>
              </div>
            </div>
          </div>
          <div class="dividers-block"></div>
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h4 class="small fw-bold mb-0">当前状态</h4>
            <span class="small light-danger-bg p-1 rounded" v-if="item.dqzt==0">
              <i class="icofont-ui-clock"></i>
              {{(item.dqzt==0)?"已提交":(item.dqzt==1?"通过初审":"通过终审")}}
            </span>
            <span class="small light-warning-bg p-1 rounded" v-if="item.dqzt==1">
              <i class="icofont-ui-clock"></i>
              {{(item.dqzt==0)?"已提交":(item.dqzt==1?"通过初审":"通过终审")}}
            </span>
            <span class="small light-success-bg p-1 rounded" v-if="item.dqzt==2">
              <i class="icofont-tick-boxed"></i>
              {{(item.dqzt==0)?"已提交":(item.dqzt==1?"通过初审":"通过终审")}}
            </span>
          </div>
          <div class="progress" style="height: 8px;">
            <div
              class="progress-bar bg-secondary"
              role="progressbar"
              style="width: 25%"
              aria-valuenow="15"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
            <div
              class="progress-bar bg-secondary ms-1"
              role="progressbar"
              style="width: 25%"
              aria-valuenow="30"
              aria-valuemin="0"
              aria-valuemax="100"
              v-if="item.dqzt>=1"
            ></div>
            <div
              class="progress-bar bg-secondary ms-1"
              role="progressbar"
              style="width: 0%"
              aria-valuenow="30"
              aria-valuemin="0"
              aria-valuemax="100"
              v-else
            ></div>
            <div
              class="progress-bar bg-secondary ms-1"
              role="progressbar"
              style="width: 50%"
              aria-valuenow="10"
              aria-valuemin="0"
              aria-valuemax="100"
              v-if="item.dqzt>=2"
            ></div>
            <div
              class="progress-bar bg-secondary ms-1"
              role="progressbar"
              style="width: 0%"
              aria-valuenow="30"
              aria-valuemin="0"
              aria-valuemax="100"
              v-else
            ></div>
          </div>
        </div>
      </div>
      <transition
        appear
        name="animate__animated"
        enter-active-class="animate__zoomIn"
        leave-active-class="animate__hinge"
      >
        <el-dialog :visible.sync="deletedialogVisible" width="30%" :before-close="handleClose">
          <div class="modal-header">
            <h5 id="deleteprojectLabel">你确定要删除《{{item.hdmc}}》吗</h5>
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
</template>
<script>
import axios from "axios";
export default {
  props: ["item", "deleteitem","updated"],
  data() {
    return {
      random:Math.floor(Math.random() * (6 - 0)) + 0,
      classbgc:["light-info-bg","bg-lightgreen","bg-lightyellow","light-success-bg","light-orange-bg","bg-careys-pink","bg-lightblue"],
      classicon:["icofont-paint","icofont-vector-path","icofont-ui-touch-phone","icofont-tick-boxed","icofont-dashboard-web","icofont-site-map","icofont-tasks"],
      flag: false,
      deletedialogVisible: false
    };
  },
  methods: {
    Mydelete() {
      axios({
        url: "http://47.103.85.74:8088/application/delete",
        method: "Delete",
        headers: {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        },
        data: {
          id: this.item.id
        }
      });
      this.deletedialogVisible = false;
      this.updated()
    }
  }
};
</script>