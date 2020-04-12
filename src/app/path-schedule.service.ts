import { Injectable, OnInit } from "@angular/core";
import { ILngLat, Poi } from "ngx-amap";
import { positionsF, positionsT } from "src/constants/data";
import { WASTE_CATEGORY } from "src/constants/enum";
import {
  CATEGORY_OF_FACTORY,
  DISTRICT,
  Position,
  POSITION_TAG
} from "src/types/data";

@Injectable({
  providedIn: "root"
})
export class PathScheduleService {
  constructor() {}
  private shortestDistanceWithStart(start: ILngLat) {
    return (a: Position, b: Position) => {
      return this.distance(a.lnglgt, start) < this.distance(b.lnglgt, start)
        ? -1
        : this.distance(a.lnglgt, start) === this.distance(b.lnglgt, start)
        ? 0
        : 1;
    };
  }
  private decide(
    xsMatchedDist: Position[],
    xsMatchedCate: Position[],
    start: ILngLat
  ): Position {
    let result: Position;
    switch (xsMatchedDist.length) {
      case 0:
        result = xsMatchedCate.sort(this.shortestDistanceWithStart(start))[0];
        break;
      case 1:
        result = xsMatchedDist[0];
        break;
      default:
        result = xsMatchedDist.sort(this.shortestDistanceWithStart(start))[0];
        break;
    }
    return result;
  }
  private distance(p1: ILngLat, p2: ILngLat): number {
    const EARTH_RADIUS = 6378.137;
    const rad = (ang: number) => (ang * Math.PI) / 180;
    const p1Lat = rad(p1[1]);
    const p2Lat = rad(p2[1]);
    const a = p1Lat - p2Lat;
    const b = rad(p1[0]) - rad(p2[0]);
    return (
      (Math.round(
        2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(a / 2), 2) +
                Math.cos(p1Lat) * Math.cos(p2Lat) * Math.pow(Math.sin(b / 2), 2)
            )
          ) *
          EARTH_RADIUS *
          10000
      ) /
        10000) *
      1000
    );
  }
  getData(strategy: "local" | "remote" = "local") {
    switch (strategy) {
      case "local":
        return {
          factories: positionsF,
          transferStations: positionsT
        };

      default:
        console.log("not avaliable");
        return {
          factories: positionsF,
          transferStations: positionsT
        };
    }
  }
  getFactroyCateFilter(cate: WASTE_CATEGORY) {
    let fn: (fac: Position) => boolean;
    const ffn = (...cate: CATEGORY_OF_FACTORY[]) => (fac: Position) => {
      if (fac.tag === POSITION_TAG.FACTORY) {
        return cate.some(c => fac.kind! === c);
      } else {
        throw "must be factory positions";
      }
    };
    switch (cate) {
      case WASTE_CATEGORY.Dry:
        fn = ffn(CATEGORY_OF_FACTORY.BURNING, CATEGORY_OF_FACTORY.LANDFILL);
        break;
      case WASTE_CATEGORY.Moist:
        fn = ffn(CATEGORY_OF_FACTORY.RECYCLE, CATEGORY_OF_FACTORY.LANDFILL);
        break;
      case WASTE_CATEGORY.Recycle:
        fn = ffn(CATEGORY_OF_FACTORY.ORG_SOILD, CATEGORY_OF_FACTORY.RECYCLE);
        break;
      case WASTE_CATEGORY.Harzard:
        // wip
        break;
      default:
        break;
    }
    return fn;
  }
  getPoint(start: Poi, cate: WASTE_CATEGORY) {
    const district = <DISTRICT>start.adname;
    let { factories, transferStations } = this.getData();
    let factoriesMatchedCate = factories.filter(
      this.getFactroyCateFilter(cate)
    );
    let factoriesMatchedDist = factoriesMatchedCate.filter(
      fac => fac.district === district
    );
    let transfersMatchedDist = transferStations.filter(tra =>
      tra.district === DISTRICT.PD
        ? tra.district + "新区" === district
        : tra.district + "区" === district
    );
    const t = this.decide(
      transfersMatchedDist,
      transferStations,
      start.location
    );
    return {
      factory: this.decide(
        factoriesMatchedDist,
        factoriesMatchedCate,
        t.lnglgt
      ),
      transferStation: t
    };
  }
  getShortestTans2Fac(
    transferStation: Position,
    factories: Position[]
  ): Position {
    factories.sort(this.shortestDistanceWithStart(transferStation.lnglgt));
    return factories[0];
  }
}
