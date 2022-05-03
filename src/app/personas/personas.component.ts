
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl,FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource,MatTable } from '@angular/material/table';
import {MatTableModule} from '@angular/material/table';;
import { MatSort } from '@angular/material/sort';
import { MatIconRegistry } from '@angular/material/icon';



import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { faPen,faTrash,faSquare } from '@fortawesome/free-solid-svg-icons';
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons';






import { peticiones_service } from './servicios';

export interface Personas {
  Id:string;
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
  providers:  [ peticiones_service ]
})
export class PersonasComponent implements OnInit {
  dataSource = new MatTableDataSource<Personas>();
  displayedColumns: string[] = ['acciones','nombre','ape_pat','ape_mat','rfc','curp'];
  display = 'none';
  editPersona = false;
  submitted = false;
  form_personas : FormGroup;
  constructor(public objpeticiones_service: peticiones_service,library: FaIconLibrary,private formBuilder: FormBuilder) {
    library.addIcons(faPen,faTrash,faRectangleXmark);
    this.form_personas = this.formBuilder.group(
      {
        Id : [''],
        Nombre : ['',Validators.required],
        Ape_Pat : [''],
        Ape_Mat : [''],
        Rfc : [''],
        Curp : [''],
        Fecha_Nacimiento : [''],
        Fecha_Alta : [''],
        Fecha_Modificacion : [''],
        Estatus_Id : [''],
        Sexo_id : [''],
        Persona_Tipo_id : [''],
        Avatar : [''],
      }
    );
   }
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  ngOnInit(): void {
    this.getList();

  }
  getList(){
    this.objpeticiones_service.getListPersonas().subscribe((data)=>{
      this.dataSource = new MatTableDataSource<Personas>(data);
      this.dataSource.sort = this.sort;
    });
  }
  closeModal() {
    this.display = 'none';
  }
  edit(row_obj:any){
    this.editPersona = true;
    this.form_personas.setValue(row_obj);
    this.display = 'block';
  }
  viewPop(){
    this.form_personas.reset();
    this.editPersona = false;
    this.display = 'block';
  }//Endfuncion
  saveNewPersona(){
    this.submitted = true;
    if (this.form_personas.invalid) {
      return;
    }
    let data = this.dataSource.data;
    if(this.editPersona){
      // this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      //    if(value.Id == this.newPersona.Id){
      //      value.Nombre = this.newPersona.Nombre;
      //    }
      //    return true;
      //  });
    }else{
      // this.newPersona.Id = ID();
      // data.push(this.newPersona);
      // this.dataSource.data = data;
    }
    localStorage.setItem('listPersonas', JSON.stringify(this.dataSource.data));
    this.display = 'none';
  }
  onFileSelected(event: any):void {
     // var selectedFile = event.target.files[0];
     // this.newPersona.documento =  selectedFile.name;
    }
  remove(row_obj:any){

    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
     return value.Id != row_obj.Id;
    });
    localStorage.setItem('listPersonas', JSON.stringify(this.dataSource.data));
  }
  get f(): { [key: string]: AbstractControl } {
     return this.form_personas.controls;
   }
}
