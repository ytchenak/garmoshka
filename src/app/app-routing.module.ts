import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeteorInputComponent } from './meteor-input/meteor-input.component';
import { SettingFormComponent } from './setting-form/setting-form.component';
import { SheetComponent } from './sheet/sheet.component';

const routes: Routes = [
  {path: 'meteor-input', component: MeteorInputComponent},
  {path: 'setting', component: SettingFormComponent},
  {path: 'count-distribution', component: SheetComponent},
  {path: 'magnitude-distribution', component: SheetComponent},
  {path: '', redirectTo: '/setting', pathMatch: 'full'},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
