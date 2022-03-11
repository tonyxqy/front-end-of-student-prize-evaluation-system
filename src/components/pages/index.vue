<template>
  <div class="container-xxl">
    <div class="row align-items-center">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="welcome_area">
              <div class="welcome_text">
                <h1>
                  欢迎
                  <span>使用</span>
                  <br />评奖评优系统
                </h1>
                <p>本系统将服务广大师生对自己的荣誉信息进行管理和评审</p>
                 <p>账号密码等问题请联系管理员</p>
              </div>
              <div class="welcome_button">
                <a href="#" class="common_btn">联系管理员</a>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="header_img">
              <img src="../../images/slider/2.png" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Muli:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&amp;subset=latin-ext,vietnamese");

body,
html {
  margin: 0;
  padding: 0;
}
body {
  line-height: 30px;
  color: #929292;
  letter-spacing: 0;
  font-size: 19px;
  font-family: "Muli", sans-serif;
  font-weight: 400;
  overflow-x: hidden;
  transition: all ease 400ms;
  -webkit-transition: all ease 400ms;
  -moz-transition: all ease 400ms;
}

body.bg_right {
  background: url(../../images/bg/1.png) no-repeat right top;
}
/*------------------------------------------------------------------------------
/ 2. Typography Settings
------------------------------------------------------------------------------*/
h1,
h2,
h3,
h4,
h5,
h6 {
  color: #222222;
  font-weight: 300;
  margin: 0 0 15px;
}
button:focus {
  outline: none;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  -moz-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield !important;
}

a {
  color: #222222;
  text-decoration: none;
  transition: all ease 400ms;
  -webkit-transition: all ease 400ms;
  -moz-transition: all ease 400ms;
}
a:hover,
a:focus {
  text-decoration: none;
  outline: 0;
}
a:focus {
  color: #fff;
}
ul li {
  margin: 0;
  padding: 0;
  list-style: none;
}

/*------------------------------------------------------------------------------
/ 3. Section Title Settings
------------------------------------------------------------------------------*/
.noPadding {
  padding: 0;
}
.noPaddingRight {
  padding-right: 0;
}
.noPaddingLeft {
  padding-left: 0;
}

/*------------------------------------------------------------------------------
/ 4. Button Settings
------------------------------------------------------------------------------*/
.common_btn {
  border: none;
  font-size: 17px;
  font-weight: 700;
  background: #8180e0;
  color: #fff;
  height: 55px;
  text-align: center;
  padding: 20px 46.1px;
  display: inline-block;
  line-height: 0.8;
  letter-spacing: 0;
  position: relative;
  border-radius: 3px;
  z-index: 1;
  cursor: pointer;
  outline: none;
  transition: all 0.4s ease-out;
  -moz-transition: all 0.4s ease-out;
  -webkit-transition: all 0.4s ease-out;
  -ms-transition: all 0.4s ease-out;
  -o-transition: all 0.4s ease-out;
}
.common_btn::after {
  background: #222222;
  border-radius: 3px;
  bottom: 0;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  transform: scale(0);
  -moz-transform: scale(0);
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transition: all 0.2s linear 0s;
  -moz-transition: all 0.2s linear 0s;
  -webkit-transition: all 0.2s linear 0s;
  -ms-transition: all 0.2s linear 0s;
  -o-transition: all 0.2s linear 0s;
  width: 100%;
  z-index: -1;
}
.common_btn:hover::after {
  transform: scale(1);
  -moz-transform: scale(1);
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
}
.common_btn:hover {
  color: #fff;
}

/*------------------------------------------------------------------------------
/ 5. Section Settings
------------------------------------------------------------------------------*/
.commonSection {
  padding: 85px 0 96px;
  position: relative;
}
.commonSection .container {
  position: relative;
  z-index: 2;
}
.grays {
  background: #f8f8fb;
}
.sec_title {
  font-size: 48px;
  line-height: 60px;
  font-weight: 300;
  color: #222222;
  margin: 0 0 30px;
}
.sec_desc {
  margin: 0 0 85px;
}
.white {
  color: #ffffff;
}
.color_aaa {
  color: #aaaaaa;
}
</style>