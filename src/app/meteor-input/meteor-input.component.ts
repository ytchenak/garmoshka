import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meteor-input',
  templateUrl: './meteor-input.component.html',
  styleUrls: ['./meteor-input.component.scss']
})
export class MeteorInputComponent implements OnInit {

  columnDefs = [
    {headerName: '#', field: 'index', width: 50},
    {headerName: 'Data', field: 'data', editable: true},
  ];

  private gridApi;

  rowSelection = 'single';
  rowData = [];


  constructor() { 
    for (let i = 0; i < 999; i++) {
      this.rowData.push({index: i+1, data: ''});   
    }
  }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    let idSequence = 0;
    this.gridApi.forEachNode( function(rowNode, index) {
      rowNode.id = idSequence++;
    });
  }

  onClean() {
    this.rowData.forEach( x => x.data = '');
    this.gridApi.setRowData(this.rowData);
  }

  onInsert() {
    var selectedData = this.gridApi.getSelectedRows();
    let index = selectedData[0].index;
    this.rowData.splice(index, 0, [{index: index+1, data: ''}]);
    index = 1;
    this.rowData.forEach( x => x.index = index++);
    this.gridApi.setRowData(this.rowData);
  }

  onDelete() {
    var selectedData = this.gridApi.getSelectedRows();
    let index = selectedData[0].index;
    this.rowData.splice(index-1, 1);
    index = 1;
    this.rowData.forEach( x => x.index = index++);
    this.gridApi.setRowData(this.rowData);
  }

  // onEdit() {
  //   var selectedData = this.gridApi.getSelectedRows();
  //   let index = selectedData[0].index;
  //   this.gridApi.startEditingCell({
  //     rowIndex: index-1,
  //     colKey: "data"
  //   });
  // }
  onCalc() {

  }
}
