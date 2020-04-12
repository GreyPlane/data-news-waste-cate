import { Component } from "@angular/core";
import { Map } from "ngx-amap";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = '上海市垃圾流通网络';
  public map?: Map = null;
  constructor(breakPointObserver: BreakpointObserver) {}
  run() {
    window.alert("wwwwwww");
  }
  async runAs() {}
  onMapReady(map: Map) {
    this.map = map;

  }
}
