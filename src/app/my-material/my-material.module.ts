import { DragDropModule } from "@angular/cdk/drag-drop/public-api";
import { LayoutModule } from "@angular/cdk/layout/index";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper/index";
import { NgModule } from "@angular/core";
import { MatButtonToggleModule } from "@angular/material/button-toggle/index";
import { MatButtonModule } from "@angular/material/button/index";
import { MatCardModule } from "@angular/material/card/index";
import { MatDialogModule } from "@angular/material/dialog/index";
import { MatExpansionModule } from "@angular/material/expansion/index";
import { MatIconModule } from "@angular/material/icon/index";
import { MatInputModule } from "@angular/material/input/index";
import { MatListModule } from "@angular/material/list/index";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner/index";
import { MatSidenavModule } from "@angular/material/sidenav/index";
import { MatSnackBarModule } from "@angular/material/snack-bar/index";
import { MatStepperModule } from "@angular/material/stepper/index";
import { MatTabsModule } from "@angular/material/tabs/index";
import { MatToolbarModule } from "@angular/material/toolbar/index";

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonToggleModule,
    MatInputModule,
    MatExpansionModule,
    MatStepperModule,
    DragDropModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ],
  exports: [
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonToggleModule,
    MatInputModule,
    MatExpansionModule,
    MatStepperModule,
    DragDropModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class MyMaterialModule {}
