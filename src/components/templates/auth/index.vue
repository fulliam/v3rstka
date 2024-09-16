<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

    <div class="form" @submit.prevent="handleSubmit">
      <Input
        v-model="username"
        placeholder="Username"
        :error="usernameError"
        @input="clearError('username')"
        required
      />

      <Input
        v-model="password"
        :type="isLogin ? 'password' : 'text'"
        placeholder="Password"
        :error="passwordError"
        @input="clearError('password')"
        required
      />

      <Input
        v-if="!isLogin"
        v-model="confirmPassword"
        placeholder="Confirm Password"
        :error="confirmPasswordError"
        @input="clearError('confirmPassword')"
        required
      />
    </div>

    <div class="auth-footer">
      <Button
        type="secondary"
        :label="isLogin ? 'Login' : 'Register'"
        :action="handleSubmit"
        :disabled="
          isLogin
            ? !username || !password
            : !username || !password || !confirmPassword
        "
      />

      <Button type="primary" label="Google" :action="handleGoogleLogin" />
    </div>

    <p class="switch-mode" @click="toggleMode">
      {{
        isLogin
          ? 'Don`t have an account? Register'
          : 'Already have an account? Login'
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toast';

const { register, login, googleLogin } = useAuthStore();
const { addToast } = useToastStore();
const router = useRouter();

const isLogin = ref(true);
const username = ref('');
const password = ref('');
const confirmPassword = ref('');

const usernameError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  username.value = '';
  password.value = '';
  confirmPassword.value = '';
  clearAllErrors();
};

const clearError = (field: string) => {
  if (field === 'username') usernameError.value = '';
  if (field === 'password') passwordError.value = '';
  if (field === 'confirmPassword') confirmPasswordError.value = '';
};

const clearAllErrors = () => {
  usernameError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
};

const validateUsername = (username: string) => {
  if (!usernamePattern.test(username)) {
    return 'Имя пользователя должно содержать только буквы, цифры и подчеркивания, длина от 3 до 20 символов.';
  }
  return '';
};

const validatePassword = (password: string) => {
  if (!passwordPattern.test(password)) {
    return 'Пароль должен содержать хотя бы одну букву, одну цифру и иметь не менее 8 символов.';
  }
  return '';
};

const handleSubmit = async () => {
  clearAllErrors();

  const usernameValidationError = validateUsername(username.value);
  const passwordValidationError = validatePassword(password.value);

  if (usernameValidationError) {
    usernameError.value = usernameValidationError;
    addToast(usernameValidationError, 'error', 'top-right', 5000);
    return;
  }

  if (passwordValidationError) {
    passwordError.value = passwordValidationError;
    addToast(passwordValidationError, 'error', 'top-right', 5000);
    return;
  }

  if (!isLogin.value && password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Пароли не совпадают!';
    addToast(confirmPasswordError.value, 'error', 'top-right', 5000);
    return;
  }

  try {
    let response;
    if (isLogin.value) {
      response = await login(username.value, password.value);
    } else {
      response = await register(username.value, password.value);
    }

    if (response.status === 200 || response.status === 201) {
      if (isLogin.value) {
        router.push('/game');
      } else {
        isLogin.value = true;
        addToast('Регистрация прошла успешно!', 'success', 'top-right', 3000);

        response = await login(username.value, password.value);

        if (response.status === 200 || response.status === 201) {
          router.push('/game');
        }
      }
    } else {
      handleErrorResponse(response.message);
    }
  } catch (error) {
    const message = isLogin.value
      ? 'Не удалось войти. Проверьте данные.'
      : 'Не удалось зарегистрироваться. Проверьте данные.';
    addToast(message, 'error', 'top-right', 5000);
  }
};

const handleGoogleLogin = async () => {
  try {
    await googleLogin();
    router.push('/game');
  } catch (error) {
    addToast(
      'Не удалось войти через Google. Попробуйте еще раз.',
      'error',
      'top-right',
      5000
    );
  }
};

const handleErrorResponse = (message: string) => {
  if (message.toLowerCase().includes('username')) {
    usernameError.value = message;
  } else if (message.toLowerCase().includes('password')) {
    passwordError.value = message;
    if (!isLogin.value) {
      confirmPasswordError.value = message;
    }
  } else {
    usernameError.value = message;
    passwordError.value = message;
    confirmPasswordError.value = message;
  }
};
</script>

<style scoped lang="scss">
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: fadeIn 1s ease-in-out;

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 300px;
  }

  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 42px;
    animation: fadeIn 1s ease-in-out;
  }

  p.switch-mode {
    text-align: center;
    margin-top: 15px;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    animation: fadeIn 1s ease-in-out;
  }
}

.auth-footer {
  display: flex;
  gap: 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
