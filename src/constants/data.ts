import { ILngLat } from "ngx-amap";
import {
  DISTRICT,
  CATEGORY_OF_FACTORY,
  POSITION_TAG,
  Position
} from "src/types/data";
const rawData = [
  {
    序号: 1,
    区: "浦东",
    设施名称: "罗山路中转站",
    地址: "高科西路4145弄",
    pos: "121.576022,31.195638 "
  },
  {
    序号: 2,
    区: "浦东",
    设施名称: "周浦中转站",
    地址: "周浦镇新坦瓦公路1356号",
    pos: "121.645194,31.094401 "
  },
  {
    序号: 3,
    区: "浦东",
    设施名称: "惠南中转站",
    地址: "惠南镇下盐公路5001号",
    pos: "121.731788,31.071983 "
  },
  {
    序号: 4,
    区: "浦东",
    设施名称: "唐镇分流转运中心",
    地址: "川沙路近一沁村",
    pos: "121.692535,31.208615 "
  },
  {
    序号: 5,
    区: "浦东",
    设施名称: "张江中转站",
    地址: "军民路1901号",
    pos: "121.616346,31.160352 "
  },
  {
    序号: 6,
    区: "浦东",
    设施名称: "高行分流转运中心",
    地址: "津行路1364弄11号",
    pos: "121.597642,31.309778 "
  },
  {
    序号: 7,
    区: "宝山",
    设施名称: "泰和路码头",
    地址: "泰和路到底",
    pos: "121.484194,31.372257 "
  },
  {
    序号: 8,
    区: "闵行",
    设施名称: "闵吴码头",
    地址: "江川东路301号",
    pos: "121.447597,31.009942 "
  },
  {
    序号: 9,
    区: "黄浦",
    设施名称: "黄浦中转站",
    地址: "中山南路1118号",
    pos: "121.502421,31.211347 "
  },
  {
    序号: 10,
    区: "虹口",
    设施名称: "虹口中转站",
    地址: "黄山路53号",
    pos: "121.47171,31.269332 "
  },
  {
    序号: 11,
    区: "静安",
    设施名称: "静安中转站",
    地址: "海防路",
    pos: "121.46418,31.250319"
  },
  {
    序号: 12,
    区: "杨浦",
    设施名称: "杨浦中转站",
    地址: "军工路3701号",
    pos: "121.537934,31.33448 "
  },
  {
    序号: 13,
    区: "长宁",
    设施名称: "田度中转站",
    地址: "泾力西路860号",
    pos: "121.343787,31.238336 "
  },
  {
    序号: 14,
    区: "宝山",
    设施名称: "虎林路码头",
    地址: "虎林路950号",
    pos: "121.451622,31.349407 "
  },
  {
    序号: 15,
    区: "徐汇",
    设施名称: "徐浦码头",
    地址: "徐梅路7弄55号",
    pos: "121.463074,31.123017 "
  }
];
const rawDataTwo = [
  {
    序号: 1,
    "处置厂（场）名称": "江桥焚烧厂",
    区: "嘉定",
    地址: "绥德路800号",
    运行单位: "上海环城再生能源有限公司",
    pos: "121.363682,31.268916 "
  },
  {
    序号: 2,
    "处置厂（场）名称": "老港四期填埋场",
    区: "浦东",
    地址: "浦东老港镇东首",
    运行单位: "上海老港生活垃圾处置有限公司",
    pos: "121.87292,31.051303 "
  },
  {
    序号: 3,
    "处置厂（场）名称": "老港焚烧厂（一期）",
    区: "浦东",
    地址: "浦东老港镇东首",
    运行单位: "上海环境集团再生能源运营管理有限公司老港分公司",
    pos: "121.87292,31.051303 "
  },
  {
    序号: 4,
    "处置厂（场）名称": "老港综合填埋场",
    区: "浦东",
    地址: "浦东老港镇东首",
    运行单位: "上海老港废弃物处置有限公司",
    pos: "121.87292,31.051303 "
  },
  {
    序号: 5,
    "处置厂（场）名称": "奉贤焚烧厂",
    区: "奉贤",
    地址: "奉贤化学工业园区漴缺村1488号",
    运行单位: "上海东石塘再生能源有限公司",
    pos: "121.451526,30.829827 "
  },
  {
    序号: 6,
    "处置厂（场）名称": "御桥焚烧厂",
    区: "浦东",
    地址: "北蔡御桥路869号",
    运行单位: "上海浦城热电能源有限公司",
    pos: "121.551287,31.154236 "
  },
  {
    序号: 7,
    "处置厂（场）名称": "黎明焚烧厂",
    区: "浦东",
    地址: "曹路镇小华江路到底",
    运行单位: "上海黎明资源再利用有限公司",
    pos: "121.718096,31.282576 "
  },
  {
    序号: 8,
    "处置厂（场）名称": "嘉定焚烧厂",
    区: "嘉定",
    地址: "嘉定外冈镇古塘村",
    运行单位: "上海嘉定再生能源有限公司",
    pos: "121.117233,31.360046 "
  },
  {
    序号: 9,
    "处置厂（场）名称": "金山焚烧厂",
    区: "金山",
    地址: "海金路728号",
    运行单位: "上海金山环境再生能源有限公司",
    pos: "121.279287,30.707395 "
  },
  {
    序号: 10,
    "处置厂（场）名称": "松江焚烧厂",
    区: "松江",
    地址: "青天路669号",
    运行单位: "上海天马再生能源有限公司",
    pos: "121.111835,31.089536 "
  },
  {
    序号: 11,
    "处置厂（场）名称": "崇明焚烧厂",
    区: "崇明",
    地址: "崇明区港沿镇港沿公路4098号",
    运行单位: "上海城投瀛洲生活垃圾处置有限公司",
    pos: "121.702985,31.631241 "
  },
  {
    序号: 12,
    "处置厂（场）名称": "崇明填埋场",
    区: "崇明",
    地址: "堡镇港北闸东侧",
    运行单位: "上海环境集团再生能源运营管理有限公司",
    pos: "121.686901,31.631212 "
  },
  {
    序号: 13,
    "处置厂（场）名称": "长兴填埋场",
    区: "崇明",
    地址: "长兴岛合作路永丰为圩",
    运行单位: "上海城投瀛洲生活垃圾处置有限公司",
    pos: "121.778077,31.349146 "
  },
  {
    序号: 14,
    "处置厂（场）名称": "青浦综合处理厂",
    区: "青浦",
    地址: "青浦区白鹤镇金米村",
    运行单位: "上海国清生物科技有限公司",
    pos: "121.07974,31.200686 "
  },
  {
    序号: 15,
    "处置厂（场）名称": "浦东有机固废处理厂",
    区: "浦东",
    地址: "浩江路108号",
    运行单位: "上海浦东环保发展有限公司",
    pos: "121.71539,31.286654 "
  },
  {
    序号: 16,
    "处置厂（场）名称": "闵行餐厨再生资源中心",
    区: "闵行",
    地址: "联友路",
    运行单位: "上海文鑫生物科技有限公司",
    pos: "121.259806,31.247924 "
  }
];
const array2LngLgt = (raw: string): ILngLat => {
  let lnglgt: ILngLat = [];
  for (const it of raw.split(",")) {
    lnglgt.push(Number(it));
  }
  return lnglgt;
};
function convert(raw: typeof rawData): Position[] {
  let positions: Position[] = [];
  if (typeof raw === typeof rawData) {
    for (const item of raw) {
      positions.push({
        name: item.设施名称,
        district: <DISTRICT>item.区,
        lnglgt: array2LngLgt(item.pos),
        tag: POSITION_TAG.TANSFER_STATION
      });
    }
  }
  return positions;
}
function convertFac(raw: typeof rawDataTwo) {
  let positions: Position[] = [];
  for (const item of raw) {
    positions.push({
      name: item["处置厂（场）名称"],
      district: <DISTRICT>item.区,
      lnglgt: array2LngLgt(item.pos),
      tag: POSITION_TAG.FACTORY,
      kind: item["处置厂（场）名称"].includes("焚烧")
        ? CATEGORY_OF_FACTORY.BURNING
        : item["处置厂（场）名称"].includes("填埋")
        ? CATEGORY_OF_FACTORY.LANDFILL
        : item["处置厂（场）名称"].includes("固废")
        ? CATEGORY_OF_FACTORY.ORG_SOILD
        : item["处置厂（场）名称"].includes("再生")
        ? CATEGORY_OF_FACTORY.RECYCLE
        : CATEGORY_OF_FACTORY.BURNING
    });
  }
  return positions;
}
export const positionsT = convert(rawData);
export const positionsF = convertFac(rawDataTwo);
