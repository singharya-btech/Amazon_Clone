import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: null,
    mobileMenuOpen: false,
  },
  reducers: {
    showToast: (state, action) => {
      state.toast = action.payload // { message, type: 'success'|'error'|'info' }
    },
    hideToast: (state) => {
      state.toast = null
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false
    },
  },
})

export const { showToast, hideToast, toggleMobileMenu, closeMobileMenu } = uiSlice.actions
export default uiSlice.reducer
