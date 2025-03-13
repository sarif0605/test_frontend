<template>
  <div class="navbar bg-primary fixed top-0 left-0 w-full z-50 shadow-md">
    <!-- Navbar Start -->
    <div class="navbar-start">
      <div class="dropdown">
        <!-- Button untuk membuka dropdown -->
        <button tabindex="0" class="btn btn-ghost btn-circle text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-white">
          <li><RouterLink :to="{ name: 'Home' }">Home</RouterLink></li>
          <li><RouterLink :to="{ name: 'Content' }">Content</RouterLink></li>
          <li><RouterLink :to="{ name: 'Category' }">Category</RouterLink></li>
          <li v-if="!authStore.userToken">
            <RouterLink :to="{ name: 'Login' }">Login</RouterLink>
          </li>
          <li v-else>
            <button @click="showLogoutModal = true">Logout</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Navbar Center -->
    <div class="navbar-center flex items-center gap-4">
      <span class="btn btn-ghost text-xl text-white">ADHIVASINDO</span>
      <RouterLink :to="{ name: 'Favorite' }" class="btn btn-ghost text-white text-xl">
        <i class="pi pi-star-fill text-yellow-400"></i>
      </RouterLink>
    </div>
  </div>

  <!-- Modal Konfirmasi Logout -->
  <div v-if="showLogoutModal" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Konfirmasi Logout</h3>
      <p class="py-4">Apakah Anda yakin ingin logout?</p>
      <div class="modal-action">
        <!-- Tombol Logout -->
        <button class="btn btn-error" @click="handleLogout">Logout</button>
        <!-- Tombol Batal -->
        <button class="btn" @click="showLogoutModal = false">Batal</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";

const authStore = useAuthStore();
const showLogoutModal = ref(false);

const handleLogout = async () => {
  try {
    await authStore.logoutUser();
    showLogoutModal.value = false;
  } catch (error) {
    console.error("Logout gagal:", error);
  }
};
</script>
