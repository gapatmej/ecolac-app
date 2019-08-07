import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import {ValoresGlobales} from './../../modelos/valoresGlobales';

import {AppComponent} from './../../app.component';

import {LoginService} from './../../servicios/seguridad/LoginService';

import {UsuarioDTO} from './../../modelos/seguridad/usuario';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';

import * as sha256 from 'sha256';


@Component({
	templateUrl: './login.component.html'
})


export class LoginComponent implements OnInit {
	public usuarioDTO: UsuarioDTO;
	public jsonInput: jsonInput; 
	public jsonOutput: jsonOutput;
	public password:String;

	constructor(private _loginService: LoginService, @Inject(SESSION_STORAGE) private storage:StorageService,
		private router: Router){
		if(this.storage.get("token") != null){
			this.router.navigate(['/home']);
		}
		this.usuarioDTO = new UsuarioDTO();
		this.jsonInput = new jsonInput(this.storage.get("token"), ValoresGlobales.R_PUBLICO);
		this.jsonOutput = new jsonOutput();
	}

	onSubmit(){
		AppComponent.modal = true;
		this.jsonInput.headerInput.transaccion = ValoresGlobales.S_LOGIN001;
		this.usuarioDTO.password = sha256(this.password);
		console.log(this.usuarioDTO);
		this.jsonInput.bodyInput.data = {UsuarioDTO: this.usuarioDTO};

		this._loginService.getLogin( this.jsonInput )
		.subscribe(response =>{
			this.jsonOutput = response;
			if(this.jsonOutput.errorOutput.codigoError == "0"){
				this.storage.set("usuario", this.jsonOutput.bodyOutput.data );
				this.storage.set("token", this.jsonOutput.headerOutput.token );
				window.location.reload();
			}
			else{
				alert(this.jsonOutput.errorOutput.mensajeError);
				AppComponent.modal = false;
			}

		});
		//alert(this.usuarioDTO.username);
	}

	ngOnInit(){
		/*this.login.username = "agperalta4";
		this.login.password = "agperalta";*/
	}
}