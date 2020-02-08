import { createAction, props } from "@ngrx/store";

export const addPosition = createAction(
  "[List AddPosition] Add Position",
  props<{ position: object }>()
);

export const setPositions = createAction(
  "[List SetPositions] Set Positions",
  props<{ positions: [object] }>()
);

export const setPageSize = createAction(
  "[List SetPageSize] Set PageSize",
  props<{ pageSize: number }>()
);
