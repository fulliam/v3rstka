<template>
  <div class="auth-container">
    <div :key="authKey" class="form" @submit.prevent="handleSubmit">
      <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

      <Input
        v-model="username"
        placeholder="Username"
        :error="usernameError"
        @input="clearError('username')"
        required
      />

      <Input
        v-model="password"
        :type="'password'"
        placeholder="Password"
        :error="passwordError"
        @input="clearError('password')"
        required
      />

      <Input
        v-if="!isLogin"
        v-model="confirmPassword"
        :type="'password'"
        placeholder="Confirm Password"
        :error="confirmPasswordError"
        @input="clearError('confirmPassword')"
        required
      />
    </div>

    <div :key="authKey" class="auth-footer">
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

      <p class="switch-mode" @click="toggleMode">
        {{
          isLogin
            ? 'Don`t have an account? Register'
            : 'Already have an account? Login'
        }}
      </p>
    </div>

    <img
      :key="authKey"
      src="@/assets/bg/castle/dragon.png"
      alt="dragon"
      class="dragon"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toast';

const { register, login } = useAuthStore();
const { addToast } = useToastStore();
const router = useRouter();

const authKey = ref(0);
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
  authKey.value += 1;
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

        // TODO: add check current character
        if (response.status === 200 || response.status === 201) {
          router.push('/create_character');
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
    console.error(error);
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
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: relative;
  animation: fadeIn 1s ease-in-out;
  overflow: hidden;
  backdrop-filter: blur(2px);
  background: #50b0952b;
  width: 360px;
  height: 460px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 20px;

  .dragon {
    position: absolute;
    left: -60%;
    bottom: 0;
    height: 100%;
    z-index: -1;
    animation: fadeIn 1s ease-in-out;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 300px;
    animation: fadeIn 1s ease-in-out;
  }

  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 58px;
    color: #cd6e3f;
  }

  p.switch-mode {
    text-align: center;
    margin-top: 15px;
    color: #60adff;
    cursor: pointer;
    text-decoration: underline;
  }
}

.auth-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 83%;
  animation: fadeIn 1s ease-in-out;
}
</style>
