import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeteorInputComponent } from './meteor-input/meteor-input.component';
import { SettingFormComponent } from './setting-form/setting-form.component';

const routes: Routes = [
  {path: 'meteor-input', component: MeteorInputComponent},
  {path: 'setting', component: SettingFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
