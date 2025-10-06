import { createSlice, nanoid } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversations",
  initialState: {selectedchat :null, messages: []},
  reducers:{
    setSelectedConversation: (state, action) => {
      state.selectedchat = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    }

  }

});

export const { setSelectedConversation, setMessages } = conversationSlice.actions;

export default conversationSlice.reducer;