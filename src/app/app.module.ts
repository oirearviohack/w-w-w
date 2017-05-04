import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GraafiComponent } from './graafi/graafi.component';

import { Network, DataSet, Node, Edge, IdType } from 'vis';

//let vis = require('vis')

@NgModule({
  declarations: [
    AppComponent,
    GraafiComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
