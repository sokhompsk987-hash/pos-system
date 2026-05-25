// File: src/store/profileStore.js

export const profileStore = {
  // This getState function perfectly matches what your backend team wrote
  getState: () => {
    return {
      // We still smartly get the token from the browser's storage
      token: localStorage.getItem('token') || ""
    };
  }
};