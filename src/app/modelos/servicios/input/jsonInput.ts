
export class jsonInput {
  headerInput: headerInput;
  bodyInput: bodyInput;
   
   constructor(token, recurso){
   	this.headerInput = new headerInput(token, recurso);
   	this.bodyInput = new bodyInput();
   }
}

class headerInput{
	token : string;
    recurso : string;
    transaccion : string;

    constructor(token, recurso){
    	this.token = token;
    	this.recurso = recurso;
    }
}

class bodyInput{
	data : object;
}