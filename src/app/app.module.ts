import { routing, appRoutingProviders } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StorageServiceModule } from 'angular-webstorage-service';

import { AppComponent } from './app.component';

//COMPONENTE
import { HomeComponent} from './publico/home/home.component';
import { CarritoComponent} from './publico/carrito/carrito.component';
import { LoginComponent} from './seguridad/login/login.component';
import { RegistroComponent} from './publico/registro/registro.component';

import { UsuarioComponent} from './seguridad/usuarios/usuario.component';
import { RolComponent} from './seguridad/roles/rol.component';

import { UnidadMedidaComponent} from './configuracion/unidadMedida/unidadMedida.component';
import { CategoriaProductoComponent} from './configuracion/categoriaProducto/categoriaProducto.component';
import { LineaProductoComponent} from './configuracion/lineaProducto/lineaProducto.component';
import { PresentacionProductoComponent} from './configuracion/presentacionProducto/presentacionProducto.component';
import { ProductoComponent} from './configuracion/producto/producto.component';

import { PedidoClienteComponent} from './ventas/pedidoCliente/pedidoCliente.component';
import { PedidoComponent} from './ventas/pedido/pedido.component';
import { DespachoComponent} from './ventas/despachos/despacho.component';
import { ProductosVendidosComponent} from './ventas/productosVendidos/productosVendidos.component';

//SERVICIOS
import { LoginService } from './servicios/seguridad/LoginService';
import { UsuarioService } from './servicios/seguridad/UsuarioService';
import { RolService } from './servicios/seguridad/RolService';
import { RecursoService } from './servicios/seguridad/RecursoService';

import { UnidadMedidaService } from './servicios/configuracion/UnidadMedidaService';
import { CategoriaProductoService } from './servicios/configuracion/CategoriaProductoService';
import { LineaProductoService } from './servicios/configuracion/LineaProductoService';
import { PresentacionProductoService } from './servicios/configuracion/PresentacionProductoService';
import { ProductoService } from './servicios/configuracion/ProductoService';

import { PedidoService } from './servicios/ventas/PedidoService';

import {CalendarModule} from 'primeng/calendar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';

//DIRECTIVAS
import {NumberDirective} from './utils/directives/number.directive';


@NgModule({
  declarations: [
  AppComponent,
  NumberDirective,
  HomeComponent,
  CarritoComponent,
  LoginComponent,
  RegistroComponent,
  UsuarioComponent,
  RolComponent,
  UnidadMedidaComponent,
  CategoriaProductoComponent,
  LineaProductoComponent,
  PresentacionProductoComponent,
  ProductoComponent,
  PedidoClienteComponent,
  PedidoComponent,
  DespachoComponent,
  ProductosVendidosComponent
  ],
  imports: [
  BrowserModule,
  routing,
  FormsModule,
  HttpClientModule,
  StorageServiceModule,
  CalendarModule,
  BrowserAnimationsModule,
  AgmCoreModule.forRoot({
    apiKey: 'AIzaSyDyj6m3C9sLEofT3HRFdWCYDwLrQIhUzD0',
    libraries: ["places"]
  })
  ],
  providers: [
  appRoutingProviders, LoginService, UsuarioService, RolService, RecursoService, UnidadMedidaService, CategoriaProductoService,
  LineaProductoService, PresentacionProductoService, ProductoService, PedidoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
