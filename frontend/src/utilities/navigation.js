let navigateFn = null;

export const setNavigate = (navigate) => {
  navigateFn = navigate;
};

export const navigate = (to) => {
  if (navigateFn) {
    navigateFn(to);
  }
};
