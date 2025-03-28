import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaInputTextarea,
} from '@ikilote/magma';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JsPipe } from './js.pipe';

@NgModule({
    declarations: [AppComponent, JsPipe],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaInputSelect,
        MagmaInputNumber,
        MagmaInputCheckbox,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
