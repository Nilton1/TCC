import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResearchesTreesComponent } from './researches-trees/researches-trees.component';

const routes: Routes = [
  {path: '', component:ResearchesTreesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
