import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { wishlistAPI } from '../../services/api'

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await wishlistAPI.getWishlist()
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await wishlistAPI.addItem({ product_id: productId })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    await wishlistAPI.removeItem(productId)
    return productId
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.items.find(i => i.id === action.payload.id)) {
          state.items.push(action.payload)
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.product?.id !== action.payload)
      })
  },
})

export default wishlistSlice.reducer
