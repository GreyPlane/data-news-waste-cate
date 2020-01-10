export enum WASTE_CATEGORY {
  Dry,
  Moist,
  Harzard,
  Recycle
}
export enum RESULT_STATUS {
  NO_DATA = 'no_data',
  COMPLETE = 'complete',
  ERROR = 'error'
}
export const wasteCategroiesName: string[] = [
    '干垃圾',
    '湿垃圾',
    '有害垃圾',
    '可回收垃圾'
  ];
export enum ERROR_STATUS {
  wip
}
