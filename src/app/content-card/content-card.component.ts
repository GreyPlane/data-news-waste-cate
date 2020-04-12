import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WASTE_CATEGORY, wasteCategroiesName } from "src/constants/enum";
import { text } from "src/constants/text";
import { Position } from "src/types/data";

@Component({
  selector: "app-content-card",
  templateUrl: "./content-card.component.html",
  styleUrls: ["./content-card.component.scss"]
})
export class ContentCardComponent {
  categroy: string = wasteCategroiesName[this.data.category];
  dest: { factory: Position; transferStation: Position } = this.data.dest;
  content: string = text[this.data.category];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      category: WASTE_CATEGORY;
      dest: { factory: Position; transferStation: Position };
    }
  ) {}
}
