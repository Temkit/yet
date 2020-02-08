export interface PinpointApp {
  AppName: string;
  CompagnName: String;
  ApplicationId: String;
  CampaignId: String;
  WriteCampaignRequest: Object;
}


export interface PinpointImportJob {

  ApplicationId: String;
  ImportJobRequest: ImportJobRequest;

}


interface ImportJobRequest {
  DefineSegment: Boolean;
  ExternalId: String;
  Format: String;
  RegisterEndpoints: Boolean;
  RoleArn: String;
  S3Url: String;
  SegmentId: String;
  SegmentName: String;
}

