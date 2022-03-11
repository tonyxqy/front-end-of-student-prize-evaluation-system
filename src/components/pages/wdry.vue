<template>
  <div class="col-lg-12 col-md-12 flex-column">
    <div class="tab-content mt-4">
      <div class="tab-pane fade show active">
        <div class="row g-3 gy-5 py-3 row-deck">
          <wdry_inside v-for="item in result_list" :key="item.id" :item="item" :updated="updated" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import wdry_inside from "./wdry_inside";
import axios from "axios";

export default {
  components: {
    wdry_inside
  },
  data() {
    return {
      result_list: []
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    updated() {
      var that = this;
      axios({
        method: "post",
        url: "http://47.103.85.74:8087/getAll",
        headers: {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        },
        data: { xh: this.$store.state.stuInfo.id }
      }).then(response => {
        that.result_list = response.data;
        console.log(that.result_list);
      });
    }
  },
  mounted() {
    this.updated();
  }
};
</script>