import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  AmapPlaceSearchService,
  AmapPlaceSearchWrapper,
  AmapWalkingService,
  AmapWalkingWrapper,
  ILngLat,
  Map,
  Poi,
  PoiList,
  WalkingResult,
  WalkRoute,
  AmapDrivingService
} from "ngx-amap";
import { Observable, Subscription } from "rxjs";
import { map, share, tap } from "rxjs/operators";
import { ContentCardComponent } from "src/app/content-card/content-card.component";
import { PathScheduleService } from "src/app/path-schedule.service";
import {
  RESULT_STATUS,
  wasteCategroiesName,
  WASTE_CATEGORY
} from "src/constants/enum";
import { SankeyDemoComponent } from "src/app/sankey-demo/sankey-demo.component";
interface SearchResult {
  info: string;
  poiList: PoiList;
  keywordList?: any;
  cityList?: any;
}
type Some<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never;
let a: Some<
  | {
      s: string;
    }
  | {
      n: number;
    }
>;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : T;
let b: ReturnType<(s: boolean) => number>;

function fff<T>(x: T) {
  return x;
}
let f = (f, ff) => {
  return 123;
};
interface F {
  t: number;
  f: boolean;
}

@Component({
  selector: "app-amap-container",
  templateUrl: "./amap-container.component.html",
  styleUrls: ["./amap-container.component.scss"],
  providers: [PathScheduleService]
})
export class AmapContainerComponent implements OnInit, OnDestroy {
  wasteCategroies: WASTE_CATEGORY[] = [
    WASTE_CATEGORY.Dry,
    WASTE_CATEGORY.Moist,
    WASTE_CATEGORY.Harzard,
    WASTE_CATEGORY.Recycle
  ];
  wasteCategroiesName = wasteCategroiesName;

  isMapReady = false;
  isLocated = false;

  amap?: Map = null;
  selectPoiChangeSub: Subscription;
  selectedPoi: Poi;

  amapPlaceSearchPlugin: AmapPlaceSearchWrapper;
  isPlaceSearchComplete$: Observable<boolean>;
  isPlaceSearchPending = false;
  // placeSearchResult: SearchResult;
  placeSearchErrorSub: Subscription;

  amapWalkNaviPlugin: AmapWalkingWrapper;
  walkNaviResult: WalkingResult;
  isWalkNaviComplete$: Observable<boolean>;
  isWalkNaviPending = false;
  walkNaviErrorSub: Subscription;
  walkNaviError: any;

  pathToTransferStation: ILngLat[];
  pathToFactory: ILngLat[];

  public isLineHovering: boolean = false;
  constructor(
    private readonly amapPlaceSearch: AmapPlaceSearchService,
    private readonly amapWalkNavi: AmapWalkingService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly pathSchedule: PathScheduleService,
    private readonly amapDrive: AmapDrivingService
  ) {}

  ngOnInit() {}
  ngOnDestroy() {
    this.placeSearchErrorSub.unsubscribe();
    this.walkNaviErrorSub.unsubscribe();
    this.selectPoiChangeSub.unsubscribe();
  }
  errorHandler(err: string) {
    this.snackBar.open(`something wrong: ${err}, pls retry`, "ok", {
      duration: 1000
    });
  }
  onLineHover(e: any, type: "mouseover" | "mouseout") {
    switch (type) {
      case "mouseover":
        //this.isLineHovering = true;
        e.target.setOptions({
          isOutline: true
        });
        break;
      case "mouseout":
        //this.isLineHovering = false;
        e.target.setOptions({
          isOutline: false
        });
        break;

      default:
        break;
    }
  }
  onLineClick(category: WASTE_CATEGORY) {
    this.dialog.open(SankeyDemoComponent);
  }
  onMapReady(amap: Map) {
    this.isMapReady = true;
    this.amap = amap;
    const promisePS = this.amapPlaceSearch.of({
      map: this.amap,
      city: "上海",
      citylimit: true,
      autoFitView: true
    });
    const promiseWN = this.amapWalkNavi.of({
      // map: this.amap,
      autoFitView: true
    });
    Promise.all([promisePS, promiseWN])
      .then(plugins => {
        this.amapPlaceSearchPlugin = plugins[0];
        this.initPlaceSearch();
        this.amapWalkNaviPlugin = plugins[1];
        this.initWalkNavi();
      })
      .catch(err => console.log(`plugin init error: ${err}`));
  }
  initPlaceSearch() {
    this.isPlaceSearchComplete$ = this.amapPlaceSearchPlugin
      .on("complete")
      .pipe(
        tap(res => (this.selectedPoi = res.poiList.pois[0])),
        map(res => (res.info === RESULT_STATUS.NO_DATA ? false : true)),
        share()
      );
    this.selectPoiChangeSub = this.amapPlaceSearchPlugin
      .on("selectChanged")
      .subscribe(selectChangeEvent => {
        this.selectedPoi = selectChangeEvent.selected.data;
      });
    this.placeSearchErrorSub = this.amapPlaceSearchPlugin
      .on("error")
      .subscribe(err => this.errorHandler(err));
  }
  applyPlaceSearch(keyword: string) {
    this.isPlaceSearchPending = true;
    this.amapPlaceSearchPlugin
      .search(keyword)
      .catch(err => this.errorHandler(err))
      .finally(() => (this.isPlaceSearchPending = false));
  }
  initWalkNavi() {
    this.isWalkNaviComplete$ = this.amapWalkNaviPlugin.on("complete").pipe(
      tap(res => (this.walkNaviResult = res)),
      map(res => (res.info === RESULT_STATUS.NO_DATA ? false : true)),
      share()
    );
    this.walkNaviErrorSub = this.amapPlaceSearchPlugin
      .on("error")
      .subscribe(err => this.errorHandler(err));
  }
  applyWalkNavi(category: WASTE_CATEGORY) {
    const plugin = this.amapWalkNaviPlugin;

    const start = this.selectedPoi;
    const dest = this.pathSchedule.getPoint(start, category);
    const markers = this.amap.getAllOverlays("marker");
    this.isWalkNaviPending = true;
    Promise.all([
      plugin.search(start.location, dest.transferStation.lnglgt),
      plugin.search(dest.transferStation.lnglgt, dest.factory.lnglgt)
    ])
      .then(walkResultes => {
        const status = walkResultes
          .map(result => (result.status === "complete" ? true : false))
          .reduce((acc, val) => acc && val, true);
        if (status) {
          let resultTrans = <WalkingResult>walkResultes[0].result;
          let resultFac = <WalkingResult>walkResultes[1].result;
          //this.assertWalkResult(resultTrans);
          //this.assertWalkResult(resultFac);
          let routesTrans = <WalkRoute[]>(<unknown>resultTrans.routes);
          let routesFac = <WalkRoute[]>(<unknown>resultFac.routes);
          //this.assertWalkRoutes(routesTrans);
          //this.assertWalkRoutes(routesFac);
          // lib's type def of WalkingResult.routes was wrong
          this.pathToTransferStation = routesTrans[0].steps
            .map(step => step.path)
            .reduce((acc, val) => acc.concat(val), []);
          // resultTrans = <WalkingResult>walkResultes[1].result;
          this.pathToFactory = routesFac[0].steps
            .map(step => step.path)
            .reduce((acc, val) => acc.concat(val), []);
          this.amap.remove(markers);
          this.amap.setFitView();
        }
      })
      .catch(err => this.errorHandler(err))
      .finally(() => (this.isWalkNaviPending = false));
  }
  async test() {
    const plugin = await this.amapDrive.of();
    const result = await plugin.search([
      { keyword: "北京市地震局(公交站)", city: "北京" },
      { keyword: "亦庄文化园(地铁站)", city: "北京" }
    ]);
    return;
  }
  /* private assertWalkRoutes(routes: any): asserts routes is WalkRoute[] {
    Array.isArray(routes);
    this.assertWalkRoute(routes[0]);
  }
  private assertWalkRoute(route: any): asserts route is WalkRoute {
    if (route.steps === undefined) {
      throw new AssertionError();
    }
  }
  private assertWalkResult(
    result: string | WalkingResult
  ): asserts result is WalkingResult {
    if (typeof result === "string") {
      throw new AssertionError();
    }
  } */
}
