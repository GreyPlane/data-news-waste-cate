import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SankeyDemoComponent } from './sankey-demo.component';

describe('SankeyDemoComponent', () => {
  let component: SankeyDemoComponent;
  let fixture: ComponentFixture<SankeyDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SankeyDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SankeyDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
