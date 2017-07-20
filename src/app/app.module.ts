import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CharitySelectionComponent } from './charity-selection/charity-selection.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    SideMenuComponent,
    RegistrationComponent,
    LoginComponent,
    CharitySelectionComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
