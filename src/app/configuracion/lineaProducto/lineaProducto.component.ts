import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {UtilitariosComponent} from './../../utils/utilitarios.component';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';
import {LineaProductoDTO } from './../../modelos/configuracion/lineaProducto';

import {LineaProductoService} from './../../servicios/configuracion/LineaProductoService';


@Component({
	templateUrl: './lineaProducto.component.html'
})


export class LineaProductoComponent implements OnInit {
	public editado = false;
	public lineaProductoDTO = new LineaProductoDTO();

	public listaLineasProducto = new Array<LineaProductoDTO>();

	public jsonInputLineaProducto = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_LIN);
	public jsonOutput = new jsonOutput();

	constructor(private _lineaProductoService: LineaProductoService, 
		@Inject(SESSION_STORAGE) private storage:StorageService, 
		private router: Router){
	}

	ngOnInit(){
		this.limpiar();
	}

	nuevo(){
		this.editado = true;
		this.lineaProductoDTO = new LineaProductoDTO();
	}

	limpiar(){
		this.editado = false;
		this.cargarLineasProducto();
		this.lineaProductoDTO = new LineaProductoDTO();
	}

	guardar(){
		
		if(this.lineaProductoDTO.idLineaProducto){
			this.jsonInputLineaProducto.headerInput.transaccion = ValoresGlobales.S_ACTUALIZAR_LINEA_PRODUCTO_001;
		}else{
			this.jsonInputLineaProducto.headerInput.transaccion = ValoresGlobales.S_CREAR_LINEA_PRODUCTO_001;
		}
		
		this.jsonInputLineaProducto.bodyInput.data = {LineaProductoDTO: this.lineaProductoDTO};
		this._lineaProductoService.guardar( this.jsonInputLineaProducto )
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

	cargarLineasProducto(){
		this.listaLineasProducto = new Array<LineaProductoDTO>();
		this.jsonInputLineaProducto.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_LINEAS_PRODUCTO_001;

		this._lineaProductoService.consultarTodos( this.jsonInputLineaProducto )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaLineasProducto.push(value.LineaProductoDTO);
			}); 

		});	
	}


	editar(lineaProducto: LineaProductoDTO){
		this.lineaProductoDTO = lineaProducto;
		this.editado = true;
	}

	eliminar(lineaProducto: LineaProductoDTO){
		this.lineaProductoDTO = lineaProducto;
		this.lineaProductoDTO.activo = false;
		this.guardar();
	}

	exportar(){
		UtilitariosComponent.exportar('LineasProducto.xlsx', this.listaLineasProducto);
	}
}