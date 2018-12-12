import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeteorInputComponent } from './meteor-input/meteor-input.component';

const routes: Routes = [
  {path: 'meteor-input', component: MeteorInputComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
