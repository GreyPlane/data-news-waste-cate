import { Component } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, share } from "rxjs/operators";
import { WASTE_CATEGORY, wasteCategroiesName } from "src/constants/enum";
import { MatDialog } from "@angular/material/dialog";
import { SankeyDemoComponent } from "src/app/sankey-demo/sankey-demo.component";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"]
})
export class SearchBarComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );
  wasteCategroies: WASTE_CATEGORY[] = [
    WASTE_CATEGORY.Dry,
    // WASTE_CATEGORY.Harzard,
    WASTE_CATEGORY.Moist,
    WASTE_CATEGORY.Recycle
  ];
  names = wasteCategroiesName;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private readonly dialog: MatDialog
  ) {}

  openSankeyDialog(category: WASTE_CATEGORY) {
    this.dialog.open(SankeyDemoComponent, {
      data: category
    });
  }
}
