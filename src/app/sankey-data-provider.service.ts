import { Injectable, OnInit } from "@angular/core";
import { AmapDrivingService, AmapDrivingWrapper, Poi } from "ngx-amap";
import { from, Subscription } from "rxjs";
import {
  groupBy,
  map,
  mergeAll,
  mergeMap,
  take,
  tap,
  toArray
} from "rxjs/operators";
import { PathScheduleService } from "src/app/path-schedule.service";
import { WASTE_CATEGORY } from "src/constants/enum";
import { CATEGORY_OF_FACTORY, DISTRICT, Position } from "src/types/data";
import { Link, Node } from "src/types/sankey";
import { HttpClient } from "@angular/common/http";
import { StreetData } from "src/constants/data";

@Injectable({
  providedIn: "root"
})
export class SankeyDataProviderService {
  destFactories: Set<string> = new Set();
  destTansferStations: Set<string> = new Set();
  sub: Subscription;
  constructor(
    private pathScheduler: PathScheduleService,
    private driveNaviService: AmapDrivingService,
    private http: HttpClient
  ) {}
  getData(cate: WASTE_CATEGORY) {
    let { transferStations, factories } = this.pathScheduler.getData();
    factories = factories.filter(factory =>
      this.factoryKind2WasteCate(factory.kind).some(kind => kind === cate)
    );
    // tslint:disable-next-line: no-backbone-get-set-outside-model
    return this.http
      .get<StreetData[]>("./assets/sanityCheck.json")
      .pipe(map(s => this.genNode(factories, transferStations, s)));

    // return this.genNode(factories, transferStations);
    // return this.shortest(factories, transferStations);
    // return this.shortest(factories, transferStations).pipe(
    //  tap(v => console.log(v))
    // map(shortest => this.genNode(factories, transferStations, shortest))
    // );
  }
  private genNode(
    factories: Position[],
    transferStations: Position[],
    streets: StreetData[]
    // shortest: { tansferStation: string; factory: string }[]
  ) {
    let nodes: Node[] = [],
      links: Link[] = [];
    for (const district of Object.values(DISTRICT)) {
      nodes.push({
        id: district,
        name: district
      });
    }
    for (const street of streets) {
      // if ((street.name = "虹桥")) continue;
      nodes.push({
        id: street.name,
        name: street.name
      });
      links.push({
        source: street.district,
        target: street.name,
        value: 1
      });
      links.push({
        source: street.name,
        target: street.transferStation.name,
        value: 1
      });
      const f = this.pathScheduler.getShortestTans2Fac(
        transferStations.find(t => t.name === street.transferStation.name),
        factories
      );
      links.push({
        source: street.transferStation.name,
        target: f.name,
        value: 1
      });
      this.destFactories.add(f.name);
      this.destTansferStations.add(street.transferStation.name);
    }
    for (const transferStation of transferStations) {
      if (this.destTansferStations.has(transferStation.name)) {
        nodes.push({
          id: transferStation.name,
          name: transferStation.name
        });
      }

      /* const dest = this.pathScheduler.getShortestTans2Fac(
        transferStation,
        factories
      ).name;
      this.destFactories.push(dest);
      links.push({
        source: transferStation.name,
        target:
          // shortest.find(v => v.tansferStation === transferStation.name)
          //.factory,
          dest,
        value: 1
      }); */
    }

    for (const factory of factories) {
      if (this.destFactories.has(factory.name)) {
        nodes.push({
          id: factory.name,
          name: factory.name
        });
      }

      /*
    links.push({
        source: factory.name,
        target: wasteCategroiesName[this.factoryKind2WasteCate(factory.kind)],
        value: 1
      });
    */
    }
    /*
    for (const category of wasteCategroiesName) {
      nodes.push({
        id: category,
        name: category
      });
    }
    */
    return { nodes, links };
  }
  private shortest(f: Position[], t: Position[]) {
    t = [t[0]];
    f = [f[0], f[1]];
    const plugin = this.driveNaviService.of();
    const wrapper$ = from(plugin);

    const invokeSearch = async (plugin: AmapDrivingWrapper) => {
      const setTimeout = window.setTimeout;
      let count = 0;
      const timeout = (x: number) =>
        new Promise((resolve, reject) => setTimeout(y => resolve(), x));
      for (const trans of t) {
        for (const fac of f) {
          console.log("emit " + ++count);
          await timeout(1000 * 60);
          console.log("finish");
          plugin.search([
            { keyword: trans.name, city: "上海" },
            { keyword: fac.name, city: "上海" }
          ]);
        }
      }
    };
    return wrapper$.pipe(
      tap(plugin => invokeSearch(plugin).catch(err => console.log(err))),
      map(plugin =>
        // parameter type was wrong

        // plugin.search([
        //  { keyword: "北京市地震局(公交站)", city: "北京" },
        //  { keyword: "亦庄文化园(地铁站)", city: "北京" }
        // ]);
        plugin.on("complete")
      ),
      mergeAll(),
      take(f.length * t.length),
      groupBy(result => (<Poi>result.start).adcode),
      mergeMap(group => group.pipe(toArray())),

      map(
        results =>
          results.sort((a, b) =>
            a.routes[0].distance < b.routes[0].distance
              ? -1
              : a.routes[0].distance < b.routes[0].distance
              ? 0
              : 1
          )[0]
      ),
      map(result => {
        console.log(result);
        return {
          tansferStation: (<Poi>result.start).name,
          factory: (<Poi>result.end).name
        };
      }),
      toArray()
    );
  }
  private factoryKind2WasteCate(kind: CATEGORY_OF_FACTORY): WASTE_CATEGORY[] {
    let cate: WASTE_CATEGORY[];
    switch (kind) {
      case CATEGORY_OF_FACTORY.BURNING:
        cate = [WASTE_CATEGORY.Dry];
        break;
      case CATEGORY_OF_FACTORY.RECYCLE:
        cate = [WASTE_CATEGORY.Moist, WASTE_CATEGORY.Recycle];
        break;
      case CATEGORY_OF_FACTORY.ORG_SOILD:
        cate = [WASTE_CATEGORY.Recycle];
        break;
      case CATEGORY_OF_FACTORY.LANDFILL:
        cate = [
          WASTE_CATEGORY.Dry,
          WASTE_CATEGORY.Moist,
          WASTE_CATEGORY.Harzard
        ];
      default:
        break;
    }
    return cate;
  }
}
