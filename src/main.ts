import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ShellComponent } from './app/ui/layout/shell/shell.component';
 

bootstrapApplication(ShellComponent, appConfig)
  .catch((err) => console.error(err));

  // ShellComponent componente raíz de la aplicación