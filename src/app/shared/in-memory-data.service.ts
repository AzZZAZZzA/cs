import {InMemoryDbService} from 'angular-in-memory-web-api'
import { OwnerEntity } from './ICarOwnersService';
import { Injectable } from '@angular/core'

@Injectable({
   providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService{
   createDb() {
      const owners=[
         {id:1 ,aLastName:'Иванов', aFirstName:'Иван',aMiddleName:'Иванович',
            aCars:[
               {aIdNumber:'АХ1234АБ', aManufacturer:'ВАЗ',aModel:'9',aYear:'1980'}
            ]},
         {id:2 ,aLastName:'Сергеев', aFirstName:'Сергей',aMiddleName:'Сергеевич',
            aCars:[
               {aIdNumber:'АЕ1234СБ', aManufacturer:'ВАЗ',aModel:'2101',aYear:'1960'},
               {aIdNumber:'АЕ5678БК', aManufacturer:'ВАЗ',aModel:'2110',aYear:'1990'}
            ]}
      ];
      return {owners};
   }
   genId(owners: OwnerEntity[]): number {
      return owners.length > 0 ? Math.max(...owners.map(owner => owner.id)) + 1 : 0;
   }
}