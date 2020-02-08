import { Observable } from "rxjs";
import { FormGroup } from "@angular/forms";

export interface ListVars {
  File: string;
  Index: number;
  title: string;
  subtitle: string;
  Specification: ListSpecification;
  FormElements: Array<any>;
  Filters: Object;
  Form: FormGroup;
  Position_ref: number;
  Positions: Array<any>;
  ScannedCount: number;
  Domain: string;
  addLabel: string;
  addType: string;
  TagsValues: Array<any>;
  Items: Observable<any>;
  Count: number;
  delete: {
    name: string;
    _id: string;
    database: string;
  };
  TableName: string;
  IndexName: string;
  Region: string;
  KeyConditionExpression: string;
  ProjectionExpression: string;
  FilterExpression: string;
  ExpressionAttributeNames;
  ExpressionAttributeNames_Additional;
  ExpressionAttributeValues;
  Limit: number;
  Key: Object;
  ExclusiveStartKey: object;
  ScanIndexForward: boolean;
}

export interface ListSpecification {
  title: string;
  subtitle: string;
  Region: string;
  TableName: string;
  IndexName: string;
  Key;
  modal;
  queryType;
  KeyConditionExpression: string;
  ProjectionExpression: string;
  FilterExpression: string;
  ExpressionAttributeNames;
  ExpressionAttributeValues;
  Limit: number;
  ExclusiveStartKey: string;
  ScanIndexForward: boolean;
  api_label: string;
  init: Object;
  img: imgSpecification;
  attributes: {
    keys_data: Array<string>;
    keys: Array<string>;
  };
  bucket: string;
  imagePath: string;
  imageName: string;
  filtres: Array<Object>;
  type: string;
  UserPoolId: string;
  Link: string;
  QueryParams;
}

export interface imgSpecification {
  Region: string;
  bucket: string;
  imagePath: string;
  imageName: string;
}
