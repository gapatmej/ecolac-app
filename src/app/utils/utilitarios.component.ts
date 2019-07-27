import * as XLSX from 'xlsx';

export class UtilitariosComponent {

	static exportar(nombre, lista){
		const ws = XLSX.utils.json_to_sheet(lista);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb,nombre);
	}

	static doSomething(val: string) { return val; }

}
