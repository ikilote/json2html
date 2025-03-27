import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MagmaInput, MagmaInputTextarea } from '@ikilote/magma';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JsPipe } from './js.pipe';

@NgModule({
    declarations: [AppComponent, JsPipe],
    imports: [BrowserModule, AppRoutingModule, MagmaInput, MagmaInputTextarea],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
