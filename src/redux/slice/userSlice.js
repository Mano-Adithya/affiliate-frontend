import { createSlice } from "@reduxjs/toolkit";


let initialState = {
    user_data : null
}

export const userSlice = createSlice({
    name : 'user',
    initialState : initialState,
    reducers : {
        updateUserData : (state , action) => {
            state.user_data = action.payload
        },
        fetchUserData : (state) => {
            return state;
        }
    }
})

export const { updateUserData } = userSlice.actions;
export default userSlice.reducer;