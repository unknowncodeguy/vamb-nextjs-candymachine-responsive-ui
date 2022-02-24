import { combineReducers } from "redux"
import { pageReducer } from "./page/reducers"

export const combinedReducers = combineReducers({
  page: pageReducer,
})

export type RootState = ReturnType<typeof combinedReducers>
