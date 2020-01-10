import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sankey-demo',
  templateUrl: './sankey-demo.component.html',
  styleUrls: ['./sankey-demo.component.scss']
})
export class SankeyDemoComponent implements OnInit {
  nodes = []
  links = []
  constructor() { }

  ngOnInit() {
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
