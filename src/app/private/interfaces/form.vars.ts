import { ObjectConfig } from "./vars";
import { FormGroup } from "@angular/forms";
import { Category } from "./categories";

export interface FormCategoryVars {
  domain: string;
  RootCategory: Category;
  selectedToEmit: Array<any>;
  Categories: Array<Category>;
  DefaultCategoryToEmit: Category;
  Form: FormGroup;
  FormValue: Object;
  ADD: boolean;
  DELETE: boolean;
  EDIT: boolean;
  Key: Object;
  database: string;
  LastCategorySelected: Category;
  ValueToParentForm: Object;
  SelectedCategories: Array<Category>;
  highlightCategories: Array<string>;
  FirstCall: boolean;
  _id: string;
  parent: string;
  UrlItem: string;
  Specification: CategoryFormSpecification;
  ObjectConfig: ObjectConfig;
  isChild: boolean;
}

export interface FormVars {
  domain: string;
  Title: string;
  Subtitle: string;
  Form: FormGroup;
  FormValue: Object;
  SameFormAsStart: boolean;
  Tabs: Object;
  Properties: Array<any>;
  Specification: FormSpecification;
  Item: Object;
  ImageValues: string;
  imageIdCollecter: Object;
  EditorName: string;
  ValueToParentForm: Object;
  Html: string;
  FirstCall: boolean;
  index: string;
  owner: string;
  database: string;
  UrlItem: string;
  newForm: boolean;
  files: Object;
  opid: string;
}

export interface CategoryFormSpecification {
  Region: string;
  TableName: string;
  title: string;
  subtitle: string;
  IndexName: string;
  Key;
  KeyConditionExpression: string;
  ProjectionExpression: string;
  FilterExpression: string;
  ExpressionAttributeNames: string;
  ExpressionAttributeValues: string;
  Limit: string;
  ExclusiveStartKey: string;
  Updateexpression;
  ConditionExpression;
  ScanIndexForward: string;
  valueToEmit: Array<any>;
  ObjectConfig: ObjectConfig;
  attributes: any;
  label: string;
  parent: string;
  root_ID: Category;
}

export interface FormSpecification {
  title: string;
  subtitle: string;
  TableName: string;
  Region: string;
  Database: string;
  IndexName: string;
  Key: Object;
  init: Object;
  bucket: string;
  imagePath: string;
  imageName: string;
  label: string;
  ValueToParentForm: Object;
  valueToEmit: Array<any>;
  attributes: Array<any>;
}
