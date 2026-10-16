import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RequestedplanComponent } from './components/requestedplan/requestedplan.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { AdminaddplanComponent } from './components/adminaddplan/adminaddplan.component';
import { AdminviewplanComponent } from './components/adminviewplan/adminviewplan.component';
import { AdmineditplanComponent } from './components/admineditplan/admineditplan.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UserviewplanComponent } from './components/userviewplan/userviewplan.component';
import { UserplanformComponent } from './components/userplanform/userplanform.component';
import { UserappliedplanComponent } from './components/userappliedplan/userappliedplan.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { authGuard } from './components/authguard/auth.guard';

const routes: Routes = [
  
  {path : '', component : HomeComponent},
  {path : 'register', component : RegistrationComponent},
  {path : 'login', component : LoginComponent},
  {path : 'adddietplan', component : AdminaddplanComponent, canActivate:[authGuard], data:{role:'Admin'}},
  {path : 'adminviewplan', component : AdminviewplanComponent,canActivate:[authGuard],data:{role:'Admin'}},
  {path : 'admineditplan/:id', component : AdmineditplanComponent,canActivate:[authGuard],data:{role:'Admin'}},
  {path:'adminfeedback',component:AdminviewfeedbackComponent,canActivate:[authGuard],data:{role:'Admin'}},
  {path : 'requestedplan', component : RequestedplanComponent,canActivate:[authGuard],data:{role:'Admin'}},
  {path : 'userviewplan', component : UserviewplanComponent,canActivate:[authGuard],data:{role:'User'}},
  {path : 'userplanform/:id', component : UserplanformComponent,canActivate:[authGuard],data:{role:'User'}},
  {path:'useraddfeedback',component:UseraddfeedbackComponent,canActivate:[authGuard],data:{role:'User'}},
  {path:'userviewfeedback',component:UserviewfeedbackComponent,canActivate:[authGuard],data:{role:'User'}},
  {path: 'userappliedplan', component:UserappliedplanComponent,canActivate:[authGuard],data:{role:'User'}}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
