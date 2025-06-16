import { API } from '@/api';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  username: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  authError: string | null;
  router: any;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: Cookies.get('token') || null,
    username: Cookies.get('username') || null,
    userId: Cookies.get('userId') || null,
    isAuthenticated: !!Cookies.get('token'),
    authError: null,
    router: useRouter(),
  }),
  actions: {
    async register(username: string, password: string) {
      try {
        const response = await API.post('/register', { username, password });

        if (response.data.status === 201) {
          return { status: 201, message: response.data.message };
        } else {
          this.authError = response.data.message;
          return {
            status: response.data.status,
            message: response.data.message,
          };
        }
      } catch (error: any) {
        if (error.response) {
          this.authError = error.response.data.detail || 'Ошибка регистрации';
          return {
            status: error.response.status,
            message: this.authError,
          };
        } else {
          this.authError = 'Неизвестная ошибка';
          return { status: 500, message: 'Неизвестная ошибка' };
        }
      }
    },

    async login(username: string, password: string) {
      try {
        const response = await API.post('/login', { username, password });

        if (response.data.status === 200) {
          this.token = response.data.token;
          this.username = username;
          this.userId = response.data.userId;
          this.isAuthenticated = true;

          API.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

          Cookies.set('token', String(this.token), { expires: 7 });
          Cookies.set('username', this.username, { expires: 7 });
          Cookies.set('userId', String(this.userId), { expires: 7 });

          return { status: 200, message: response.data.message };
        } else {
          this.authError = response.data.message;
          return {
            status: response.data.status,
            message: response.data.message,
          };
        }
      } catch (error: any) {
        if (error.response) {
          this.authError = error.response.data.detail || 'Ошибка авторизации';
          return {
            status: error.response.status,
            message: this.authError,
          };
        } else {
          this.authError = 'Неизвестная ошибка';
          return { status: 500, message: 'Неизвестная ошибка' };
        }
      }
    },

    async googleLogin() {
      try {
        const response = await API.post('/google-login', {
          token: 'googleToken??',
        });
        if (response.data.status === 200) {
          this.token = response.data.token;
          this.username = response.data.username;
          this.userId = response.data.userId;
          this.isAuthenticated = true;
          API.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
          Cookies.set('token', String(this.token), { expires: 7 });
          Cookies.set('username', String(this.username), { expires: 7 });
          Cookies.set('userId', String(this.userId), { expires: 7 });
          return { status: 200, message: response.data.message };
        } else {
          this.authError = response.data.message;
          return {
            status: response.data.status,
            message: response.data.message,
          };
        }
      } catch (error: any) {
        if (error.response) {
          this.authError = error.response.data.detail || 'Ошибка авторизации';
          return {
            status: error.response.status,
            message: this.authError,
          };
        } else {
          this.authError = 'Неизвестная ошибка';
          return { status: 500, message: 'Неизвестная ошибка' };
        }
      }
    },

    logout() {
      this.token = null;
      this.username = null;
      this.userId = null;
      this.isAuthenticated = false;

      delete API.defaults.headers.common['Authorization'];

      Cookies.remove('token');
      Cookies.remove('username');
      Cookies.remove('userId');

      this.router.push('/auth');
    },
  },
});
