import { Component, OnInit } from '@angular/core';
import { MeteorService } from '../meteor.service';
import { Router } from '@angular/router';
import { SettingFormComponent } from '../setting-form/setting-form.component';
import { MeteorInputComponent } from '../meteor-input/meteor-input.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss']
})
export class SheetComponent implements OnInit {

  columnDefs = [];
  rowData = [];

  gridApi: any;

  constructor(
    private meteorService: MeteorService,
    private router: Router) { 
  }

  getData() {
    if( this.router.url === '/count-distribution')
      return this.meteorService.countDistribution;
    else if( this.router.url === '/magnitude-distribution')
      return this.meteorService.magnitudeDistribution;
    else return null;
  }

  ngOnInit() {
    let input = new MeteorInputComponent(this.meteorService);
    this.meteorService.calc(input.dataValues);

    let data = this.getData();
    for (let i = 1; i < data[1].length; i++) {
      let minWidth = 0;
      if( i<4)
        minWidth = 100;
      this.columnDefs.push( {
        headerName: data[1][i],
        minWidth: minWidth,
        field: i.toLocaleString() 
      });
    }
    for (let i = 2; i < data.length; i++) {
      if( data[i][1] === undefined)
        break;
      this.rowData.push(data[i]);
    }

  }

  onGridReady($event) {
    this.gridApi = $event.api;
    this.gridApi.sizeColumnsToFit()
  }

  onExport() {
    var setting = new SettingFormComponent();
    let name = setting.name;
    if( name !== '' )
      name += ' ';
    if( this.router.url === '/count-distribution')
      name += 'Count Distribution';
    else if( this.router.url === '/magnitude-distribution')
      name += 'Magnitude Distribution';
    name += '.csv';
    var params = {
      fileName: name,
      suppressQuotes: true
    };
    var csv = this.gridApi.getDataAsCsv(params);
    var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
    saveAs(blob, name);
  }
}
