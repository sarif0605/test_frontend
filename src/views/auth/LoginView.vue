<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <router-link to="/" class="absolute top-5 left-5 text-primary font-bold hover:underline">Back</router-link>
    <div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
      <h2 class="text-2xl font-extrabold text-center text-primary">Welcome Back!</h2>
      <p class="text-sm text-center text-gray-500 mt-1">Login to your account</p>
      <div role="alert" class="alert alert-error" v-if="authStore.isErr">
           <svg
             xmlns="http://www.w3.org/2000/svg"
             class="h-6 w-6 shrink-0 stroke-current"
             fill="none"
             viewBox="0 0 24 24"
           >
             <path
               stroke-linecap="round"
               stroke-linejoin="round"
               stroke-width="2"
               d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
             />
           </svg>
           <ul>
             <li
               v-for="(msg, index) in authStore.errMsg.general"
               :key="'general-' + index"
             >
               {{ msg }}
             </li>
             <li
               v-for="(errors, field) in authStore.errMsg"
               v-if="field !== 'general'"
               :key="field"
             >
               <ul>
                 <li v-for="(msg, index) in errors" :key="index">{{ msg }}</li>
               </ul>
             </li>
           </ul>
         </div>
      <form @submit.prevent="handleLogin" class="space-y-5 mt-5">
       <div
         class="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50"
         v-if="authStore.isLoading"
         style="background-color: rgba(0, 0, 0, 0.5)"
       >
         <LoadingComponent />
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
        <div class="form-control relative">
          <label for="password" class="label">
            <span class="label-text text-primary">Password</span>
          </label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="data.password"
            class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="Enter your password"
            required
          />
          <!-- Toggle password visibility -->
          <button
            type="button"
            class="absolute top-1/4 right-3 transform -translate-y-1/2 text-gray-500"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'Tutup' : 'Lihat' }}
          </button>
        </div>
        <button
          type="submit"
          class="btn w-full bg-primary text-white hover:bg-primary-focus transition-all duration-300"
          :class="{ 'loading': isLoading }"
        >
          Login
        </button>
      </form>
      <p class="text-center text-sm text-gray-500 mt-5">
        Don't have an account? 
        <RouterLink :to="{ name: 'Register' }" class="text-primary font-medium hover:underline">Sign up</RouterLink>
      </p>
    </div>
  </div>
</template>
 
<script setup>
 import LoadingComponent from '@/components/LoadingComponent.vue';
 import { useAuthStore } from '@/stores/AuthStore';
 import { reactive, ref } from 'vue';
 import { RouterLink } from 'vue-router';
 
 const authStore = useAuthStore();

 const data = reactive({
   email: '',
   password: ''
 });

 const showPassword = ref(false);  // state to control password visibility

 const handleLogin = () => {
   authStore.isLoading = true;
   try {
     authStore.loginUser(data);
   } catch (error) {
     console.error('Error fetching data:', error);
   } finally {
     authStore.isLoading = false;
   }
 };
</script>
