import { Component,Injectable, OnInit } from '@angular/core';
import { FormGroup, FormArray,FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { CarOwnersService, OwnerEntity,CarEntity } from '../shared/ICarOwnersService';
import { ViewComponent } from '../view/view.component';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-cud',
  templateUrl: './cud.component.html',
  styleUrls: ['./cud.component.scss']
})

@Injectable({providedIn: 'root' })
export class CudComponent implements OnInit{

  constructor(
    public carOwnersService:CarOwnersService,
    public viewComponent: ViewComponent , 
    public location:Location,
    private route:ActivatedRoute,
    public fb:FormBuilder
  ) {}

  public loading:Boolean=true;
  private createdOwnerId:number=0;
  public isView='';
  public owners:OwnerEntity[]=[];
  private idOfCar:number=0

  idNumberValidator(id?:number):ValidatorFn{
    return( control:AbstractControl):{ [key: string]: string } | null =>{
      let numberRegExp: RegExp=/^\D{2}\d{4}\D{2}$/;
      let valid:boolean=true
      let cause='Уже есть в базе!!!';
      if(numberRegExp.test(control.value)){
            this.owners.forEach(owner => {
            if(!owner.id===this.aOwnerForm.id){
              owner.aCars.forEach(car=>{
                car.aIdNumber.toLowerCase()==control.value.toLowerCase()?(valid= false):null
              })
            }else{
              owner.aCars.forEach(car=>{
                if(id!==car.id){
                  car.aIdNumber.toLowerCase()==control.value.toLowerCase()?(valid= false):null
                }
              })
            }
          })
      }else{valid= false,cause="Неправильный формат номера"}
      return valid? null : {why: cause }
    }
  }

  yearValidator():ValidatorFn{
    return( control:AbstractControl):{ [key: string]: string } | null =>{
      let nowYear=new Date().getFullYear()
      let valid:boolean=true
      if(control.value>1989){
        control.value>nowYear?valid= false:null
      }else{valid= false}
      return valid? null : {why: "Ошибка даты" }
    }
  }

  goBack(): void {
    this.location.back();
  }

  add(owner:any){
    if(owner.id ===this.createdOwnerId){
      this.carOwnersService.createOwner(owner)
      .subscribe(owner => {
        this.goBack();
      });
    }else{
      this.carOwnersService.updateOwner(owner)
      .subscribe(()=>this.goBack());
    }
  }

  public aOwnerForm!:any;

  createaCar():FormGroup{
    this.idOfCar++
    return this.fb.group({
      id:[this.idOfCar],
      aIdNumber:[null,this.idNumberValidator(this.idOfCar)],
      aManufacturer:[null],
      aModel:[null],
      aYear:[null,this.yearValidator()]
    })
  }

  getCarToForm(owner:OwnerEntity,i:number):FormGroup{
    return this.fb.group({
      aIdNumber:[owner.aCars[i].aIdNumber,this.idNumberValidator()],
      aManufacturer:[owner.aCars[i].aManufacturer],
      aModel:[owner.aCars[i].aModel],
      aYear:[owner.aCars[i].aYear,this.yearValidator()]
    })
  }


  get aCars():FormArray{
    return <FormArray> this.aOwnerForm.get('aCars');
  }


  addaCar() {
    
    this.aCars.push(this.createaCar());
  }

  deleteCar(id:number){
    this.aCars.removeAt(id);
  }

  generationNewOwnerFormControl(id:number){
    this.loading=false;
    return this.aOwnerForm = this.fb.group(
      {
        id:[id],
        aLastName: [null],
        aFirstName: [null],
        aMiddleName: [null],
        aCars:this.fb.array([this.createaCar()])
      }
    )
  }

  generationOwnerFormControl(owner:OwnerEntity){
    console.log("gener start");
    console.log(owner);   
    
    let cars=[];
    for (let i = 0; i < owner.aCars.length; i++) {
      cars.push(this.getCarToForm(owner,i))
    }
    this.loading=false;
    return this.aOwnerForm = this.fb.group(
      {
        id:[owner.id],
        aLastName: [owner.aLastName],
        aFirstName: [owner.aFirstName],
        aMiddleName: [owner.aMiddleName],
        aCars:this.fb.array(cars)
      }
    )
    
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const type = this.route.snapshot.paramMap.get('type');
    if (id<0) {
      this.goBack();
    } else if(id===0){
      this.carOwnersService.getOwners().subscribe(
        owners=>{ 
          this.createdOwnerId=Math.max(...owners.map(owner => owner.id)) + 1;
          console.log(this.createdOwnerId);          
          this.generationNewOwnerFormControl(this.createdOwnerId);
          return this.owners= owners
        }
      )

    }else{
      this.carOwnersService.getOwners().subscribe(owners=>{return this.owners=owners})
      this.aOwnerForm= this.carOwnersService.getOwnerById(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(owner=>{
        type==='view'?this.isView='readonly':null
        return this.aOwnerForm= this.generationOwnerFormControl(owner)
      })
    }
  }
}
