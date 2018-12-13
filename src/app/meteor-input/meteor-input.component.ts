import { Component, OnInit } from '@angular/core';
import { MeteorService } from '../meteor.service';
import { LocalStorage } from 'ngx-webstorage';
import { getInjectorIndex } from '@angular/core/src/render3/di';

@Component({
  selector: 'app-meteor-input',
  templateUrl: './meteor-input.component.html',
  styleUrls: ['./meteor-input.component.scss']
})
export class MeteorInputComponent implements OnInit {

  columnDefs = [
    {headerName: '#', valueGetter: this.getIndex, editable: false, width: 50},
    {headerName: 'Data', field: 'data'  , editable: true},
  ];

  getIndex(params) {
    return params.node.childIndex + 1;
  }

  private gridApi;

  @LocalStorage() rowData: Array<{data: string}>;

  constructor(private meteorService: MeteorService) { 
  }

  ngOnInit() {
    if( !this.rowData)
      this.rowData = this.cleanRowData();
  }

  cleanRowData(): Array<{data: string}> {
    let rowData = new Array<{data: string}>();
    for (let i = 0; i < 999; i++) {
      rowData.push({data: ''});   
    }
    return rowData;
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.setFocusedCell(0, "data");
    
  }

  onClean() {
    this.rowData = this.cleanRowData();
    this.gridApi.setRowData(this.rowData);
  }

  onInsert() {
    let index = this.gridApi.getFocusedCell().rowIndex;
    this.rowData.splice(index+1, 0, {data: ''});
    this.gridApi.setRowData(this.rowData);
    this.gridApi.setFocusedCell(index, "data");
  }

  onDelete() {
    let index = this.gridApi.getFocusedCell().rowIndex;
    this.rowData.splice(index, 1);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.setFocusedCell(index, "data");
  }

  get dataValues() {
    return this.rowData.map( x => x.data);
  }

  onCellValueChanged($event) {
    //trigger save the dat in web storage    
    this.rowData = this.rowData;
    try {
      this.meteorService.calc(this.dataValues);
    } catch(e) {
      alert(e);
    }
  }

  onPaste() {

    navigator['clipboard'].readText()
      .then(text => {
        let data: [] = text.split('\n');
        let i = 0;
        for(; i<data.length; i++) {
          this.rowData[i] = {data: data[i]};
        }
        for(; i<999; i++) {
          this.rowData[i] = {data: ''}
        }
        this.gridApi.setRowData(this.rowData);
        this.rowData = this.rowData;
      })
    .catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });


  }

}
