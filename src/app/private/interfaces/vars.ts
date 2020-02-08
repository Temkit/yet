import { Category } from './categories';

export interface Specification {
  domain: string;
  config;
  type: string;
  'logo-login': string;
  'logo-dashboard': string;
  'main-color': string;
  'background-color': string;
  credential: {
    Auth: {
      region: string;
      userPoolId: string;
      userPoolWebClientId: string;
    };
  };
  menu: string;
  EmailSESRegion: string;
  EmailIdentityPoolId: string;
  identityPoolId: string;
  dynamodbRegion: string;
  dynamodbApiVersion: string;
}

export interface ObjectConfig {
  name: string;
  type: string;
  specificationFile: string;
  parent: string;
  valueToParentForm: string;
  valueToSelect: Object;
  rootCategory: Category;
  key: Object;
  disabled: boolean;
  class: string;
}
