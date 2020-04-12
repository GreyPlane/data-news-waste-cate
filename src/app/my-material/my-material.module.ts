import { DragDropModule } from "@angular/cdk/drag-drop";
import { LayoutModule } from "@angular/cdk/layout";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
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
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule
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
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule
  ]
})
export class MyMaterialModule {}
