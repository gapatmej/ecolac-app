//Importar modulos del router
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

//Importar Componentes Seguridad
import {LoginComponent } from './seguridad/login/login.component';
import {RegistroComponent} from './publico/registro/registro.component';
import {HomeComponent } from './publico/home/home.component';
import {CarritoComponent } from './publico/carrito/carrito.component';

import {UsuarioComponent } from './seguridad/usuarios/usuario.component';
import {RolComponent } from './seguridad/roles/rol.component';

import {PedidoClienteComponent } from './ventas/pedidoCliente/pedidoCliente.component';
import {PedidoComponent } from './ventas/pedido/pedido.component';
import {DespachoComponent } from './ventas/despachos/despacho.component';
import {ProductosVendidosComponent } from './ventas/productosVendidos/productosVendidos.component';

import {UnidadMedidaComponent } from './configuracion/unidadMedida/unidadMedida.component';
import {CategoriaProductoComponent } from './configuracion/categoriaProducto/categoriaProducto.component';
import {LineaProductoComponent} from './configuracion/lineaProducto/lineaProducto.component';
import {PresentacionProductoComponent} from './configuracion/presentacionProducto/presentacionProducto.component';
import {ProductoComponent} from './configuracion/producto/producto.component';

const appRoutes : Routes = [
	{path:'', component: HomeComponent},
	{path:'home', component: HomeComponent},
	{path:'carrito', component: CarritoComponent},
	{path:'login', component: LoginComponent},
	{path:'registro', component: RegistroComponent},
	{path:'usuarios/usuario', component: UsuarioComponent},
	{path:'usuarios/rol', component: RolComponent},
	{path:'productos/unidadMedida', component: UnidadMedidaComponent},
	{path:'productos/categoriaProducto', component: CategoriaProductoComponent},
	{path:'productos/lineaProducto', component: LineaProductoComponent},
	{path:'productos/presentacionProducto', component: PresentacionProductoComponent},
	{path:'productos/producto', component: ProductoComponent},
	{path:'ventas/pedidoCliente', component: PedidoClienteComponent},
	{path:'ventas/pedido', component: PedidoComponent},
	{path:'ventas/productosVendidos', component: ProductosVendidosComponent},
	{path:'despachos/despacho', component: DespachoComponent}
]

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);