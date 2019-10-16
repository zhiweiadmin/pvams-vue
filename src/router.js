import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "electricAdsn" */ "./views/loginPage/index.vue")
    },
    {
      // 发电量管理
      path: "/",
      name: "electricAdsn",
      component: () =>
        import(/* webpackChunkName: "electricAdsn" */ "./views/electricAdsn/index.vue")
    },
    {
      // 数据维护
      path: "/userDataMn",
      name: "userDataMn",
      component: () =>
        import(/* webpackChunkName: "userDataMn" */ "./views/userDataMn/index.vue")
    },
    {
      // 预防性维护
      path: "/preventionMn",
      name: "preventionMn",
      component: () =>
        import(/* webpackChunkName: "preventionMn" */ "./views/preventionMn/index.vue")
    },
    {
      // 资产管理-电站
      path: "/assetsAdsn/pStation",
      name: "pStation",
      component: () =>
        import(/* webpackChunkName: "pStation" */ "./views/assetsAdsn/pStation.vue")
    },
    {
      // 资产管理-设备信息
      path: "/assetsAdsn/equipment",
      name: "equipment",
      component: () =>
        import(/* webpackChunkName: "equipment" */ "./views/assetsAdsn/equipment.vue")
    },
    {
      // 资产管理-人员信息
      path: "/assetsAdsn/personnel",
      name: "personnel",
      component: () =>
        import(/* webpackChunkName: "personnel" */ "./views/assetsAdsn/personnel.vue")
    },
    {
      // 维护信息
      path: "/imptMn",
      name: "imptMn",
      component: () =>
        import(/* webpackChunkName: "imptMn" */ "./views/MnInfo/imptMn.vue")
    },
    {
      // 消防器材维护
      path: "/fireEquipmentMn",
      name: "fireEquipmentMn",
      component: () =>
        import(/* webpackChunkName: "fireEquipmentMn" */ "./views/MnInfo/fireEquipmentMn.vue")
    },
    {
      // 安全管理
      path: "/security",
      name: "security",
      component: () =>
        import(/* webpackChunkName: "security" */ "./views/MnInfo/security.vue")
    },
    {
      // 共器具管理
      path: "/toolsImplementsMn",
      name: "toolsImplementsMn",
      component: () =>
        import(/* webpackChunkName: "toolsImplementsMn" */ "./views/MnInfo/toolsImplementsMn.vue")
    },
    {
      // 车辆出行管理
      path: "/carTrip",
      name: "carTrip",
      component: () =>
        import(/* webpackChunkName: "carTrip" */ "./views/MnInfo/carTrip.vue")
    },
    {
      // 备件管理
      path: "/sparePart",
      name: "sparePart",
      component: () =>
        import(/* webpackChunkName: "sparePart" */ "./views/MnInfo/sparePart.vue")
    },
    {
      // 常规数据维护
      path: "/routineDataMn",
      name: "routineDataMn",
      component: () =>
        import(/* webpackChunkName: "routineDataMn" */ "./views/MnInfo/routineDataMn.vue")
    },
    {
      // 备件管理
      path: "/train",
      name: "train",
      component: () =>
        import(/* webpackChunkName: "train" */ "./views/MnInfo/train.vue")
    },
    {
      // 财务模型
      path: "/finance",
      name: "finance",
      component: () =>
        import(/* webpackChunkName: "finance" */ "./views/finance/index.vue")
    },
    {
      // 数据分析
      path: "/dataFinance",
      name: "dataFinance",
      component: () =>
        import(/* webpackChunkName: "dataFinance" */ "./views/dataFinance/index.vue")
    },
    {
      // 用户管理
      path: "/userAdsn",
      name: "userAdsn",
      component: () =>
        import(/* webpackChunkName: "userAdsn" */ "./views/userAdsn/index.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
