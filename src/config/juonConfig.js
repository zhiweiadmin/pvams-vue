// 权限方法
const Jurisdiction = (name = '') => {
  const arr = localStorage.getItem('permissions');
  const JurisdictionArr = window.JurisdictionArr || arr || [];
  return JurisdictionArr.includes(name);
};

export { Jurisdiction };