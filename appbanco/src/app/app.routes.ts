import { Routes } from '@angular/router';
import { PrincipalComponent } from './views/principal/principal.component';
import { LoginComponent } from './views/login/login.component';
import { ChatComponent } from './views/chat/chat.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'principal',
        title: 'Principal',
        component: PrincipalComponent
    },
    {
        path: 'chat',
        title: 'Chat',
        component: ChatComponent
    },
     

];
