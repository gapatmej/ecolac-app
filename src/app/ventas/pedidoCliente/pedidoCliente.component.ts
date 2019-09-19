import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import {AppComponent} from './../../app.component';
import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';

import {PedidoService} from './../../servicios/ventas/PedidoService';

import {PedidoDTO } from './../../modelos/ventas/pedido';
import {UsuarioDTO } from './../../modelos/seguridad/usuario';

@Component({
	templateUrl: './pedidoCliente.component.html'
})

export class PedidoClienteComponent implements OnInit{	
	public usuarioDTO:UsuarioDTO = this.storage.get("usuario")?this.storage.get("usuario").UsuarioDTO:null;
	public pedidoDTO : PedidoDTO;

	public listaPedidosCliente: Array<PedidoDTO>;

	public jsonInputPedido = new jsonInput(this.storage.get("token"), ValoresGlobales.R_CLIENTE);
	public jsonOutput = new jsonOutput();

	constructor(@Inject(SESSION_STORAGE) private storage:StorageService,
		private _pedidoService: PedidoService, 
		private router: Router){
		AppComponent.modal = true;
	}

	ngOnInit(){
		
		this.listaPedidosCliente = new Array<PedidoDTO>();
		this.consultarPedidosCliente();
	}

	consultarPedidosCliente(){
		this.jsonInputPedido.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_PEDIDOS_001;

		this.jsonInputPedido.bodyInput.data = {UsuarioDTO: this.usuarioDTO};
		this._pedidoService.enviar( this.jsonInputPedido )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaPedidosCliente.push(value.PedidoDTO);
			}); 
			AppComponent.modal=false;
		});
	}

	visualizarPedido(pedidoDTO: PedidoDTO ){
		this.pedidoDTO = pedidoDTO;
	}

}
