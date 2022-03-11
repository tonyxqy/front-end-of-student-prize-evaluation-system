<template>
  <div class="container-xxl">
    <main_body_head :updated="updated"></main_body_head>
    <div class="row align-items-center">
      <div class="col-lg-12 col-md-12 flex-column">
        <main_body_box
          :Started_list="Started_list"
          :Approval_list="Approval_list"
          :Completed_list="Completed_list"
          :updated="updated"
        ></main_body_box>
      </div>
    </div>
  </div>
</template>
<script>
import main_body_box from "./main_body_box";
import main_body_head from "./main_body_head";
import axios from "axios";

export default {
  components: {
    main_body_box,
    main_body_head
  },
  mounted() {
    this.id = this.$store.state.stuInfo.id;
    var that = this;
    axios({
      method: "POST",
      url: "http://47.103.85.74:8088/application/select",
      headers: {
        key: "Content-Type",
        value: "application/json",
        type: "text"
      },
      data: { xh: this.$store.state.id }
    }).then(response => {
      that.resultList = response.data;
      that.resultList.forEach(value => {
        console.log(value);
        console.log(value.dqzt);
        switch (value.dqzt) {
          case 0:
            that.Started_list.push(value);
            break;
          case 1:
            that.Approval_list.push(value);
            break;
          case 2:
            that.Completed_list.push(value);
        }
      });
      console.log(that.resultList);
    });
  },
  methods: {
    updated() {
      this.id = this.$store.state.stuInfo.id;
      var that = this;
      axios({
        method: "POST",
        url: "http://47.103.85.74:8088/application/select",
        headers: {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        },
        data: { xh: this.$store.state.id }
      }).then(response => {
        that.resultList = response.data;
        that.Started_list = [];
        that.Approval_list = [];
        that.Completed_list = [];
        that.resultList.forEach(value => {
          switch (value.dqzt) {
            case 0:
              that.Started_list.push(value);
              break;
            case 1:
              that.Approval_list.push(value);
              break;
            case 2:
              that.Completed_list.push(value);
          }
        });
        console.log(that.resultList);
      });
    }
  },
  data: function() {
    return {
      Started_list: [
  
      ],
      Approval_list: [
      
      ],
      Completed_list: [
       
      ]
    };
  }
};
</script>