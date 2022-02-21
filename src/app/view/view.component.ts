import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarOwnersService, OwnerEntity } from '../shared/ICarOwnersService';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})

@Injectable({providedIn: 'root' })
export class ViewComponent implements OnInit {


  constructor(public carOwnersService:CarOwnersService) { }

  public loading:boolean=true
  public owners:OwnerEntity[]=[]
  public ownerById:OwnerEntity= {
    id:0, 
    aLastName:'',
    aFirstName:'',
    aMiddleName:'',
          aCars: []}
  public id:number=-1;
  public linkControlEdit="";
  public linkControlView="";
  public buttonDisabled="disabled";

  activateOwner(owner:OwnerEntity){
    this.id=owner.id
    this.linkControlEdit= `/cud/${this.id}/edit`;
    this.linkControlView= `/cud/${this.id}/view`;
    this.buttonDisabled='';
  }

  update(){
    if (this.id>-1){
      this.getOwnerById(this.id)
    }
  }

  delete(){
    this.carOwnersService.deletOwner(this.id).subscribe();
    this.owners= this.owners.filter(owner=>owner.id !== this.id);
  }
  getOwnerById(id:number){
    this.carOwnersService.getOwnerById(id).subscribe(
      data=>{ this.ownerById=data; console.log(this.ownerById);}
    )
  }


  ngOnInit():void {
    this.carOwnersService.getOwners().subscribe(data=>{
      this.loading=false
      return this.owners=data
      
    })
  
  }

}
