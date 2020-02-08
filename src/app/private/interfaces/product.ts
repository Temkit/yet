export interface ProductKey {
  _id: string;
  database: string;
}

export interface Product {
  _id: string;
  categories: Array<string>;
  active: number;
  additional_shipping_cost: number;
  available_date: number;
  available_for_order: number;
  condition: string;
  customizable: number;
  date_add: number;
  date_upd: number;
  depth: number;
  description: string;
  description_short: string;
  height: number;
  id_manufacturer: number;
  id_category_default: string;
  id_supplier: number;
  id_tax_rules_group: number;
  image: string;
  meta_description: string;
  meta_keywords: string;
  minimal_quantity: number;
  name: string;
  online_only: number;
  other_categories: Array<number>;
  out_of_stock: number;
  price: number;
  quantity: number;
  quantity_discount: number;
  show_price: number;
  tags: Array<string>;
  unit_price_ratio: number;
  visibility: string;
  weight: number;
  wholesale_price: number;
  width: number;
  author: number;
}

export interface ProductQuery {
  Type: string;
  IndexName?: string;
  KeyConditionExpression?: string;
  ProjectionExpression?: object;
  FilterExpression?: string;
  ExpressionAttributeNames?: object;
  ExpressionAttributeValues?: object;
  Limit?: number;
  LastEvaluatedKey?: object;
  ScanIndexForward?: boolean;
}

export interface ProductsResponse {
  Count: number;
  ScannedCount: number;
  Items: Array<Product>;
  LastEvaluatedKey: string;
}

export interface ProductResponse {
  Item: Product;
}
