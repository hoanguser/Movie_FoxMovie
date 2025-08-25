import { createSlice } from "@reduxjs/toolkit";
import { keysLocalStorage, localStorageUtil } from "../../util/localStorage";

const initialState = {
  infoUser: localStorageUtil.get(keysLocalStorage.INFO_USER),
  listUser: [], // Thêm mảng quản lý danh sách user
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setInfoUserAction: (state, { payload }) => {
      state.infoUser = payload;
    },
    setLogoutAction: (state) => {
      state.infoUser = null;
      localStorageUtil.remove(keysLocalStorage.INFO_USER);
    },
    setListUserAction: (state, { payload }) => {
      state.listUser = payload;
    },
    addUserAction: (state, { payload }) => {
      state.listUser = [payload, ...state.listUser];
    },
    editUserAction: (state, { payload }) => {
      state.listUser = state.listUser.map((user) =>
        user.taiKhoan === payload.taiKhoan ? payload : user
      );
    },
    deleteUserAction: (state, { payload }) => {
      state.listUser = state.listUser.filter(
        (user) => user.taiKhoan !== payload
      );
    },
  },
});

export const {
  setInfoUserAction,
  setLogoutAction,
  setListUserAction,
  addUserAction,
  editUserAction,
  deleteUserAction,
} = userSlice.actions;

export default userSlice.reducer;
