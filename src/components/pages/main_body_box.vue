<template>
  <div class="col-lg-12 col-md-12 flex-column">
    <div class="tab-content mt-4">
      <div class="tab-pane fade show active" id="All-list">
        <div class="row g-3 gy-5 py-3 row-deck">
          <main_body_box_insidebox
            v-for="item in Started_list"
            :key="item.id"
            :item="item"
            :updated="updated"
          />
          <main_body_box_insidebox
            v-for="item in Approval_list"
            :key="item.id"
            :item="item"
            :updated="updated"
          />
          <main_body_box_insidebox
            v-for="item in Completed_list"
            :key="item.id"
            :item="item"
            :updated="updated"
          />
        </div>
      </div>
      <div class="tab-pane fade" id="Started-list">
        <div class="row g-3 gy-5 py-3 row-deck">
          <main_body_box_insidebox
            v-for="item in Started_list"
            :key="item.id"
            :item="item"
            :updated="updated"
          />
        </div>
      </div>
      <div class="tab-pane fade" id="Approval-list">
        <div class="row g-3 gy-5 py-3 row-deck">
          <main_body_box_insidebox
            v-for="item in Approval_list"
            :key="item.id"
            :item="item"
            :updated="updated"
          />
        </div>
      </div>
      <div class="tab-pane fade" id="Completed-list">
        <div class="row g-3 gy-5 py-3 row-deck">
          <main_body_box_insidebox
            v-for="item in Completed_list"
            :key="item.id"
            :item="item"
            :updated="updated"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import main_body_box_insidebox from "./main_body_box_insidebox";
export default {
  props: ["Started_list", "Approval_list", "Completed_list", "updated"],

  components: {
    main_body_box_insidebox
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  },
  mounted() {}
};
</script>