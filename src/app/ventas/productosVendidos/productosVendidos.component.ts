import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {UtilitariosComponent} from './../../utils/utilitarios.component';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';

import {ProductoService} from './../../servicios/configuracion/ProductoService';

import {ProductoDTO } from './../../modelos/configuracion/producto';
import {UsuarioDTO } from './../../modelos/seguridad/usuario';


@Component({
	templateUrl: './productosVendidos.component.html'
})

export class ProductosVendidosComponent implements OnInit{	
	public filtro :string;
	public usuarioDTO:UsuarioDTO = this.storage.get("usuario")?this.storage.get("usuario").UsuarioDTO:null;
	public listaProductosVendidos = new Array<ProductoDTO>();
	public listaProductosFiltro = new Array<ProductoDTO>();

	public jsonInputProductosVendidos = new jsonInput(this.storage.get("token"), ValoresGlobales.R_PRO_VEN);
	public jsonOutput = new jsonOutput();

	constructor(@Inject(SESSION_STORAGE) private storage:StorageService,
		private _productoService: ProductoService,
		private router: Router){
	}

	ngOnInit(){
		this.consultarProductosVendidos();
	}

	consultarProductosVendidos(){
		this.jsonInputProductosVendidos.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_PRODUCTOS_002;

		this.jsonInputProductosVendidos.bodyInput.data = {UsuarioDTO: this.usuarioDTO};
		this._productoService.consultarTodos( this.jsonInputProductosVendidos )
		.subscribe(response =>{
			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaProductosVendidos.push(value.ProductoDTO);
			}); 
			this.listaProductosFiltro = this.listaProductosVendidos;
		});
	}

	exportar(){
		UtilitariosComponent.exportar('ProductosVendidos.xlsx', this.listaProductosVendidos);
	}

	buscarProducto(){
		this.listaProductosFiltro = this.listaProductosVendidos
									.filter(p=>
											p.nombre.toLowerCase().indexOf(this.filtro.toLowerCase()) > -1);
	}

}
