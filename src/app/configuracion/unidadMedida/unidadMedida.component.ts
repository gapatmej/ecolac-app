import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {UtilitariosComponent} from './../../utils/utilitarios.component';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';
import {UnidadMedidaDTO } from './../../modelos/configuracion/unidadMedida';

import {UnidadMedidaService} from './../../servicios/configuracion/UnidadMedidaService';


@Component({
	templateUrl: './unidadMedida.component.html'
})


export class UnidadMedidaComponent implements OnInit {
	public editado = false;
	public unidadMedidaDTO = new UnidadMedidaDTO();
	public empList: Array<UnidadMedidaDTO> = [];

	public listaUnidadesMedida = new Array<UnidadMedidaDTO>();

	public jsonInputUnidadMedida = new jsonInput(this.storage.get("token"), ValoresGlobales.R_GES_UNI_ME);
	public jsonOutput = new jsonOutput();

	constructor(private _unidadMedidaService: UnidadMedidaService, 
		@Inject(SESSION_STORAGE) private storage:StorageService, 
		private router: Router
		){
		UtilitariosComponent.doSomething("test");
	}

	ngOnInit(){
		this.limpiar();
	}

	nuevo(){
		this.editado = true;
		this.unidadMedidaDTO = new UnidadMedidaDTO();
	}

	limpiar(){
		this.editado = false;
		this.cargarUnidadesMedida();
		this.unidadMedidaDTO = new UnidadMedidaDTO();
	}

	guardar(){
		
		if(this.unidadMedidaDTO.idUnidadMedida){
			this.jsonInputUnidadMedida.headerInput.transaccion = ValoresGlobales.S_ACTUALIZAR_UNIDAD_MEDIDA_001;
		}else{
			this.jsonInputUnidadMedida.headerInput.transaccion = ValoresGlobales.S_CREAR_UNIDAD_MEDIDA_001;
		}
		
		this.jsonInputUnidadMedida.bodyInput.data = {UnidadMedidaDTO: this.unidadMedidaDTO};
		this._unidadMedidaService.guardar( this.jsonInputUnidadMedida )
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

	cargarUnidadesMedida(){
		this.listaUnidadesMedida = new Array<UnidadMedidaDTO>();
		this.jsonInputUnidadMedida.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_UNIDADES_MEDIDA_001;

		this._unidadMedidaService.consultarTodos( this.jsonInputUnidadMedida )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaUnidadesMedida.push(value.UnidadMedidaDTO);
			}); 

		});	
	}


	editar(unidadMedida: UnidadMedidaDTO){
		this.unidadMedidaDTO = unidadMedida;
		this.editado = true;
	}

	eliminar(unidadMedida: UnidadMedidaDTO){
		this.unidadMedidaDTO = unidadMedida;
		this.unidadMedidaDTO.activo = false;
		this.guardar();
	}

	exportar(){
		UtilitariosComponent.exportar('UnidadesMedida.xlsx', this.listaUnidadesMedida, ['idUnidadMedida', 'nombre', 'nombreCorto', 'mnemonico', 'descripcion','activo']);
	}
}
