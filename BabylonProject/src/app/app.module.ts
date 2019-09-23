import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { TextureComponent } from './components/texture/texture.component';
import { CoordinateSystemComponent } from './components/coordinate-system/coordinate-system.component';
import { ExtrudeComponent } from './components/extrude/extrude.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    TextureComponent,
    CoordinateSystemComponent,
    ExtrudeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
