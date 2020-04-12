import { ILngLat } from "ngx-amap";
export enum POSITION_TAG {
  TANSFER_STATION,
  FACTORY
}
export enum DISTRICT {
  YP = "杨浦",
  PD = "浦东",
  BS = "宝山",
  MH = "闵行",
  HP = "黄浦",
  HK = "虹口",
  JA = "静安",
  CN = "长宁",
  XH = "徐汇",
  FX = "奉贤",
  JS = "金山",
  PT = "普陀",
  JD = "嘉定",
  QP = "青浦",
  CM = "崇明",
  SJ = "松江"
}
export enum CATEGORY_OF_FACTORY {
  LANDFILL,
  BURNING,
  ORG_SOILD,
  RECYCLE
}
export interface Position {
  name: string;
  district: DISTRICT;
  lnglgt: ILngLat;
  tag: POSITION_TAG;
  kind?: CATEGORY_OF_FACTORY;
}
export interface RawData {}
