import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { Base } from './components/base';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.component('Input', Base.Input);
app.component('Toast', Base.Toast);
app.component('Button', Base.Button);
app.component('Tooltip', Base.Tooltip);
app.component('Modal', Base.Modal);
app.component('JsonView', Base.JsonView);

app.mount('#app');
