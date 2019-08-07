import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {AppComponent} from './../../app.component';
import {UtilitariosComponent} from './../../utils/utilitarios.component';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';

import {PedidoService} from './../../servicios/ventas/PedidoService';
import {UsuarioService} from './../../servicios/seguridad/UsuarioService';
import {ProductoService} from './../../servicios/configuracion/ProductoService';

import {PedidoDTO } from './../../modelos/ventas/pedido';
import {DetallesPedidoDTO } from './../../modelos/ventas/detallePedido';
import {UsuarioDTO } from './../../modelos/seguridad/usuario';
import {ProductoDTO } from './../../modelos/configuracion/producto';


@Component({
	templateUrl: './pedido.component.html'
})

export class PedidoComponent implements OnInit{	
	public editado = false;
	public usuarioDTO:UsuarioDTO = this.storage.get("usuario")?this.storage.get("usuario").UsuarioDTO:null;
	public pedidoDTO = new PedidoDTO();
	public detallePedidoDTO = new DetallesPedidoDTO();
	public productoSeleccionadoDTO = new ProductoDTO();
	public date1:Date;

	public listaPedidos: Array<PedidoDTO>;
	public listaClientes: Array<UsuarioDTO>;
	public listaProducto: Array<ProductoDTO>;

	public jsonInputPedido = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_PED);
	public jsonInputClientes = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_PED);
	public jsonInputProductos = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_PED);
	public jsonOutput = new jsonOutput();

	constructor(@Inject(SESSION_STORAGE) private storage:StorageService,
		private _pedidoService: PedidoService, 
		private _usuarioService: UsuarioService, 
		private _productoService: ProductoService, 
		private router: Router){
	}

	ngOnInit(){
		this.limpiar();	
	}

	limpiar(){
		this.editado = false;
		this.pedidoDTO = new PedidoDTO();
		this.pedidoDTO.detallesPedido = new Array<DetallesPedidoDTO>();
		this.pedidoDTO.vendedor = {UsuarioDTO: this.usuarioDTO};
		this.listaPedidos = new Array<PedidoDTO>();
		this.consultarPedidos();
		AppComponent.modal = false;
	}

	consultarPedidos(){
		this.jsonInputPedido.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_PEDIDOS_001;

		this.jsonInputPedido.bodyInput.data = {UsuarioDTO: this.usuarioDTO};
		this._pedidoService.enviar( this.jsonInputPedido )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaPedidos.push(value.PedidoDTO);
			}); 

		});
	}

	consultarClientes(){
		this.listaClientes = new Array<UsuarioDTO>();
		this.jsonInputClientes.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_USUARIOS_002;

		this._usuarioService.consultarTodos( this.jsonInputClientes )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaClientes.push(value.UsuarioDTO);
			}); 

		});
	}

	consultarProductos(){
		this.listaProducto = new Array<ProductoDTO>();
		this.jsonInputProductos.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_PRODUCTOS_001;

		this._productoService.consultarTodos( this.jsonInputProductos )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaProducto.push(value.ProductoDTO);
			}); 

		});
	}

	nuevo(){
		this.editado = true;
		this.detallePedidoDTO = new DetallesPedidoDTO();
		this.detallePedidoDTO.cantidad = 1
		this.consultarClientes();
		this.consultarProductos();
	}

	guardar(){
		AppComponent.modal = true;
		this.jsonInputPedido.headerInput.transaccion = ValoresGlobales.S_CREAR_PEDIDO_001;

		this.jsonInputPedido.bodyInput.data = {PedidoDTO: this.pedidoDTO};
		this._pedidoService.enviar( this.jsonInputPedido )
		.subscribe(response =>{
			this.jsonOutput = response;
			if(response.errorOutput.codigoError == "0"){
				alert("Transaccion completa");
				this.limpiar();
			}
			else{
				alert("Hubo un problema con la transaccion : " + response.errorOutput.mensajeError);
			}
		});

	}

	capturarProducto(producto : ProductoDTO ){
		this.productoSeleccionadoDTO = producto;
		this.detallePedidoDTO.producto = {ProductoDTO:this.productoSeleccionadoDTO};
	}

	agregarProducto(){
		console.log(this.detallePedidoDTO.cantidad);
		let detallePedido = new DetallesPedidoDTO();
		detallePedido.descripcion = this.productoSeleccionadoDTO.nombre;
		detallePedido.cantidad = this.detallePedidoDTO.cantidad;
		detallePedido.precioUnitario = this.productoSeleccionadoDTO.precio ;
		detallePedido.total = parseFloat((detallePedido.cantidad * detallePedido.precioUnitario).toFixed(2));
		detallePedido.producto = {ProductoDTO: this.productoSeleccionadoDTO};
		this.pedidoDTO.detallesPedido.push({DetallePedidoDTO: detallePedido} );

		this.calcularPedido();
		console.log(this.pedidoDTO);
	}

	calcularPedido(){
		let subtotal:number = 0.00;
		let iva= 0.00;
		let total = 0.00;

		this.pedidoDTO.detallesPedido.forEach(value =>{
			let detallePedido = value.DetallePedidoDTO;
			subtotal += parseFloat(detallePedido.total); 
		});

		this.pedidoDTO.subtotal = parseFloat(subtotal.toFixed(2));
		this.pedidoDTO.iva = parseFloat((subtotal * 0.12).toFixed(2));
		this.pedidoDTO.total = parseFloat((this.pedidoDTO.subtotal+this.pedidoDTO.iva).toFixed(2));
	}

	calcularDetalle(detallePedido : DetallesPedidoDTO, operacion){
		let cantidad:number ;
		if(operacion == 'sum'){
			cantidad = detallePedido.DetallePedidoDTO.cantidad+1;
		}
		else{
			cantidad = detallePedido.DetallePedidoDTO.cantidad==0?detallePedido.DetallePedidoDTO.cantidad:detallePedido.DetallePedidoDTO.cantidad-1;
		}
		
		let precio:number = detallePedido.DetallePedidoDTO.precioUnitario;
		
		detallePedido.DetallePedidoDTO.cantidad = cantidad;
		detallePedido.DetallePedidoDTO.total = parseFloat((cantidad*precio).toFixed(2));
		this.calcularPedido();

		this.storage.set("pedido",this.pedidoDTO);
	}

	eliminarDetallePedido(detallePedido: DetallesPedidoDTO){
		this.pedidoDTO.detallesPedido.splice(this.pedidoDTO.detallesPedido
			.findIndex(i => i.DetallePedidoDTO 
				== detallePedido.DetallePedidoDTO),1);
		this.calcularPedido();
		this.storage.set("pedido",this.pedidoDTO);
	}

	sumarCantidad(){
		this.detallePedidoDTO.cantidad = parseInt(this.detallePedidoDTO.cantidad) + 1;
	}

	restarCantidad(){
		if(this.detallePedidoDTO.cantidad == 1)
			return;

		this.detallePedidoDTO.cantidad = parseInt(this.detallePedidoDTO.cantidad)-1;
	}

	exportar(){
		UtilitariosComponent.exportar('Pedidos.xlsx', this.listaPedidos);
	}

}
