export class ProductoDTO{
	idProducto:string;
    foto:string;
    nombre:string;
    nombreCorto:string;
    precio:number;
    descripcion:string;
    stock:number = 0;
    atributo1:string;
    atributo2:string;
    activo:boolean;
    presentacionProducto;
    categoriaProducto;
    lineaProducto;
}