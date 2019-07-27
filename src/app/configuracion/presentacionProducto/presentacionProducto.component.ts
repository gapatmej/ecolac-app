import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {UtilitariosComponent} from './../../utils/utilitarios.component';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';
import {PresentacionProductoDTO } from './../../modelos/configuracion/presentacionProducto';
import {UnidadMedidaDTO } from './../../modelos/configuracion/unidadMedida';

import {PresentacionProductoService} from './../../servicios/configuracion/PresentacionProductoService';
import {UnidadMedidaService} from './../../servicios/configuracion/UnidadMedidaService';

@Component({
	templateUrl: './presentacionProducto.component.html'
})


export class PresentacionProductoComponent implements OnInit {
	public editado = false;
	public presentacionProductoDTO = new PresentacionProductoDTO();
	public unidadMedidaSeleccionado = new UnidadMedidaDTO();

	public listaPresentacionesProducto = new Array<PresentacionProductoDTO>();
	public listaUnidadesMedida = new Array<UnidadMedidaDTO>();

	public jsonInputPresentacionProducto = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_PRE);
	public jsonInputUnidadMedida = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_UNI_ME);
	public jsonOutput = new jsonOutput();

	constructor(private _presentacionProductoService: PresentacionProductoService,
		private _unidadMedidaService: UnidadMedidaService ,
		@Inject(SESSION_STORAGE) private storage:StorageService, 
		private router: Router){
	}

	ngOnInit(){
		this.limpiar();
	}

	nuevo(){
		this.editado = true;
		this.presentacionProductoDTO = new PresentacionProductoDTO();
		this.unidadMedidaSeleccionado = new UnidadMedidaDTO();
	}

	limpiar(){
		this.editado = false;
		this.cargarPresentacionesProducto();
		this.cargarUnidadesMedida();
		this.presentacionProductoDTO = new PresentacionProductoDTO();
	}

	guardar(){
		
		if(this.presentacionProductoDTO.idPresentacionProducto){
			this.jsonInputPresentacionProducto.headerInput.transaccion = ValoresGlobales.S_ACTUALIZAR_PRESENTACION_PRODUCTO_001;
		}else{
			this.jsonInputPresentacionProducto.headerInput.transaccion = ValoresGlobales.S_CREAR_PRESENTACION_PRODUCTO_001;
		}
		
		this.jsonInputPresentacionProducto.bodyInput.data = {PresentacionProductoDTO: this.presentacionProductoDTO};
		this._presentacionProductoService.guardar( this.jsonInputPresentacionProducto )
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

	cargarPresentacionesProducto(){
		this.listaPresentacionesProducto = new Array<PresentacionProductoDTO>();
		this.jsonInputPresentacionProducto.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_PRESENTACIONES_PRODUCTO_001;

		this._presentacionProductoService.consultarTodos( this.jsonInputPresentacionProducto )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaPresentacionesProducto.push(value.PresentacionProductoDTO);
			}); 

		});	
	}

	cargarUnidadesMedida(){
		this.listaUnidadesMedida = new Array<UnidadMedidaDTO>();
		this.jsonInputUnidadMedida.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_UNIDADES_MEDIDA_001;

		this._presentacionProductoService.consultarTodos( this.jsonInputUnidadMedida )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaUnidadesMedida.push(value.UnidadMedidaDTO);
			}); 

		});	
	}


	editar(presentacionProducto: PresentacionProductoDTO){
		this.presentacionProductoDTO = presentacionProducto;
		this.editado = true;
		this.unidadMedidaSeleccionado = this.presentacionProductoDTO.unidadMedida.UnidadMedidaDTO;
	}

	eliminar(presentacionProducto: PresentacionProductoDTO){
		this.presentacionProductoDTO = presentacionProducto;
		this.presentacionProductoDTO.activo = false;
		this.guardar();
	}

	capturarUnidadMedida(unidadMedida: UnidadMedidaDTO){
		this.unidadMedidaSeleccionado = unidadMedida;
		this.presentacionProductoDTO.unidadMedida = {UnidadMedidaDTO:this.unidadMedidaSeleccionado}
	}

	exportar(){
		UtilitariosComponent.exportar('PresentacionProducto.xlsx', this.listaPresentacionesProducto);
	}
}