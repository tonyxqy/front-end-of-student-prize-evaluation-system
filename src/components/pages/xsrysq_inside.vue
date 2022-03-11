<template>
  <div>
    <div
      class="wrap"
      :class="add[ran]"
      :id="item.id"
      @click="dialogVisible=true;Visible=true"
      v-show="!Visible"
    >
      <div class="container" :class="inside[ran]">
        <h1 style="color:white">{{item.jxmc}}</h1>
      </div>
    </div>
    <div class="wrap" v-show="Visible">
      <div class="container" :class="inside[ran]" modal="false">
        <el-dialog
          modal="false"
          modal-append-to-body="false"
          title="详细内容"
          :visible.sync="dialogVisible"
          width="100%"
          :before-close="handleClose"
        >
          <div class="editor-content" v-html="item.rymsxx" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false;Visible=false">取 消</el-button>
            <el-button type="primary" @click="baoming()">确定报名</el-button>
          </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="dialog" width="100%" :before-close="handleClose">
          <el-table
            ref="multipleTable"
            :data="resultList"
            style="width: 100%"
            max-height="250"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="hjrq" label="日期"></el-table-column>
            <el-table-column prop="hdmc" label="活动名称"></el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="upload">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>


<script>
// import Tinymce from "@/components/Tinymce";
// import { SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle,
  delList,
  changestatus
} from "@/api/article";
import axios from "axios";
import { nanoid } from 'nanoid';
class parallaxTiltEffect {
  constructor({ element, tiltEffect }) {
    this.element = element;
    this.start = true;
    this.container = this.element.querySelector(".container");
    console.log(this.container);
    this.size = [300, 360];
    [this.w, this.h] = this.size;
    this.tiltEffect = tiltEffect;
    this.mouseOnComponent = false;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.defaultStates = this.defaultStates.bind(this);
    this.setProperty = this.setProperty.bind(this);
    this.init = this.init.bind(this);
    this.init();
  }
  handleMouseMove(event) {
    const { offsetX, offsetY } = event;
    let X;
    let Y;
    if (this.tiltEffect === "reverse") {
      X = (offsetX - this.w / 2) / 3 / 3;
      Y = -(offsetY - this.h / 2) / 3 / 3;
    } else if (this.tiltEffect === "normal") {
      X = -(offsetX - this.w / 2) / 3 / 3;
      Y = (offsetY - this.h / 2) / 3 / 3;
    }

    this.setProperty("--rY", X.toFixed(2));
    this.setProperty("--rX", Y.toFixed(2));

    this.setProperty("--bY", 80 - (X / 4).toFixed(2) + "%");
    this.setProperty("--bX", 50 - (Y / 4).toFixed(2) + "%");
  }
  handleMouseEnter() {
    this.mouseOnComponent = true;
    this.container.classList.add("container--active");
  }
  handleMouseLeave() {
    this.mouseOnComponent = false;
    this.defaultStates();
  }

  defaultStates() {
    this.container.classList.remove("container--active");
    this.setProperty("--rY", 0);
    this.setProperty("--rX", 0);
    this.setProperty("--bY", "80%");
    this.setProperty("--bX", "50%");
  }

  setProperty(p, v) {
    return this.container.style.setProperty(p, v);
  }

  init() {
    this.element.addEventListener("mousemove", this.handleMouseMove);
    this.element.addEventListener("mouseenter", this.handleMouseEnter);
    this.element.addEventListener("mouseleave", this.handleMouseLeave);
  }
}
export default {
  props: ["item", "deleteitem", "updated"],
  name: "Home",
  title: "Pagination",
  components: {},
  methods: {
    upload() {
      this.dialog = false;
      this.Visible = false;
      var that = this;
      console.log(this.multipleSelection);
      let id = nanoid();
      let jxmclist = [];
      this.multipleSelection.forEach(element => {
        let inside = {
            sign:id,
            xh:this.$store.state.stuInfo.id,
            xm:this.$store.state.stuInfo.name,
            jx:element.hdmc,
            dj:element.jx,
            ry:this.item.jxmc
        }
        console.log(inside);
        console.log(element);
        jxmclist.unshift(inside);
      });
      axios({
        method: "POST",
        url: "http://47.103.85.74:8087/addApplication",
        headers: {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        },
        data: jxmclist
      }).then(response => {
        console.log(response.data);
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          console.log(_);
        })
        .catch(_ => {
          console.log(_);
        });
    },
    baoming() {
      this.dialogVisible = false;
      this.dialog = true;
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
        console.log(response.data);
        response.data.forEach(element => {
          if (element.dqzt == 2) {
            that.resultList.push(element);
          }
        });
        console.log(that.resultList);
      });
    }
  },
  mounted() {
    this.$nextTick(function() {
      const item = document.getElementById(`${this.item.id}`);
      console.log(this.item.id, `${this.item.id}`, item);
      const wrap1 = new parallaxTiltEffect({
        element: item,
        tiltEffect: "reverse"
      });
      console.log(item);
    });
  },
  data() {
    return {
      multipleSelection: [],
      resultList: [],
      dialog: false,
      ran: Math.floor(Math.random() * (2 - 0)) + 0,
      add: ["wrap--1", "wrap--2", "wrap--3"],
      inside: ["container--1", "container--2", "container--3"],
      dialogVisible: false,
      Visible: false
    };
  }
};
</script>
<style lang="scss" scoped>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  --background-color: hsl(180, 20%, 90%);

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  min-height: 100vh;
  padding: 2rem;

  color: hsla(0, 0%, 0%, 0.6);
  background: var(--background-color);
  text-align: center;
}

h1 {
  font-size: 3.2rem;
  padding-top: 2rem;
}

h1 + p {
  font-size: 1.8rem;
  padding: 2rem 0 3rem;
}

.main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.wrap {
  margin: 2rem;

  -webkit-transform-style: preserve-3d;

  transform-style: preserve-3d;
  -webkit-transform: perspective(100rem);
  transform: perspective(100rem);

  cursor: pointer;
}

.container {
  --rX: 0;
  --rY: 0;
  --bX: 50%;
  --bY: 80%;

  width: 30rem;
  height: 36rem;
  border: 1px solid var(--background-color);
  border-radius: 1.6rem;
  padding: 4rem;

  display: flex;
  align-items: flex-end;

  position: relative;
  -webkit-transform: rotateX(calc(var(--rX) * 1deg))
    rotateY(calc(var(--rY) * 1deg));
  transform: rotateX(calc(var(--rX) * 1deg)) rotateY(calc(var(--rY) * 1deg));

  /*background: linear-gradient(hsla(0, 0%, 100%, .1), hsla(0, 0%, 100%, .1)), url("https://images.unsplash.com/photo-1559113513-d5e09c78b9dd?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9");*/
  background: linear-gradient(hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0.1)),
    url("../../../public/assets/img/photo-1559113513-d5e09c78b9dd.jpg");
  background-position: var(--bX) var(--bY);
  background-size: 40rem auto;
  box-shadow: 0 0 3rem 0.5rem hsla(0, 0%, 0%, 0.2);

  transition: -webkit-transform 0.6s 1s;

  transition: transform 0.6s 1s;

  transition: transform 0.6s 1s, -webkit-transform 0.6s 1s;
}

.container::before,
.container::after {
  content: "";

  width: 2rem;
  height: 2rem;
  border: 1px solid #fff;

  position: absolute;
  z-index: 2;

  opacity: 0.3;
  transition: 0.3s;
}

.container::before {
  top: 2rem;
  right: 2rem;

  border-bottom-width: 0;
  border-left-width: 0;
}

.container::after {
  bottom: 2rem;
  left: 2rem;

  border-top-width: 0;
  border-right-width: 0;
}

.container--active {
  transition: none;
}

.container--2 {
  -webkit-filter: hue-rotate(80deg) saturate(140%);
  filter: hue-rotate(80deg) saturate(140%);
}

.container--3 {
  -webkit-filter: hue-rotate(160deg) saturate(140%);
  filter: hue-rotate(160deg) saturate(140%);
}

.container p {
  color: hsla(0, 0%, 100%, 0.6);
  font-size: 2.2rem;
}

.wrap:hover .container::before,
.wrap:hover .container::after {
  width: calc(100% - 4rem);
  height: calc(100% - 4rem);
}
@font-face {
  font-family: "icomoon";
  src: url("../../../public/assets/fonts/icomoon.eot?rretjt");
  src: url("../../../public/assets/fonts/icomoon.eot?#iefixrretjt")
      format("embedded-opentype"),
    url("../../../public/assets/fonts/icomoon.woff?rretjt") format("woff"),
    url("../../../public/assets/fonts/icomoon.ttf?rretjt") format("truetype"),
    url("../../../public/assets/fonts/icomoon.svg?rretjt#icomoon") format("svg");
  font-weight: normal;
  font-style: normal;
}

[class^="icon-"],
[class*=" icon-"] {
  font-family: "icomoon";
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body,
html {
  font-size: 100%;
  padding: 0;
  margin: 0;
}

/* Reset */
*,
*:after,
*:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

/* Clearfix hack by Nicolas Gallagher: http://nicolasgallagher.com/micro-clearfix-hack/ */
.clearfix:before,
.clearfix:after {
  content: " ";
  display: table;
}

.clearfix:after {
  clear: both;
}

body {
  background: #494a5f;
  color: #d5d6e2;
  font-weight: 500;
  font-size: 1.05em;
  font-family: "Microsoft YaHei", "Segoe UI", "Lucida Grande", Helvetica, Arial,
    sans-serif;
}
.htmleaf-links a {
  color: rgba(255, 255, 255, 0.6);
  outline: none;
  text-decoration: none;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}
.htmleaf-links a:hover,
.htmleaf-links a:focus {
  color: #74777b;
  text-decoration: none;
}
.htmleaf-container {
  margin: 0 auto;
}

.bgcolor-1 {
  background: #f0efee;
}
.bgcolor-2 {
  background: #f9f9f9;
}
.bgcolor-3 {
  background: #e8e8e8;
} /*light grey*/
.bgcolor-4 {
  background: #2f3238;
  color: #fff;
} /*Dark grey*/
.bgcolor-5 {
  background: #df6659;
  color: #521e18;
} /*pink1*/
.bgcolor-6 {
  background: #2fa8ec;
} /*sky blue*/
.bgcolor-7 {
  background: #d0d6d6;
} /*White tea*/
.bgcolor-8 {
  background: #3d4444;
  color: #fff;
} /*Dark grey2*/
.bgcolor-9 {
  background: #ef3f52;
  color: #fff;
} /*pink2*/
.bgcolor-10 {
  background: #64448f;
  color: #fff;
} /*Violet*/
.bgcolor-11 {
  background: #3755ad;
  color: #fff;
} /*dark blue*/
.bgcolor-12 {
  background: #3498db;
  color: #fff;
} /*light blue*/
.bgcolor-20 {
  background: #494a5f;
  color: #d5d6e2;
}
/* Header */
.htmleaf-header {
  padding: 1em 190px 1em;
  letter-spacing: -1px;
  text-align: center;
  /*background: #66677c;*/
}
.htmleaf-header h1 {
  color: #333;
  font-weight: 600;
  font-size: 2em;
  line-height: 1;
  margin-bottom: 0;
}
.htmleaf-header h1 span {
  display: block;
  font-size: 60%;
  font-weight: 400;
  padding: 0.8em 0 0.5em 0;
  color: #333;
}
/*nav*/
.htmleaf-demo a {
  color: #fff;
  text-decoration: none;
}
.htmleaf-demo {
  width: 100%;
  padding-bottom: 1.2em;
}
.htmleaf-demo a {
  display: inline-block;
  margin: 0.5em;
  padding: 0.6em 1em;
  border: 3px solid #fff;
  font-weight: 700;
}
.htmleaf-demo a:hover {
  opacity: 0.6;
}
.htmleaf-demo a.current {
  background: #1d7db1;
  color: #fff;
}
/* Top Navigation Style */
.htmleaf-links {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  font-size: 1.5em;
  text-align: center;
}

.htmleaf-links::after {
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -1px;
  width: 2px;
  height: 100%;
  background: #dbdbdb;
  content: "";
  -webkit-transform: rotate3d(0, 0, 1, 22.5deg);
  transform: rotate3d(0, 0, 1, 22.5deg);
}

.htmleaf-icon {
  display: inline-block;
  margin: 0.5em;
  padding: 0em 0;
  width: 1.5em;
  text-decoration: none;
}

.htmleaf-icon span {
  display: none;
}

.htmleaf-icon:before {
  margin: 0 5px;
  text-transform: none;
  font-weight: normal;
  font-style: normal;
  font-variant: normal;
  font-family: "icomoon";
  line-height: 1;
  speak: none;
  -webkit-font-smoothing: antialiased;
}
/* footer */
.htmleaf-footer {
  width: 100%;
  padding-top: 10px;
}
.htmleaf-small {
  font-size: 0.8em;
}
.center {
  text-align: center;
}
/****/
.related {
  color: #fff;
  background: #494a5f;
  text-align: center;
  font-size: 1.25em;
  padding: 0.5em 0;
  overflow: hidden;
}

.related > a {
  vertical-align: top;
  width: calc(100% - 20px);
  max-width: 340px;
  display: inline-block;
  text-align: center;
  margin: 20px 10px;
  padding: 25px;
  font-family: "Microsoft YaHei", "宋体", "Segoe UI", "Lucida Grande", Helvetica,
    Arial, sans-serif, FreeSans, Arimo;
}
.related a {
  display: inline-block;
  text-align: left;
  margin: 20px auto;
  padding: 10px 20px;
  opacity: 0.8;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
  -webkit-backface-visibility: hidden;
  text-decoration: none;
}

.related a:hover,
.related a:active {
  opacity: 1;
}

.related a img {
  max-width: 100%;
  opacity: 0.8;
  border-radius: 4px;
}
.related a:hover img,
.related a:active img {
  opacity: 1;
}
.related h3 {
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 1.2em;
}
.related a h3 {
  font-size: 0.85em;
  font-weight: 300;
  margin-top: 0.15em;
  color: #fff;
}
/* icomoon */
.icon-htmleaf-home-outline:before {
  content: "\e5000";
}

.icon-htmleaf-arrow-forward-outline:before {
  content: "\e5001";
}

@media screen and (max-width: 1024px) {
  .htmleaf-header {
    padding: 2em 10% 2em;
  }
  .htmleaf-header h1 {
    font-size: 1.4em;
  }
  .htmleaf-links {
    font-size: 1.4em;
  }
}

@media screen and (max-width: 960px) {
  .htmleaf-header {
    padding: 2em 10% 2em;
  }
  .htmleaf-header h1 {
    font-size: 1.2em;
  }
  .htmleaf-links {
    font-size: 1.2em;
  }
  .related h3 {
    font-size: 1em;
  }
  .related a h3 {
    font-size: 0.8em;
  }
}

@media screen and (max-width: 766px) {
  .htmleaf-header h1 {
    font-size: 1.3em;
  }
  .htmleaf-links {
    font-size: 1.3em;
  }
}

@media screen and (max-width: 640px) {
  .htmleaf-header {
    padding: 2em 10% 2em;
  }
  .htmleaf-header h1 {
    font-size: 1em;
  }
  .htmleaf-links {
    font-size: 1em;
  }
  .related h3 {
    font-size: 0.8em;
  }
  .related a h3 {
    font-size: 0.6em;
  }
}
</style>

