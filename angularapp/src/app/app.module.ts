import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminaddplanComponent } from './components/adminaddplan/adminaddplan.component';
import { AdmineditplanComponent } from './components/admineditplan/admineditplan.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { AdminviewplanComponent } from './components/adminviewplan/adminviewplan.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RequestedplanComponent } from './components/requestedplan/requestedplan.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserappliedplanComponent } from './components/userappliedplan/userappliedplan.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UserplanformComponent } from './components/userplanform/userplanform.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UserviewplanComponent } from './components/userviewplan/userviewplan.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminaddplanComponent,
    AdmineditplanComponent,
    AdminnavComponent,
    AdminviewfeedbackComponent,
    ErrorComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    RegistrationComponent,
    RequestedplanComponent,
    UseraddfeedbackComponent,
    UsernavComponent,
    UserplanformComponent,
    UserviewfeedbackComponent,
    UserviewplanComponent,
    UserappliedplanComponent,
    AdminviewplanComponent
    
  ],


  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
