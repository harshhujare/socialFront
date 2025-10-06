import  {configureStore} from '@reduxjs/toolkit'
import conversationReducer from '../components/ChatSlice/ConversationSlice'
const store=configureStore({

    reducer:{
        conversations: conversationReducer
    }
})





export default store;