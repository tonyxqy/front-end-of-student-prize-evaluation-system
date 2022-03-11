<template>
  <!-- header rightbar icon -->
  <div class="h-right d-flex align-items-center mr-5 mr-lg-0 order-1">
    <div class="d-flex">
      <a class="nav-link text-primary collapsed" href="help.html" title="Get Help">
        <i class="icofont-info-square fs-5"></i>
      </a>
      <div class="right-menu">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </div>
    </div>
    <div class="dropdown notifications zindex-popover">
      <a class="nav-link dropdown-toggle pulse" href="#" role="button" data-bs-toggle="dropdown" @click="getmessage">
        <i class="icofont-alarm fs-5"></i>
        <span class="pulse-ring"></span>
      </a>
      <div
        id="NotificationsDiv"
        class="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-sm-end p-0 m-0"
      >
        <div class="card border-0 w380">
          <div class="card-header border-0 p-3">
            <h5 class="mb-0 font-weight-light d-flex justify-content-between">
              <span>消息</span>
              <span class="badge text-white">{{messages.length}}</span>
            </h5>
          </div>
          <div class="tab-content card-body">
            <div class="tab-pane fade show active">
              <ul class="list-unstyled list mb-0">
                <li class="py-2 mb-1 border-bottom" v-for="item in messages" :key="item.id">
                  <a href="javascript:void(0);" class="d-flex">
                    <img
                      class="avatar rounded-circle"
                      src="../../public/assets/images/xs/avatar1.jpg"
                      alt
                    />
                    <div class="flex-fill ms-2">
                      <p class="d-flex justify-content-between mb-0">
                        <span class="font-weight-bold">{{item.sender}}</span>
                      </p>
                      <span class>
                        {{item.message}}
                        <span class="badge bg-success">Review</span>
                      </span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <a class="card-footer text-center border-top-0" href="#">View all notifications</a>
        </div>
      </div>
    </div>
    <div class="dropdown user-profile ml-2 ml-sm-3 d-flex align-items-center zindex-popover">
      <div class="u-info me-2">
        <p class="mb-0 text-end line-height-sm">
          <span class="font-weight-bold">{{stuInfo.name}}</span>
        </p>
        <small>{{stuInfo.id}}</small>
      </div>
      <a
        class="nav-link dropdown-toggle pulse p-0"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        data-bs-display="static"
      >
        <img
          class="avatar lg rounded-circle img-thumbnail"
          src="../../public/assets/images/profile_av.png"
          alt="profile"
        />
      </a>
      <div
        class="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0"
      >
        <div class="card border-0 w280">
          <div class="card-body pb-0">
            <div class="d-flex py-1">
              <img
                class="avatar rounded-circle"
                src="../../public/assets/images/profile_av.png"
                alt="profile"
              />
              <div class="flex-fill ms-3">
                <p class="mb-0">
                  <span class="font-weight-bold">{{stuInfo.name}}</span>
                </p>
                <small class>{{stuInfo.authority}}</small>
              </div>
            </div>
            <div>
              <hr class="dropdown-divider border-dark" />
            </div>
          </div>
          <div class="list-group m-2">
            <router-link to="/Home/hjxxtj" class="list-group-item list-group-item-action border-0">
              <i class="icofont-tasks fs-5 me-3"></i>My Task
            </router-link>
            <router-link
             to="/"
              class="list-group-item list-group-item-action border-0"
            >
              <i class="icofont-logout fs-6 me-3"></i>Signout
            </router-link>
            <div>
              <hr class="dropdown-divider border-dark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Screenfull from "@/components/Screenfull";
export default {
  components: {
    Screenfull
  },
  data: function() {
    return {
      stuInfo: {
        name: "请登录",
        grade: "请登录",
        id: "请登录",
        authority: "未知"
      },

      messages: [
        {
          id: 1,
          updater: "罗浩",
          message: "新增加了一条荣誉分类信息",
          checked: false
        }
      ]
    };
  },
  mounted() {
    if (sessionStorage.getItem("stuInfo")) {
      this.stuInfo = JSON.parse(sessionStorage.getItem("stuInfo"));
      console.log(this.stuInfo);
    }
  },
  methods:{
    getmessage(){
      var that = this;
       axios({
        method: "POST",
        url: "http://47.103.85.74:8111/receiving",
        headers: {
          key: "Content-Type",
          value: "application/json"
        },
        data: {
          recipient:this.$store.state.stuInfo.id
        }
      }).then(response => {
        console.log(response);
        that.messages = response.data.reverse()
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  float: left;
}
.right-menu {
  float: right;
  height: 100%;
  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0.3rem 0rem;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>