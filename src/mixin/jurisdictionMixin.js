const jurisdiction = {
  data() {
    return {
      exampleLoading: "",
    };
  },
  methods: {
    loadingOpen() {
      this.exampleLoading = this.$loading({
        lock: true,
        text: '正在加载....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });
    },
    loadingClose() {
      this.exampleLoading && this.exampleLoading.close();
    },
    getUserJurisdiction(name) {
      return this.$Jurisdiction(name);
    },
  },
};

export default jurisdiction;