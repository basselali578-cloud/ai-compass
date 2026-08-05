import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ModelsComponent } from './features/models/models.component';
import { ToolsComponent } from './features/tools/tools.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { SavedComponent } from './features/saved/saved.component';
import { CollectionComponent } from './features/collections/collection.component';
import { CollectionsComponent } from './features/collections/collections.component';
import { WorkflowsComponent } from './features/workflows/workflows.component';
import { WorkflowComponent } from './features/workflows/workflow.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'models', component: ModelsComponent },
  { path: 'tools', component: ToolsComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'collections/:slug', component: CollectionComponent },
  { path: 'workflows', component: WorkflowsComponent },
  { path: 'workflows/:slug', component: WorkflowComponent },
  { path: 'saved', component: SavedComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
