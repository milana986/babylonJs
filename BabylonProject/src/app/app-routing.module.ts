import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { TextureComponent } from './components/texture/texture.component';
import { CoordinateSystemComponent } from './components/coordinate-system/coordinate-system.component';
import { ExtrudeComponent } from './components/extrude/extrude.component';

const routes: Routes = [
  { path: 'main', component: MainComponent},
  { path: 'texture' , component: TextureComponent },
  { path: 'coordinateSystem' , component: CoordinateSystemComponent },
  { path: 'extrude', component: ExtrudeComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' } , 
  { path: '**', redirectTo: 'main', pathMatch: 'full' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
