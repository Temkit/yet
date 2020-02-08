
export interface ItemsQuery {
  Region: string;
  Type: string;
  TableName: string;
  IndexName?: string;
  KeyConditionExpression?: string;
  ProjectionExpression?: string;
  FilterExpression?: string;
  ExpressionAttributeNames?: object;
  ExpressionAttributeValues?: object;
  Limit?: number;
  ExclusiveStartKey?: object;
  ScanIndexForward?: boolean
}

// Beginwith Or Contains
export interface BEorCONTQuery {
  TableName: string;
  keyCondition: string;
  keyConditionValue: string;
  IndexName: string;
  substr: string;
  attribute: string;
}

export interface ItemsResponse {
  Count: number;
  ScannedCount: number;
  Items: Array<Object>;
  LastEvaluatedKey: string;
}


export interface ItemResponse {
  Item: Object;
}
