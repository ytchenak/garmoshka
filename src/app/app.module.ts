import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { MeteorInputComponent } from './meteor-input/meteor-input.component';
import { SettingFormComponent } from './setting-form/setting-form.component';
import { FormsModule }   from '@angular/forms';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { SheetComponent } from './sheet/sheet.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { StatisticsComponent } from './statistics/statistics.component';
import { InstructionComponent } from './instruction/instruction.component';
import { HourToDegreeConverterComponent } from './hour-to-degree-converter/hour-to-degree-converter.component';

@NgModule({
  declarations: [
    AppComponent,
    MeteorInputComponent,
    SettingFormComponent,
    SheetComponent,
    StatisticsComponent,
    InstructionComponent,
    HourToDegreeConverterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule.withComponents([]),
    NgxWebstorageModule.forRoot(),
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
