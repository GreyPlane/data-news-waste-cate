import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog/index";
import { WASTE_CATEGORY, wasteCategroiesName } from "src/constants/enum";
import { text } from "src/constants/text";

@Component({
  selector: "app-content-card",
  templateUrl: "./content-card.component.html",
  styleUrls: ["./content-card.component.scss"]
})
export class ContentCardComponent {
  categroy: string = wasteCategroiesName[this.data.category];
  content: string = text[this.data.category];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { category: WASTE_CATEGORY }
  ) {}
}
