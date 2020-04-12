import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Validators, FormControl } from "@angular/forms";
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
  AmapDrivingService,
  AmapDrivingWrapper,
  DrivingResult,
  IIcon
} from "ngx-amap";
import { Observable, Subscription, Subject } from "rxjs";
import { map, share, tap, takeUntil } from "rxjs/operators";
import { ContentCardComponent } from "src/app/content-card/content-card.component";
import { PathScheduleService } from "src/app/path-schedule.service";
import {
  RESULT_STATUS,
  wasteCategroiesName,
  WASTE_CATEGORY
} from "src/constants/enum";
import { SankeyDemoComponent } from "src/app/sankey-demo/sankey-demo.component";
import { AssertionError } from "assert";
import { Position } from "src/types/data";
import { StreetData } from "src/constants/data";
import { HttpClient } from "@angular/common/http";
import { IconService } from 'ngx-amap/services/icon/icon.service';
interface SearchResult {
  info: string;
  poiList: PoiList;
  keywordList?: any;
  cityList?: any;
}
@Component({
  selector: "app-amap-container",
  templateUrl: "./amap-container.component.html",
  styleUrls: ["./amap-container.component.scss"],
  providers: [PathScheduleService]
})
export class AmapContainerComponent implements OnInit, OnDestroy {
  isShowTransferStation: boolean = false;
  isShowFactory: boolean = false;
  temp$: Observable<StreetData[]>;
  wasteCategories: WASTE_CATEGORY[] = [
    WASTE_CATEGORY.Dry,
    WASTE_CATEGORY.Moist,
    // WASTE_CATEGORY.Harzard,
    WASTE_CATEGORY.Recycle
  ];
  wasteCategroiesName = wasteCategroiesName;

  isMapReady = false;
  isLocated = false;

  amap?: Map = null;
  selectedPoi: Poi;

  amapPlaceSearchPlugin: AmapPlaceSearchWrapper;
  isPlaceSearchComplete$: Observable<boolean>;
  isPlaceSearchPending = false;
  // placeSearchResult: SearchResult;

  amapWalkNaviPlugin: AmapWalkingWrapper;
  walkNaviResult: WalkingResult;
  isWalkNaviComplete$: Observable<boolean>;
  isWalkNaviPending = false;

  amapDriveNaviPlugin: AmapDrivingWrapper;
  driveNaviResult: DrivingResult;
  isDriveNaviComplete$: Observable<boolean>;
  isDriveNaviPending = false;

  pathToTransferStation: ILngLat[];
  pathToFactory: ILngLat[];
  dest: { factory: Position; transferStation: Position };

  private _destroy$ = new Subject<void>();

  public addressControl = new FormControl("", Validators.required);
  public categoryControl = new FormControl("");
  public isLineHovering: boolean = false;
  constructor(
    private readonly amapPlaceSearch: AmapPlaceSearchService,
    private readonly amapWalkNavi: AmapWalkingService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly pathSchedule: PathScheduleService,
    private readonly amapDriveNavi: AmapDrivingService,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    this.categoryControl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(value => {
        this.applyDriveNavi(value);
      });
      const a = IconService
    // tslint:disable-next-line: no-backbone-get-set-outside-model
    this.temp$ = this.http
      .get<StreetData[]>("./assets/sanityCheck.json")
      .pipe(takeUntil(this._destroy$));
  }
  ngOnDestroy() {
    // this.placeSearchErrorSub.unsubscribe();
    // this.walkNaviErrorSub.unsubscribe();
    // this.selectPoiChangeSub.unsubscribe();
    this._destroy$.next();
    this._destroy$.complete();
  }
  errorHandler(err: string) {
    this.snackBar.open(`something wrong: ${err}, pls retry`, "ok", {
      duration: 10000
    });
  }
  clearMarkers() {
    const amap = this.amap;
    const markers = amap.getAllOverlays("marker");
    amap.remove(markers);
  }
  showFactory() {
    this.clearMarkers();
    this.isShowFactory = !this.isShowFactory;
  }
  /**
   * showTrans
   */
  public showTrans() {
    this.clearMarkers;
    this.isShowTransferStation = !this.isShowTransferStation;
  }
  onLineHover(e: any, type: "mouseover" | "mouseout") {
    switch (type) {
      case "mouseover":
        e.target.setOptions({
          isOutline: true
        });
        break;
      case "mouseout":
        e.target.setOptions({
          isOutline: false
        });
        break;

      default:
        break;
    }
  }
  onLineClick(category: WASTE_CATEGORY) {
    this.dialog.open(ContentCardComponent, {
      data: { category, dest: this.dest }
    });
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
    const promiseDN = this.amapDriveNavi.of({
      // map: this.amap,
      autoFitView: true
    });
    Promise.all([promisePS, promiseWN, promiseDN])
      .then(plugins => {
        this.amapPlaceSearchPlugin = plugins[0];
        this.initPlaceSearch();
        this.amapWalkNaviPlugin = plugins[1];
        this.initWalkNavi();
        this.amapDriveNaviPlugin = plugins[2];
        this.initDriveNavi();
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
    this.amapPlaceSearchPlugin
      .on("selectChanged")
      .pipe(takeUntil(this._destroy$))
      .subscribe(selectChangeEvent => {
        this.selectedPoi = selectChangeEvent.selected.data;
      });
    this.amapPlaceSearchPlugin
      .on("error")
      .pipe(takeUntil(this._destroy$))
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
    this.amapPlaceSearchPlugin
      .on("error")
      .pipe(takeUntil(this._destroy$))
      .subscribe(err => this.errorHandler(err));
  }
  initDriveNavi() {
    this.isDriveNaviComplete$ = this.amapWalkNaviPlugin.on("complete").pipe(
      tap(res => (this.driveNaviResult = res)),
      map(res => (res.info === RESULT_STATUS.NO_DATA ? false : true)),
      share()
    );
    this.amapDriveNaviPlugin
      .on("error")
      .pipe(takeUntil(this._destroy$))
      .subscribe(err => this.errorHandler(err));
  }
  applyDriveNavi(category: WASTE_CATEGORY) {
    if (category === WASTE_CATEGORY.Harzard) return;
    const plugin = this.amapDriveNaviPlugin;
    const start = this.selectedPoi;
    const dest = this.pathSchedule.getPoint(start, category);
    const markers = this.amap.getAllOverlays("marker");
    this.dest = dest;
    this.isDriveNaviPending = true;
    Promise.all([
      plugin.search(start.location, dest.transferStation.lnglgt, {}),
      plugin.search(dest.transferStation.lnglgt, dest.factory.lnglgt, {})
    ])
      .then(driveResultes => {
        const status = driveResultes.every(
          result => result.status === RESULT_STATUS.COMPLETE
        );
        if (status) {
          let trans = driveResultes[0].result;
          let fac = driveResultes[1].result;
          this.assertDriveResult(trans);
          this.assertDriveResult(fac);
          this.pathToTransferStation = trans.routes[0].steps
            .map(step => step.path)
            .reduce((acc, x) => acc.concat(x), []);
          this.pathToFactory = fac.routes[0].steps
            .map(step => step.path)
            .reduce((acc, x) => acc.concat(x), []);
          this.amap.remove(markers);
          this.isShowFactory = false;
          this.isShowTransferStation = false;
          this.amap.setFitView();
        }
      })
      .catch(err => this.errorHandler(err))
      .finally(() => (this.isDriveNaviPending = false));
  }
  applyWalkNavi(category: WASTE_CATEGORY) {
    const plugin = this.amapWalkNaviPlugin;
    const start = this.selectedPoi;
    const dest = this.pathSchedule.getPoint(start, category);
    this.dest = dest;
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
          let resultTrans = walkResultes[0].result;
          let resultFac = walkResultes[1].result;
          this.assertWalkResult(resultTrans);
          this.assertWalkResult(resultFac);
          let routesTrans = resultTrans.routes;
          let routesFac = resultFac.routes;
          this.assertWalkRoutes(routesTrans);
          this.assertWalkRoutes(routesFac);
          // lib's type def of WalkingResult.routes was wrong
          this.pathToTransferStation = routesTrans[0].steps
            .map(step => step.path)
            .reduce((acc, val) => acc.concat(val), []);
          // resultTrans = walkResultes[1].result;
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
  private assertWalkRoutes(routes: any): asserts routes is WalkRoute[] {
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
  }
  private assertDriveResult(
    result: string | DrivingResult
  ): asserts result is DrivingResult {
    if (typeof result === "string") {
      throw new AssertionError();
    }
  }
}
