export interface CategoryKey {
  _id: string;
  database: string;
}

export interface Category {
  _id: string;
  id_parent: string;
  active: number;
  date_add?: number;
  date_upd: number;
  is_root_category: number;
  level_depth: number;
  link_rewrite?: string;
  name: string;
  nleft?: number;
  nright?: number;
  position?: number;
}

export interface CategoryQuery {
  Type: string;
  IndexName?: string;
  KeyConditionExpression?: string;
  ProjectionExpression?: string;
  FilterExpression?: string;
  ExpressionAttributeNames?: object;
  ExpressionAttributesValues?: object;
  Limit?: number;
  LastEvaluatedKey?: string;
  ScanIndexForward?: boolean;
}

export interface CategoryResponse {
  Count: string;
  Items: Array<Category>;
  ScannedCount: number;
  LastEvaluatedKey: string;
}
