import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartAPI } from '../../services/api'

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.getCart()
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const addToCart = createAsyncThunk('cart/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.addItem(payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.updateItem(itemId, { quantity })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const removeCartItem = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.removeItem(itemId)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await cartAPI.clearCart()
    return { items: [], total_items: 0, subtotal: 0, tax: 0, grand_total: 0 }
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total_items: 0,
    subtotal: 0,
    tax: 0,
    grand_total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.items = []
      state.total_items = 0
      state.subtotal = 0
      state.tax = 0
      state.grand_total = 0
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading = false
      Object.assign(state, action.payload)
    }
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, (state) => { state.loading = false })
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeCartItem.fulfilled, setCart)
      .addCase(clearCart.fulfilled, setCart)
  },
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
