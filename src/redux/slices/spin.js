import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

// initial state
const initialState = {
  spinData: {}
};

// slice
const slice = createSlice({
  name: 'spin',
  initialState,

  reducers: {
    selectSpinItem: (state, action) => {
      console.log('come here to set the data', action);
      state.spinData = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { selectSpinItem } = slice.actions;

// ----------------------------------------------------------------------
