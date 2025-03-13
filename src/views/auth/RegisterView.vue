<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
    <LoadingComponent v-if="authStore.isLoading" />
    <router-link to="/" class="absolute top-5 left-5 text-primary font-bold hover:underline">Back</router-link>
    <div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
      <h2 class="text-2xl font-extrabold text-center text-primary">Welcome Back!</h2>
      <p class="text-sm text-center text-gray-500 mt-1">Register to your account</p>
      <div role="alert" class="alert alert-error" v-if="authStore.isErr">
        <ul>
          <li v-for="(msg, index) in authStore.errMsg.general" :key="'general-' + index">{{ msg }}</li>
          <li v-for="(errors, field) in authStore.errMsg" v-if="field !== 'general'" :key="field">
            <ul>
              <li v-for="(msg, index) in errors" :key="index">{{ msg }}</li>
            </ul>
          </li>
        </ul>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-5 mt-5">
        <div class="form-control">
          <label for="email" class="label">
            <span class="label-text text-primary">Name</span>
          </label>
          <input
            type="text"
            id="name"
            v-model="data.name"
            class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="Enter your name"
            required
          />
        </div>
        <div class="form-control">
          <label for="email" class="label">
            <span class="label-text text-primary">Email</span>
          </label>
          <input
            type="email"
            id="email"
            v-model="data.email"
            class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="form-control">
          <label for="password" class="label">
            <span class="label-text text-primary">Password</span>
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="data.password"
              class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-3 text-gray-500 focus:outline-none"
            >
              <span v-if="showPassword">Tutup</span>
              <span v-else>Lihat</span>
            </button>
          </div>
        </div>
        <div class="form-control">
          <label for="password_confirmation" class="label">
            <span class="label-text text-primary">Konfirmasi Password</span>
          </label>
          <div class="relative">
            <input
              :type="showPasswordConfirmation ? 'text' : 'password'"
              id="password_confirmation"
              v-model="data.password_confirmation"
              class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter your confirmation password"
              required
            />
            <button
              type="button"
              @click="togglePasswordConfirmation"
              class="absolute right-3 top-3 text-gray-500 focus:outline-none"
            >
              <span v-if="showPasswordConfirmation">Tutup</span>
              <span v-else>Lihat</span>
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="btn w-full bg-primary text-white hover:bg-primary-focus transition-all duration-300"
        >
          Register
        </button>
      </form>
      <p class="text-center text-sm text-gray-500 mt-5">
        Already have an account? 
        <RouterLink :to="{ name: 'Login' }" class="text-primary font-medium hover:underline">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();

const data = reactive({
  email: '',
  password: '',
  name: '',
  password_confirmation: ''
});

const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const togglePasswordConfirmation = () => {
  showPasswordConfirmation.value = !showPasswordConfirmation.value;
};

const handleLogin = () => {
  authStore.isLoading = true;
  try {
    authStore.registerUser(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    authStore.isLoading = false;
  }
};
</script>
