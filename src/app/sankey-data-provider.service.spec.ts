import { TestBed } from "@angular/core/testing";

import { SankeyDataProviderService } from "./sankey-data-provider.service";
import { PathScheduleService } from "src/app/path-schedule.service";
const path = new PathScheduleService();
describe("SankeyDataProviderService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{provider: "PathScheduleService", useValue: path}]
    })
  );

  it("should be created", () => {
    const service: SankeyDataProviderService = TestBed.get(
      SankeyDataProviderService
    );
    expect(service).toBeTruthy();
  });
});
