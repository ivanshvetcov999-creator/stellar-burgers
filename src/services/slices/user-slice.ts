import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  type TRegisterData,
  type TLoginData,
} from '@utils/burger-api';
import { setCookie, deleteCookie } from '@utils/cookie';

import type { TUser } from '@utils-types';

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response.user;
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const forgotPasswordUser = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);

export const resetPasswordUser = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);
    return response;
  }
);

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isSuccessRegistration: boolean;
  isSuccessForgotPassword: boolean;
  isSuccessResetPassword: boolean;
  isLoading: boolean;
  error: Error | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isSuccessRegistration: false,
  isSuccessForgotPassword: false,
  isSuccessResetPassword: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked(state) {
      state.isAuthChecked = true;
    },
    clearError(state) {
      state.error = null;
    },
    clearResetPasswordSuccess(state) {
      state.isSuccessResetPassword = false;
    },
    clearForgotPasswordSuccess(state) {
      state.isSuccessForgotPassword = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccessRegistration = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.isSuccessRegistration = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccessRegistration = false;
        if (action.error.message === 'User already exists') {
          state.error = new Error('Данный пользователь уже зарегистрирован');
        } else {
          state.error = new Error(action.error.message ?? 'Ошибка регистрации');
        }
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        if (action.error.message === 'email or password are incorrect') {
          state.error = new Error('Неверный логин или пароль');
        } else {
          state.error = new Error(action.error.message ?? 'Ошибка входа');
        }
      })

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.error = null;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = new Error(action.error.message ?? 'Ошибка обновления профиля');
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.isSuccessRegistration = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = new Error(action.error.message ?? 'Ошибка выхода');
      })

      .addCase(forgotPasswordUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccessForgotPassword = false;
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccessForgotPassword = true;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = new Error(action.error.message ?? 'Ошибка');
        state.isSuccessForgotPassword = false;
      })

      .addCase(resetPasswordUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccessResetPassword = false;
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccessResetPassword = true;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = new Error(action.error.message ?? 'Ошибка');
        state.isSuccessResetPassword = false;
      });
  },
});

export const {
  authChecked,
  clearError,
  clearResetPasswordSuccess,
  clearForgotPasswordSuccess,
} = userSlice.actions;

export const selectUser = (state: { user: UserState }): TUser | null => state.user.user;

export const selectIsAuthChecked = (state: { user: UserState }): boolean =>
  state.user.isAuthChecked;

export const selectIsAuthenticated = (state: { user: UserState }): boolean =>
  state.user.isAuthenticated;

export const selectIsSuccessRegistration = (state: { user: UserState }): boolean =>
  state.user.isSuccessRegistration;

export const selectUserLoading = (state: { user: UserState }): boolean =>
  state.user.isLoading;

export const selectUserError = (state: { user: UserState }): Error | null =>
  state.user.error;

export const selectUserName = (state: { user: UserState }): string | undefined =>
  state.user.user?.name;

export const selectIsSuccessForgotPassword = (state: { user: UserState }): boolean =>
  state.user.isSuccessForgotPassword;

export const selectIsSuccessResetPassword = (state: { user: UserState }): boolean =>
  state.user.isSuccessResetPassword;

export default userSlice.reducer;
