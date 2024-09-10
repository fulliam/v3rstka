<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="username" type="text" id="username" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <div v-if="!isLogin" class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          id="confirmPassword"
          required
        />
      </div>

      <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
    </form>

    <p class="switch-mode" @click="toggleMode">
      {{
        isLogin
          ? 'Don’t have an account? Register'
          : 'Already have an account? Login'
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const { register, login } = useAuthStore();
const router = useRouter();

const isLogin = ref(true);
const username = ref('');
const password = ref('');
const confirmPassword = ref('');

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  username.value = '';
  password.value = '';
  confirmPassword.value = '';
};

const handleSubmit = () => {
  if (!isLogin.value && password.value !== confirmPassword.value) {
    alert('Passwords do not match!');
    return;
  }

  if (isLogin.value) {
    login(username.value, password.value)
      .then(() => router.push('/game'))
      .catch(() => console.log('Failed login'));
  } else {
    register(username.value, password.value)
      .then(() => (isLogin.value = true))
      .catch(() => console.log('Failed register'));
  }
};
</script>

<style scoped lang="scss">
.auth-container {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #1e1e1e;
  backdrop-filter: blur(2px);

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
  }

  button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 3px;
    background-color: #5cb85c;
    color: #fff;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: #4cae4c;
    }
  }

  .switch-mode {
    text-align: center;
    margin-top: 15px;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
