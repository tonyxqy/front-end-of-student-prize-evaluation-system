<template>
  <div class="row align-items-center">
    <div class="border-0 mb-4">
      <div
        class="card-header p-0 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap"
      >
        <h3 class="fw-bold py-3 mb-0">学生获奖信息提交</h3>
        <div class="d-flex py-2 project-tab flex-wrap w-sm-100">
          <button
            type="button"
            class="btn btn-dark w-sm-100"
            data-bs-toggle="modal"
            data-bs-target="#createproject"
            @click="dialogFormVisible = !dialogFormVisible"
          >
            <i class="icofont-plus-circle me-2 fs-6"></i>Create Project
          </button>
          <ul class="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" data-bs-toggle="tab" href="#All-list" role="tab">所有</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#Started-list" role="tab">已提交</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#Approval-list" role="tab">通过初审</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#Completed-list" role="tab">通过终审</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <mian_body_head_create
      :dialogFormVisible="dialogFormVisible"
      @close="close"
      :updated="updated"
      class="animate__animated animate__pulse animate__slow"
    />
  </div>
</template>

<script>
import "animate.css";
import mian_body_head_create from "./mian_body_head_create";
export default {
  props:['updated'],
  components: {
    mian_body_head_create
  },
  data() {
    return {
      dialogFormVisible: false
    };
  },
  methods: {
    close() {
      this.dialogFormVisible = false;
    }
  }
};
</script>