import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GraafiComponent } from './graafi/graafi.component';
import { MessageComponent } from './message/message.component';

import { Network, DataSet, Node, Edge, IdType } from 'vis';

@NgModule({
  declarations: [
    AppComponent,
    GraafiComponent,
    MessageComponent
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
