export class PedidoDTO{
    idPedido :string;
    fecha :Date;
    estado :string;
    direccion :string;
    ciudad :string;
    telefono :string;
    descuento :number;
    subtotal :number;
    iva :number;
    total :number;
    cliente;
    vendedor;
    repartidor;
    detallesPedido;

}