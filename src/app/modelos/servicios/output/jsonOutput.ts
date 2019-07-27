export class jsonOutput {
  headerOutput: headerOutput;
  bodyOutput: bodyOutput;
  errorOutput: errorOutput;
}

class headerOutput{
	token : string;
    recurso : string;
    transaccion : string;
}

class bodyOutput{
	data;
}

class errorOutput{
	codigoError : string;
    mensajeError : string;
}