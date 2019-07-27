import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';
import {ValoresGlobales} from './../../modelos/valoresGlobales';

@Injectable()
export class ProductoService{
	private headers = new HttpHeaders({'Content-Type':'application/json'});
	private jsonOutput : jsonOutput;
	constructor(private _httpClient: HttpClient){

	}

	consultarTodos(service: jsonInput): Observable<jsonOutput> {
		let params = JSON.stringify(service);
		
		return this._httpClient.post<jsonOutput>(ValoresGlobales.BASE_API_URL, params, {headers: this.headers})
		.pipe(
			catchError(this.handleError('consultar Productos', new jsonOutput()))
			);
	}

	guardar(service: jsonInput): Observable<jsonOutput> {
		let params = JSON.stringify(service);
		
		return this._httpClient.post<jsonOutput>(ValoresGlobales.BASE_API_URL, params, {headers: this.headers})
		.pipe(
			catchError(this.handleError('guardar', new jsonOutput()))
			);
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			return of(result as T);
		};
	}
}