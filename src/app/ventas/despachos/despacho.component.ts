import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import {AppComponent} from './../../app.component';
import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {UtilitariosComponent} from './../../utils/utilitarios.component';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';

import {PedidoService} from './../../servicios/ventas/PedidoService';

import {PedidoDTO } from './../../modelos/ventas/pedido';
import {UsuarioDTO } from './../../modelos/seguridad/usuario';
import {DetallesPedidoDTO } from './../../modelos/ventas/detallePedido';


@Component({
	templateUrl: './despacho.component.html'
})

export class DespachoComponent implements OnInit{	
	public mostrar = false;
	public usuarioDTO:UsuarioDTO = this.storage.get("usuario")?this.storage.get("usuario").UsuarioDTO:null;
	public pedidoDTO = new PedidoDTO();
	public detallePedidoDTO = new DetallesPedidoDTO();

	public listaPedidos: Array<PedidoDTO>;

	public jsonInputPedido = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_DES);
	public jsonOutput = new jsonOutput();

	constructor(@Inject(SESSION_STORAGE) private storage:StorageService,
		private _pedidoService: PedidoService,
		private router: Router){
		AppComponent.modal=true;
	}

	ngOnInit(){
		this.consultarPedidos();
	}

	consultarPedidos(){
		this.listaPedidos = new Array<PedidoDTO>();
		this.jsonInputPedido.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_PEDIDOS_001;

		this.jsonInputPedido.bodyInput.data = {UsuarioDTO: this.usuarioDTO};
		this._pedidoService.enviar( this.jsonInputPedido )
		.subscribe(response =>{
			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaPedidos.push(value.PedidoDTO);
			}); 
			AppComponent.modal=false;
		});
	}

	despacharPedido(pedidoDTO : PedidoDTO){
		AppComponent.modal=true;
		this.jsonInputPedido.headerInput.transaccion = ValoresGlobales.S_ACTUALIZAR_PEDIDO_001;
		this.jsonInputPedido.bodyInput.data = {PedidoDTO:pedidoDTO};
		this._pedidoService.enviar( this.jsonInputPedido )
		.subscribe(response =>{
			this.jsonOutput = response;
			if(response.errorOutput.codigoError == "0"){
				alert("Transaccion completa");
				this.consultarPedidos();
			}
			else{
				alert("Hubo un problema con la transaccion : " + response.errorOutput.mensajeError);
			}
			AppComponent.modal=false;
		});

	}

	despacharDetalle(detallePedidoDTO : DetallesPedidoDTO){
		AppComponent.modal=true;
		detallePedidoDTO.DetallePedidoDTO.estado = 'DESPACHADO';
		console.log(detallePedidoDTO);
		this.jsonInputPedido.headerInput.transaccion = ValoresGlobales.S_ACTUALIZAR_DETALLEPEDIDO_001;
		this.jsonInputPedido.bodyInput.data = detallePedidoDTO;
		this._pedidoService.enviar( this.jsonInputPedido )
		.subscribe(response =>{
			this.jsonOutput = response;
			if(response.errorOutput.codigoError == "0"){
				detallePedidoDTO.estado = 'DESPACHADO';
				alert("Transaccion completa");
			}
			else{
				alert("Hubo un problema con la transaccion : " + response.errorOutput.mensajeError);
			}
			AppComponent.modal=false;
		});

	}

	visualizarPedido(pedidoDTO: PedidoDTO ){
		this.pedidoDTO = pedidoDTO;
		this.mostrar = true;
	}

	exportar(){
		UtilitariosComponent.exportar('Despachos.xlsx', this.listaPedidos);
	}

}
