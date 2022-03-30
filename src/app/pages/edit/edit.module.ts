import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPageRoutingModule } from './edit-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { EditPage } from './edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FontAwesomeModule,
    EditPageRoutingModule
  ],
  declarations: [EditPage]
})
export class EditPageModule {}
