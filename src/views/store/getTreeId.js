export default {
  namespaced: true,
  state: {
    treeId: "",
    treeItem: {}
  },
  mutations: {
    setTreeId(state, treeId) {
      state.treeId = treeId;
    },
    treeUpdate(state, tree) {
      state.treeItem = tree;
    }
  }
};
