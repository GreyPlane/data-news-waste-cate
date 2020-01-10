import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AmapContainerComponent } from "./amap-container.component";
import { PathScheduleService } from "../path-schedule.service";
import { NgxAmapComponent } from "ngx-amap";

describe("AmapContainerComponent", () => {
  let component: AmapContainerComponent;
  let fixture: ComponentFixture<AmapContainerComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AmapContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmapContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
