<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <div v-if="!isLogin" class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" required />
      </div>

      <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
    </form>

    <p class="switch-mode" @click="toggleMode">
      {{ isLogin ? 'Don’t have an account? Register' : 'Already have an account? Login' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
};

const handleSubmit = () => {
  if (!isLogin.value && password.value !== confirmPassword.value) {
    alert('Passwords do not match!');
    return;
  }

  // Обработка авторизации или регистрации
  if (isLogin.value) {
    console.log('Login:', { email: email.value, password: password.value });
  } else {
    console.log('Register:', { email: email.value, password: password.value });
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
