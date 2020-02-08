import { createReducer, on } from "@ngrx/store";
import {
  addPosition,
  setPositions,
  setPageSize
} from "./../actions/list.actions";

export interface State {
  positions: [object];
  pageSize: number;
}

export const initialState: State = {
  positions: [null],
  pageSize: 10
};

const _positionsReducer = createReducer(
  initialState,
  on(addPosition, (state: State, { position }) => {
    const tmpPositions = state.positions;
    tmpPositions.push(position);
    return { ...state, positions: tmpPositions };
  }),
  on(setPositions, (state: State, { positions }) => {
    return { ...state, positions };
  }),
  on(setPageSize, (state: State, { pageSize }) => {
    return { ...state, positions: [null], pageSize };
  })
);

export function positionsReducer(state, action) {
  return _positionsReducer(state, action);
}
