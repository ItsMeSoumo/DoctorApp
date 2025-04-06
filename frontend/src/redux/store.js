import { configureStore } from '@reduxjs/toolkit'
import { alert } from './features/alert.slice.js'
import { userSlice } from './features/user.slice.js'

export default configureStore({
    reducer: {
    //   alerts : alert.reducer,
      user: userSlice.reducer
    }
})
