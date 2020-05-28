import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  /*
   * If there is a color preference stored in localStorage from a previous visit,
   * use that value. Otherwise, default to a light theme.
   */
  darkMode: JSON.parse(localStorage.getItem("darkMode"))
    ? JSON.parse(localStorage.getItem("darkMode"))
    : false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode(state) {
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;

export default themeSlice.reducer;

// Export the selectors for ease of testing
export const darkMode = (state) => state.theme.darkMode;
