import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NgxAmapModule } from "ngx-amap";
import { AmapContainerComponent } from "src/app/amap-container/amap-container.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppComponent } from "src/app/app.component";
import { ContentCardComponent } from "src/app/content-card/content-card.component";
import { MyMaterialModule } from "src/app/my-material/my-material.module";
import { SankeyDemoComponent } from "src/app/sankey-demo/sankey-demo.component";
import { SankeyComponent } from "src/app/sankey/sankey.component";
import { SearchBarComponent } from "src/app/search-bar/search-bar.component";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    AmapContainerComponent,
    ContentCardComponent,
    SankeyComponent,
    SankeyDemoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MyMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      // { path: './', component: SearchBarComponent },
      //  { path: './Series1', component: AmapContainerComponent }
    ]),
    NgxAmapModule.forRoot({
      apiKey: "ff0a330405d98023522079e8380de656"
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
