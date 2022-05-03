import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonasComponent } from './personas/personas.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'personas',
    pathMatch: 'full',
  },
  {
    path: 'personas',
    component: PersonasComponent,
    data: {
      title: 'Personas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
