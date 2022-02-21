import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewComponent } from './view/view.component';
import { CudComponent } from './cud/cud.component';

const routes: Routes = [
  {path:'',redirectTo:'/view',pathMatch: 'full'},
  {path: 'view', component:ViewComponent},
  {path:'cud/:id/:type', component:CudComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
