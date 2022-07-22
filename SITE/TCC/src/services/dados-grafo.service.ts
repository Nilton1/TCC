import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { NodeDescription, valor } from 'src/app/shared/classes';

@Injectable({
  providedIn: 'root'
})
export class DadosGrafoService {

  constructor(private http: HttpClient) { }

  getData(): Observable<valor> {
    var headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.get<valor>('http://localhost:3001/teste',{headers:headers} );
  }

  getNode(nodeNumberFirst: string, nodeNumberSecond: string): Observable<NodeDescription[][]> {
    var headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.get<NodeDescription[][]>(`http://localhost:3001/Descendants?First=${nodeNumberFirst}&Second=${nodeNumberSecond}`,{headers:headers} );
  }


}
