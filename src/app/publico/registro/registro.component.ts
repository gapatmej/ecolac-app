import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';

import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';

import {UsuarioDTO } from './../../modelos/seguridad/usuario';

import {UsuarioService} from './../../servicios/seguridad/UsuarioService';

import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';

import * as sha256 from 'sha256';

@Component({
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css']
})


export class RegistroComponent implements OnInit{

	@ViewChild('search') public searchElement: ElementRef;

	public zoom:  number=13;
	public miLat: number= -0.1833633258650444;
	public miLong: number= -78.46525753198398;

	public usuarioDTO :UsuarioDTO;

	public jsonInputUsuarios = new jsonInput("", ValoresGlobales.R_PUBLICO);

	public jsonOutput = new jsonOutput();

	constructor(private _usuarioService: UsuarioService,
		private router: Router, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone){
	}

	ngOnInit(){
		this.usuarioDTO = new UsuarioDTO();
		this.cargarCiudades();
	}
	
	registrarUsuario(){
		this.jsonInputUsuarios.headerInput.transaccion = ValoresGlobales.S_CREAR_USUARIO_002;
		
		this.usuarioDTO.password = sha256(this.usuarioDTO .password);
		this.usuarioDTO.latitud = this.miLat;
		this.usuarioDTO.longitud = this.miLong;
		this.jsonInputUsuarios.bodyInput.data = {UsuarioDTO: this.usuarioDTO};
		this._usuarioService.guardar( this.jsonInputUsuarios )
		.subscribe(response =>{
			this.jsonOutput = response;
			if(response.errorOutput.codigoError == "0"){
				this.router.navigate(['/login']);
				alert("Transaccion completa");
			}
			else{
				alert("Hubo un problema con la transaccion");
			}
		});
	}

	marcarSitio($event){
		this.miLat = $event.coords.lat;
		this.miLong =  $event.coords.lng;
	}

	cargarCiudades(){
		this.mapsAPILoader.load().then(
			() => {
				let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types:["address"] });

				autocomplete.addListener("place_changed", () => {
					this.ngZone.run(() => {
						let place: google.maps.places.PlaceResult = autocomplete.getPlace();
						this.miLat = place.geometry.location.lat();
						this.miLong = place.geometry.location.lng();
						if(place.geometry === undefined || place.geometry === null ){

							return;
						}
					});
				});
			}
			);
	}

}