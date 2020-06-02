import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { sankey, sankeyJustify, sankeyLinkHorizontal } from "d3-sankey";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import {
  ALIGNMENT,
  Graph,
  Link,
  LinkData,
  Node,
  NodeData,
} from "src/types/sankey";
@Component({
  selector: "app-sankey",
  templateUrl: "./sankey.component.html",
  styleUrls: ["./sankey.component.scss"],
})
export class SankeyComponent implements OnInit, OnChanges {
  @Input() alignment: ALIGNMENT = ALIGNMENT.JUSTIFY;
  @Input() nodeWidth = 15;
  @Input() nodePadding = 10;
  @Input() margin = { top: 20, bottom: 20, left: 20, right: 20 };
  @Input() labelPadding = "0.35em";

  @Input() svgWidth: number;
  @Input() svgHeight: number;
  @Input() nodes: Node[];
  @Input() links: Link[];

  sankeyLayout: Graph;
  colorScale = scaleOrdinal(schemeCategory10);
  constructor() {}

  ngOnInit() {
    this.sankeyLayout = this.generate();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!(changes.links.isFirstChange && changes.nodes.isFirstChange())) {
      const links = changes.links.currentValue;
      const nodes = changes.nodes.currentValue;
      this.sankeyLayout = this.generate(links, nodes);
    }
  }

  private generate(nodes = this.nodes, links = this.links) {
    const width = this.svgWidth;
    const height = this.svgHeight;

    const align = sankeyJustify;
    const generator = sankey<NodeData, LinkData>()
      .nodeAlign(align)
      .nodeWidth(this.nodeWidth)
      .nodePadding(this.nodePadding)
      .extent([
        [20, 20],
        [
          width - this.margin.left - this.margin.right,
          height - this.margin.top - this.margin.bottom,
        ],
      ])
      .nodeId((d) => d.id);
    const data = {
      nodes,
      links,
    };
    const layout = generator(data);

    for (const node of layout.nodes) {
      node.color =
        node.color === undefined ? this.colorScale(node.name) : node.color;
      node.label = {
        x: node.x0 < width / 2 ? node.x1 + 6 : node.x0 - 50,
        y: (node.y1 + node.y0) / 2,
        dy: this.labelPadding,
      };
    }
    for (const link of layout.links) {
      if (typeof link.source === "number") {
        link.color = this.colorScale(link.source.toString());
      } else if (typeof link.source === "string") {
        link.color = this.colorScale(link.source);
      } else {
        link.color = this.colorScale(link.source.name);
      }
      link.path = sankeyLinkHorizontal()(link);
      link.width = Math.max(1, link.width);
    }
    return layout;
  }
}
