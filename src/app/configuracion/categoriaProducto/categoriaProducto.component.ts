import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {UtilitariosComponent} from './../../utils/utilitarios.component';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';
import {CategoriaProductoDTO } from './../../modelos/configuracion/categoriaProducto';

import {CategoriaProductoService} from './../../servicios/configuracion/CategoriaProductoService';


@Component({
	templateUrl: './categoriaProducto.component.html'
})


export class CategoriaProductoComponent implements OnInit {
	public editado = false;
	public categoriaProductoDTO = new CategoriaProductoDTO();

	public listaCategoriasProducto = new Array<CategoriaProductoDTO>();

	public jsonInputCategoriaProducto = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_CAT);
	public jsonOutput = new jsonOutput();

	constructor(private _categoriaProductoService: CategoriaProductoService, 
		@Inject(SESSION_STORAGE) private storage:StorageService, 
		private router: Router){
	}

	ngOnInit(){
		this.limpiar();
	}

	nuevo(){
		this.editado = true;
		this.categoriaProductoDTO = new CategoriaProductoDTO();
	}

	limpiar(){
		this.editado = false;
		this.cargarCategoriasProducto();
		this.categoriaProductoDTO = new CategoriaProductoDTO();
	}

	guardar(){
		
		if(this.categoriaProductoDTO.idCategoriaProducto){
			this.jsonInputCategoriaProducto.headerInput.transaccion = ValoresGlobales.S_ACTUALIZAR_CATEGORIA_PRODUCTO_001;
		}else{
			this.jsonInputCategoriaProducto.headerInput.transaccion = ValoresGlobales.S_CREAR_CATEGORIA_PRODUCTO_001;
		}
		
		this.jsonInputCategoriaProducto.bodyInput.data = {CategoriaProductoDTO: this.categoriaProductoDTO};
		this._categoriaProductoService.guardar( this.jsonInputCategoriaProducto )
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

	cargarCategoriasProducto(){
		this.listaCategoriasProducto = new Array<CategoriaProductoDTO>();
		this.jsonInputCategoriaProducto.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_CATEGORIAS_PRODUCTO_001;

		this._categoriaProductoService.consultarTodos( this.jsonInputCategoriaProducto )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaCategoriasProducto.push(value.CategoriaProductoDTO);
			}); 

		});	
	}


	editar(categoriaProducto: CategoriaProductoDTO){
		this.categoriaProductoDTO = categoriaProducto;
		this.editado = true;
	}

	eliminar(categoriaProducto: CategoriaProductoDTO){
		this.categoriaProductoDTO = categoriaProducto;
		this.categoriaProductoDTO.activo = false;
		this.guardar();
	}

	exportar(){
		UtilitariosComponent.exportar('CategoriasProducto.xlsx', this.listaCategoriasProducto);
	}
}