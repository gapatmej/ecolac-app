import { Component, OnInit, Inject, Injectable } from '@angular/core';
import {Router} from '@angular/router'
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import {UsuarioDTO} from './modelos/seguridad/usuario';
import {RolDTO} from './modelos/seguridad/rol';
import {RecursoDTO} from './modelos/seguridad/recurso';
import {recursosPorModulo} from './modelos/seguridad/recursosPorModulo';
import {PedidoDTO} from './modelos/ventas/pedido';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    public lblLogin:String = LblSesion.LOGIN;
	static numeroItemsCarrito:number;
	public usuarioDTO: UsuarioDTO;
	public rolesDTO: Array<RolDTO>;
	public recursosDTO: Array<RecursoDTO>;
	public recursosPorModulo: Array<recursosPorModulo>;
    static modal:boolean ;
    public appCom ;

	constructor(private router: Router, @Inject(SESSION_STORAGE) private storage:StorageService){
		this.rolesDTO = new Array<RolDTO>();
		this.recursosDTO = new Array<RecursoDTO>();
		this.recursosPorModulo = new Array<recursosPorModulo>();
        this.appCom = AppComponent;
        this.appCom.modal = false;
	}

    btnLogin() {
    	if(this.lblLogin == LblSesion.LOGIN){
            this.router.navigateByUrl('/login');
        }else{
            this.storage.remove("usuario");
            this.storage.remove("token");
            this.storage.remove("pedido");
            this.router.navigate(['/home']);
            this.ngOnInit();
           // this.router.navigateByUrl('/login', { skipLocationChange: true });

            //window.location.reload();
        }
    }

    ngOnInit(){
    	this.usuarioDTO = this.storage.get("usuario")?this.storage.get("usuario").UsuarioDTO:null;
        this.appCom.numeroItemsCarrito = this.storage.get("pedido")?
                                        this.storage.get("pedido")
                                        .detallesPedido.map((detalle)=>detalle.DetallePedidoDTO.cantidad).reduce((a, b)=> a+b,0)
                                        :0;

        if(this.usuarioDTO!=null){
            this.lblLogin = LblSesion.CLOSE_SESSION;

            this.usuarioDTO.roles.forEach(value => {
                let rolDTO = value.RolDTO;
                this.rolesDTO.push(rolDTO);
            }); 

            this.rolesDTO.forEach(value => {
                if(value.recursos){
                    value.recursos.forEach(value => {
                        let recursoDTO = value.RecursoDTO;
                        if(!this.recursosDTO.find(r=>r.idRecurso == recursoDTO.idRecurso)){
                            this.recursosDTO.push(recursoDTO);
                        }
                    }); 
                }
            }); 

            

            this.recursosDTO.forEach(value => {
                let recursoModulo = this.recursosPorModulo.find(rM=>rM.nombreModulo == value.componente);

                if(!recursoModulo){
                    recursoModulo = new recursosPorModulo();
                    recursoModulo.nombreModulo = value.componente;
                    recursoModulo.recursos.push(value);
                    this.recursosPorModulo.push(recursoModulo);
                }else{
                    recursoModulo.nombreModulo = value.componente;
                    recursoModulo.recursos.push(value);
                }
            });

        }
        else{
            this.lblLogin = LblSesion.LOGIN;
            this.rolesDTO = new Array<RolDTO>();
            this.recursosDTO = new Array<RecursoDTO>();
            this.recursosPorModulo = new Array<recursosPorModulo>();
        } 
    }
}

export enum LblSesion {
    LOGIN = "Iniciar Sesion",
    CLOSE_SESSION = "Cerrar Sesion"
}
