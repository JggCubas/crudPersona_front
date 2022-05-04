
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource,MatTable } from '@angular/material/table';
import {MatTableModule} from '@angular/material/table';;
import { MatSort } from '@angular/material/sort';
import { MatIconRegistry } from '@angular/material/icon';
import { DateAdapter } from '@angular/material/core';

import {DatePipe} from '@angular/common';

import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { faPen,faTrash,faSquare } from '@fortawesome/free-solid-svg-icons';
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons';

import { MAT_DATE_FORMATS } from '@angular/material/core';
export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'YYYY-MM-DD',
    },
    display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};




import { peticiones_service } from './servicios';

export interface Personas {
  Id:number;
  Nombre:string;
  Ape_Pat:string;
  Ape_Mat:string;
  Rfc:string;
  Curp:string;
  Fecha_Nacimiento :string;
  Fecha_Alta :string;
  Fecha_Modificacion :string;
  Estatus_Id :number;
  Sexo_id :number;
  Persona_Tipo_id:number;
  Avatar:String;
}




var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styles: [],
  providers:  [ peticiones_service, {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS } ,DatePipe]
})
export class PersonasComponent implements OnInit {
  dataSource = new MatTableDataSource<Personas>();
  displayedColumns: string[] = ['acciones','nombre','ape_pat','ape_mat','rfc','curp'];
  selectSexo = [{'id':1,'label':'Masculino'},{'id':2,'label':'Femenino'}];
  selectEstatus = [{'id':1,'label':'Activo'},{'id':2,'label':'Inactivo'}];
  selectTipo = [{'id':1,'label':'Fisica'},{'id':2,'label':'moral'}];
  display = 'none';
  displayRemove = 'none';
  nombreRemove = "";
  editPersona = false;
  submitted = false;
  form_personas : FormGroup;
  fileUpload? : File;
  filePath? : string;
  reader = new FileReader();
  constructor(public objpeticiones_service: peticiones_service,library: FaIconLibrary,private formBuilder: FormBuilder,private dateAdapter: DateAdapter<Date>,private datePipe: DatePipe) {
    library.addIcons(faPen,faTrash,faRectangleXmark);
    this.dateAdapter.setLocale('Es-es');
    this.form_personas = this.formBuilder.group(
      {
        Id : [''],
        Nombre : ['',Validators.required],
        Ape_Pat : ['',Validators.required],
        Ape_Mat : [''],
        Rfc : ['',[Validators.required,Validators.maxLength(13), Validators.minLength(13)]],
        Curp : ['',[Validators.required,Validators.maxLength(18), Validators.minLength(18)]],
        Fecha_Nacimiento : [''],
        Fecha_Alta : [''],
        Fecha_Modificacion : [''],
        Estatus_Id : ['',Validators.required],
        Sexo_id : [0,Validators.required],
        Persona_Tipo_id : ['',Validators.required],
        Avatar : [''],
      }
    );

   }
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  ngOnInit(): void {
    this.getList();
    this.reader.onload = (_event) => {
      this.filePath = this.reader.result as string;
    }
  }
  selectFile(event: any) { //Angular 11, for stricter type
    if(!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }
    const mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      return;
    }


    this.reader.readAsDataURL(event.target.files[0]);
    this.fileUpload = event.target.files[0];

  }

  getList(){
    this.objpeticiones_service.getListPersonas().subscribe((data)=>{
      this.dataSource = new MatTableDataSource<Personas>(data);
      this.dataSource.sort = this.sort;
    });
  }
  closeModal() {
    this.display = 'none';
    this.displayRemove = 'none';
  }
  edit(row_obj:any){
    this.submitted = false;
    this.editPersona = true;
    this.filePath = "";
    this.form_personas.setValue(row_obj);
    this.display = 'block';
    this.filePath = this.objpeticiones_service.getPath()+'/'+this.form_personas.value.Avatar;
  }
  viewPop(){
    this.submitted = false;
    this.form_personas.reset();
    this.editPersona = false;
    this.display = 'block';
  }//Endfuncion
  saveNewPersona(){
    this.submitted = true;
    if (this.form_personas.invalid) {return;}

    let data = this.dataSource.data;
    if(this.editPersona){
      this.objpeticiones_service.uploadFile(this.fileUpload!).subscribe((url)=>{
        if(typeof url['body'] !== 'undefined' ){
          this.form_personas.patchValue({
            Fecha_Nacimiento: this.datePipe.transform(this.form_personas.value.Fecha_Nacimiento, 'yyyy-MM-dd')
          });
          this.form_personas.patchValue({
            Avatar: url['body']['ruta']
          });
          let resource = this.form_personas.value;
          this.objpeticiones_service.updatePersona(resource.Id,resource).subscribe((result)=>{
            this.dataSource.data[this.dataSource.data.findIndex(item => item.Id == result.Id)] = result;
            this.dataSource.data = this.dataSource.data;
          });
        }

      });
    }else{
      this.objpeticiones_service.uploadFile(this.fileUpload!).subscribe((url)=>{
        if(typeof url['body'] !== 'undefined' ){
          this.form_personas.patchValue({
            Fecha_Nacimiento: this.datePipe.transform(this.form_personas.value.Fecha_Nacimiento, 'yyyy-MM-dd')
          });
          this.form_personas.patchValue({
            Avatar: url['body']['ruta']
          });
          let resource = this.form_personas.value;
          this.objpeticiones_service.setNewPersona(resource).subscribe((result)=>{
            data.push(result);
            this.dataSource.data = data;
          });
        }
      });
    }
    this.display = 'none';
  }
  confirmRemovePersona(){
    this.objpeticiones_service.removePersona(this.form_personas.value.Id).subscribe((result)=>{
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
       return value.Id != this.form_personas.value.Id;
      });
      this.display = 'none';
      this.displayRemove = 'none';
      this.form_personas.reset();
    });
  }
  remove(row_obj:any){
    this.displayRemove = 'block';
    this.nombreRemove = row_obj;
    this.form_personas.setValue(row_obj);
  }

  get f() {
     return this.form_personas.controls;
  }


}
