import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {AppComponent} from './../../app.component';

import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';
import {RolDTO } from './../../modelos/seguridad/rol';
import {RecursoDTO } from './../../modelos/seguridad/recurso';

import {RolService} from './../../servicios/seguridad/RolService';
import {RecursoService} from './../../servicios/seguridad/RecursoService';

@Component({
	templateUrl: './rol.component.html'
})


export class RolComponent implements OnInit {
	//static readonly routerNavigate = "publico";
	public editado = false;
	public rolDTO = new RolDTO();
	public recursoDTOSeleccionado = new RecursoDTO();

	public listaRoles = new Array<RolDTO>();
	public listaRecursos = new Array<RecursoDTO>();

	public jsonInputRoles = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_ROL);
	public jsonInputRecursos = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_ROL);
	public jsonOutput = new jsonOutput();

	constructor(private _rolService: RolService, private _recursoService: RecursoService, 
		@Inject(SESSION_STORAGE) private storage:StorageService, 
		private router: Router){

	}

	ngOnInit(){
		this.limpiar();
	}

	nuevo(){
		this.editado = true;
		this.consultarRecursos();
		this.rolDTO = new RolDTO();
	}

	limpiar(){
		this.editado = false;
		this.cargarRoles();
		this.consultarRecursos();
		this.rolDTO = new RolDTO();
		//this.recursoDTOSeleccionado = new RecursoDTO();
		AppComponent.modal = false;
	}

	guardar(){
		AppComponent.modal = true;
		if(this.rolDTO.idRol){
			this.jsonInputRoles.headerInput.transaccion = ValoresGlobales.S_ACTUALIZAR_ROL_001;
		}else{
			this.jsonInputRoles.headerInput.transaccion = ValoresGlobales.S_CREAR_ROL_001;
		}
		
		this.jsonInputRoles.bodyInput.data = {RolDTO: this.rolDTO};
		this._rolService.guardar( this.jsonInputRoles )
		.subscribe(response =>{
			this.jsonOutput = response;
			if(response.errorOutput.codigoError == "0"){
				alert("Transaccion completa");
				this.limpiar();
			}
			else{
				alert("Hubo un problema con la transaccion");
			}
		});

	}

	cargarRoles(){
		this.listaRoles = new Array<RolDTO>();
		this.jsonInputRoles.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_ROLES_001;

		this._rolService.consultarTodos( this.jsonInputRoles )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaRoles.push(value.RolDTO);
			}); 

		});	
	}

	consultarRecursos(){
		this.listaRecursos = new Array<RecursoDTO>();
		this.jsonInputRecursos.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_RECURSOS_001;

		this._recursoService.consultarTodos( this.jsonInputRecursos )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				//alert(value.RecursoDTO.toSource());
				this.listaRecursos.push(value.RecursoDTO);
			}); 
		});	
	}

	editar(rol: RolDTO){
		this.rolDTO = rol;
		this.editado = true;
		rol.recursos.forEach(value => {
			this.listaRecursos.splice(this.listaRecursos.findIndex(i => i.idRecurso == value.RecursoDTO.idRecurso),1);
		}); 
	}

	eliminar(rol:RolDTO){
		this.rolDTO = rol;
		this.rolDTO.activo = false;
		this.guardar();
	}

	capturarRecurso(recurso: RecursoDTO){
		this.recursoDTOSeleccionado = recurso;
	}

	agregarRecurso(){
		this.rolDTO.recursos.push({RecursoDTO: this.recursoDTOSeleccionado});
		this.listaRecursos.splice(this.listaRecursos.findIndex(i => i.idRecurso == this.recursoDTOSeleccionado.idRecurso),1);
		document.getElementById("spanSeleccione").innerHTML = "Seleccione un recurso";
	}

	eliminarRecurso(recurso: RecursoDTO){
		this.listaRecursos.push(recurso.RecursoDTO);
		this.rolDTO.recursos.splice(this.rolDTO.recursos.findIndex(i => i.RecursoDTO.idRecurso == recurso.RecursoDTO.idRecurso),1);
		//alert(this.rolDTO.recursos.findIndex(i => i.RecursoDTO.idRecurso == "3"));
	}

}