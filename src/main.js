import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./views/store/index.js";
import ElementUI, { Message } from "element-ui";
import "@/assets/css/base.css";
import "element-ui/lib/theme-chalk/index.css";
// import { Loading } from 'element-ui';
// const options = {};
import { Jurisdiction } from "@/config/juonConfig";

Vue.use(ElementUI);
Vue.prototype.$Jurisdiction = Jurisdiction;
/* eslint-disable prettier/prettier */
window.axios.defaults.headers.common['Token'] = "";
window.axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push({name: "login"});
  } else {
    config.headers.Token = token;
  }
  return config;
}, function (err) {
  return Promise.reject(err);
});
window.axios.interceptors.response.use((response) => {
  const { data } = response;
  // let loadingInstance = Loading.service(options);
    if (data && data.code == 200) {
      // loadingInstance.close();
      return response;
    } else if (data && data.code == 401) {
      // loadingInstance.close();
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("token");
      router.push({ name: "login" }); // 跳登录页
      return response;
    } else if (data && data.code === 405) {
      Message({type: "warning", message: data.message})
      return Promise.reject(response);
    } else {
      // loadingInstance.close();
      Message({type: "error", message: `请求失败：` + data.code + "-" + data.message})
      return Promise.reject(response)
    }
   
  }, (error) => {
    if (error.message == "Network Error") {
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("token");
      // loadingInstance.close();
      router.push({name: "login"}); // 跳登录页
    } else {
      if (error.message.includes("timeout")) {
        // loadingInstance.close();
        Message({type: "error", message: "网络异常，请刷新重试！"});
      } else {
        // loadingInstance.close();
        Message({type: "error", message: "请刷新重试！"});
      }
    }
    return Promise.reject(error);
  });

  Vue.config.productionTip = false;
  new Vue({
    router,
    store,
    render: h => h(App),
    created() {
      this.$store.commit("getTreeId/setTreeId", 1);
    },
  }).$mount("#app");