import { Observable } from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Injectable} from "@angular/core";
import { tap,catchError,of } from "rxjs";
import { MessageService } from "../shared/message.service";


export interface CarEntity{
   id?:number
   aIdNumber:string
   aManufacturer:string
   aModel:string
   aYear:string
}

export interface OwnerEntity{
   id:number
   aLastName:string
   aFirstName:string
   aMiddleName:string
   aCars: CarEntity[]
}

export interface ICarOwnersService{
   getOwners():Observable<OwnerEntity[]>;
   getOwnerById(aId:number): Observable<OwnerEntity>;
   createOwner(      
      aLastName:string,
      aFirstName:string,
      aMiddleName:string,
            aCars: CarEntity[]
      ):Observable<OwnerEntity>;
   editOwner(aOwner: OwnerEntity):Observable<OwnerEntity>;
   deleteOwner(aOwnerId: number): Observable<OwnerEntity[]>;
}

@Injectable({providedIn: 'root' })
export class CarOwnersService {
   constructor(
      private http:HttpClient,
      private messageService: MessageService
   ){}

   private url='/api/owners'

   httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   };

   getOwners(){
      return this.http.get<OwnerEntity[]>(this.url)
   }

   getOwnerById(id:number){
      const url=`${this.url}/${id}`
      return this.http.get<OwnerEntity>(url).pipe(
         tap(_ => console.log(`fetched owner id=${id}`)),
         catchError(this.handleError<OwnerEntity>(`getOwnerById id=${id}`))
      );
   }

   createOwner(newOwner:OwnerEntity):Observable<OwnerEntity>{
      return this.http.post<OwnerEntity>(this.url,newOwner,this.httpOptions).pipe(
         tap((newOwner:OwnerEntity) => console.log(`create ${ newOwner.id}`)),
         catchError(this.handleError<OwnerEntity>('addOwner'))
      );
      
   }

   updateOwner(owner: OwnerEntity): Observable<any> {
      console.log(this.url,owner);
      
      return this.http.put(this.url, owner, this.httpOptions).pipe(
         tap(_ => console.log(`updated owner id=${owner.id}`)),
         catchError(this.handleError<any>('updateOwner'))
      );
      }
   
   deletOwner(id:number):Observable<OwnerEntity>{
      const url=`${this.url}/${id}`
      console.log(url);      
      return this.http.delete<OwnerEntity>(url, this.httpOptions).pipe(
         tap(_ => this.log(`deleted owner id=${id}`)),
         catchError(this.handleError<OwnerEntity>('delete owner'))
      );
   }

   private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(error); // log to console instead
         console.log(`${operation} failed: ${error.message}`);
         return of(result as T);
      };
   }

   private log(message: string) {
      this.messageService.add(`Service: ${message}`);
   }

}

