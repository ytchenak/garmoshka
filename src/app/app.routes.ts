import { Routes } from '@angular/router';
import { MeteorInputComponent } from './meteor-input/meteor-input.component';
import { SettingFormComponent } from './setting-form/setting-form.component';
import { SheetComponent } from './sheet/sheet.component';

export const routes: Routes = [
  { path: 'meteor-input', component: MeteorInputComponent },
  { path: 'setting', component: SettingFormComponent },
  { path: 'count-distribution', component: SheetComponent },
  { path: 'magnitude-distribution', component: SheetComponent },
  { path: '', redirectTo: '/meteor-input', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
