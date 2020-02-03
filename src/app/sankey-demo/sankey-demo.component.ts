import { Component, OnInit } from "@angular/core";
import { SankeyDataProviderService } from "src/app/sankey-data-provider.service";
import { WASTE_CATEGORY } from "src/constants/enum";
import { Observable } from "rxjs";
import { Link, Node } from "src/types/sankey";
@Component({
  selector: "app-sankey-demo",
  templateUrl: "./sankey-demo.component.html",
  styleUrls: ["./sankey-demo.component.scss"],
  providers: [SankeyDataProviderService]
})
export class SankeyDemoComponent implements OnInit {
  data$: Observable<{ nodes: Node[]; links: Link[] }>;
  links: Link[];
  nodes: Node[];
  constructor(private sankeyDataProvider: SankeyDataProviderService) {}

  ngOnInit() {
    this.sankeyDataProvider
      .getData(WASTE_CATEGORY.Dry)
      .subscribe(
        x =>
         console.log(x));
    this.nodes = [
      { id: "Alice", name: "Alice" },
      { id: "Bob", name: "Bob" },
      { id: "Carol", name: "Carol" },
      { id: "Ashish", name: "Ashish" },
      { id: "Tejas", name: "Tejas" }
    ];
    this.links = [
      { source: 0, target: 1, value: 30 },
      { source: 0, target: 2, value: 70 },
      { source: 1, target: 2, value: 10 },
      { source: 3, target: 1, value: 50 },
      { source: 4, target: 2, value: 50 }
    ];
  }
}
