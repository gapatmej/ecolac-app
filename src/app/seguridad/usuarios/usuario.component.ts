import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {AppComponent} from './../../app.component';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';
import {UsuarioDTO } from './../../modelos/seguridad/usuario';
import {RolDTO } from './../../modelos/seguridad/rol';

import {UsuarioService} from './../../servicios/seguridad/UsuarioService';
import {RolService} from './../../servicios/seguridad/RolService';

import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import * as sha256 from 'sha256';

@Component({
	templateUrl: './usuario.component.html',
	styleUrls: ['./usuario.component.css']
})


export class UsuarioComponent implements OnInit {

	@ViewChild('search') public searchElement: ElementRef;

	public zoom:  number=13;
	public miLat: number= -0.1833633258650444;
	public miLong: number= -78.46525753198398;
	public editado = false;
	public nuevo = false;
	public usuarioDTO = new UsuarioDTO();
	public rolDTOSeleccionado = new RolDTO();

	public listaUsuarios = new Array<UsuarioDTO>();
	public listaRoles = new Array<RolDTO>();

	public jsonInputUsuarios = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_USU);
	public jsonInputRoles = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_ROL);
	public jsonOutput = new jsonOutput();

	constructor(private _usuarioService: UsuarioService, private _rolService: RolService, 
		@Inject(SESSION_STORAGE) private storage:StorageService, 
		private router: Router,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone){
	}

	ngOnInit(){
		this.limpiar();

	}

	nuevoRegistro(){
		this.nuevo = true;
		this.consultarRoles();
		this.cargarCiudades();
		this.usuarioDTO = new UsuarioDTO();	
		this.usuarioDTO.latitud = -0.1833633258650444;
		this.usuarioDTO.longitud = -78.46525753198398;


	}

	limpiar(){
		this.editado = false;
		this.nuevo = false;
		this.cargarUsuarios();
		this.usuarioDTO = new UsuarioDTO();
		AppComponent.modal = false;
	}

	guardar(formUsuario:NgForm){
		if(formUsuario.valid){
			AppComponent.modal = true;
			if(this.nuevo){
				this.jsonInputUsuarios.headerInput.transaccion = ValoresGlobales.S_CREAR_USUARIO_001;
			}else{
				this.jsonInputUsuarios.headerInput.transaccion = ValoresGlobales.S_ACTUALIZAR_USUARIO_001;
			}

			this.jsonInputUsuarios.bodyInput.data = {UsuarioDTO: this.usuarioDTO};
			this._usuarioService.guardar( this.jsonInputUsuarios )
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
			console.log(this.usuarioDTO);
		}else{
			alert("Formulario invalido");
		}
		

	}

	cargarUsuarios(){
		this.listaUsuarios = new Array<UsuarioDTO>();
		this.jsonInputUsuarios.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_USUARIOS_001;

		this._usuarioService.consultarTodos( this.jsonInputUsuarios )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaUsuarios.push(value.UsuarioDTO);
			}); 

		});	
	}

	cargarCiudades(){
		this.mapsAPILoader.load().then(
			() => {
				let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types:["address"] });

				autocomplete.addListener("place_changed", () => {
					this.ngZone.run(() => {
						let place: google.maps.places.PlaceResult = autocomplete.getPlace();
						this.usuarioDTO.latitud = place.geometry.location.lat();
						this.usuarioDTO.longitud = place.geometry.location.lng();
						if(place.geometry === undefined || place.geometry === null ){

							return;
						}
					});
				});
			}
			);
	}

	consultarRoles(){
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

	editar(usuario: UsuarioDTO){
		this.consultarRoles();
		this.cargarCiudades();
		this.usuarioDTO = usuario;
		this.editado = true;
		usuario.roles.forEach(value => {
			this.listaRoles.splice(this.listaRoles.findIndex(i => i.idRol == value.RolDTO.idRol),1);
		}); 
	}

	eliminar(usuario: UsuarioDTO){
		this.usuarioDTO = usuario;
		this.usuarioDTO.activo = false;
		this.guardar();
	}

	capturarRol(rol: RolDTO){
		this.rolDTOSeleccionado = rol;
	}

	agregarRol(){
		this.usuarioDTO.roles.push({RolDTO: this.rolDTOSeleccionado});
		this.listaRoles.splice(this.listaRoles.findIndex(i => i.idRol == this.rolDTOSeleccionado.idRol),1);
		document.getElementById("spanSeleccione").innerHTML = "Seleccione un rol";
	}

	eliminarRol(rol: RolDTO){
		this.listaRoles.push(rol.RolDTO);
		this.usuarioDTO.roles.splice(this.usuarioDTO.roles.findIndex(i => i.RolDTO.idRol == rol.RolDTO.idRol),1);
		//alert(this.usuarioDTO.recursos.findIndex(i => i.RecursoDTO.idRecurso == "3"));
	}

	marcarSitio($event){
		//console.log($event);
		this.usuarioDTO.latitud = $event.coords.lat;
		this.usuarioDTO.longitud =  $event.coords.lng;
	}







}