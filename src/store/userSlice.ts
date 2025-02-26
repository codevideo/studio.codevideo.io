import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';

// Async thunk for checking user auth status
export const checkAuthStatus = createAsyncThunk(
  'user/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      return {
        isUserLoggedIn: !!session,
        user: session?.user || null
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export interface UserState {
    isUserLoggedIn: boolean;
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: unknown | null;
}

export const userInitialState = {
  isUserLoggedIn: false,
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    resetUserState: (state) => {
      Object.assign(state, userInitialState);
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle checkAuthStatus
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isUserLoggedIn = action.payload.isUserLoggedIn;
        state.user = action.payload.user as any;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as any;
        state.isUserLoggedIn = false;
        state.user = null;
      })
      // Handle logout
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.isUserLoggedIn = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as any;
      });
  }
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;