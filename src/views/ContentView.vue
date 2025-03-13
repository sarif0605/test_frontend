<template>
  <section class="mx-auto max-w-6xl p-4 mt-16">
    <h1 class="text-3xl font-bold mb-6 text-center">Content</h1>
    
    <!-- Search & Button -->
    <div class="flex items-center justify-between mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search Content..."
        class="input input-bordered w-full sm:max-w-xs"
      />
    </div>

    <!-- Loading State -->
    <div v-if="authStore.isLoading" class="flex justify-center py-4">
      <LoadingComponent />
    </div>

    <!-- Jika Data Kosong -->
    <div v-else-if="dataContent.length === 0" class="text-center text-gray-500">
      Data belum tersedia.
    </div>

    <!-- Jika Data Ada -->
    <div v-else class="grid grid-cols-2 gap-4">
      <div
        class="card bg-base-100 image-full w-full shadow-xl transform transition-transform hover:scale-105 hover:shadow-lg animate-fade-in"
        v-for="data in dataContent"
        :key="data.id"
      >
        <figure class="rounded-lg">
          <img :src="data.image_url" alt="Gambar Buku" class="object-cover h-48 w-full" />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-lg font-semibold mb-2">{{ data.title }}</h2>
          <div class="flex items-center justify-end gap-2">
            <RouterLink
              :to="{ name: 'ContentId', params: { id: data.id } }"
              class="btn btn-primary"
            >
            <i class="pi pi-eye" style="color: slateblue"></i>
            </RouterLink>
            <button v-if="authStore.userToken" class="btn btn-primary btn-square" @click="submitFavorite(data.id)">
              <i class="pi pi-bookmark" style="color: slateblue"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > pagination.per_page" class="flex justify-center mt-5 space-x-2">
      <button class="btn btn-sm sm:btn-md" @click="changePage(-1)" :disabled="!pagination.prev_page_url">
        «
      </button>
      <button class="btn btn-sm sm:btn-md">{{ currentPage }}</button>
      <button class="btn btn-sm sm:btn-md" @click="changePage(1)" :disabled="!pagination.next_page_url">
        »
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { customeApi } from '@/api';
import LoadingComponent from '@/components/LoadingComponent.vue';

const authStore = useAuthStore();
const dataContent = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const pagination = ref({
  prev_page_url: null,
  next_page_url: null,
  total: 0,
  per_page: 8,
});

// Fungsi untuk mengambil data
const fetchContent = async () => {
  authStore.isLoading = true;
  try {
    const { data } = await customeApi.get('/content', {
      params: {
        page: currentPage.value,
        query: searchQuery.value.trim(),
      }
    });

    dataContent.value = data.data.data;
    pagination.value = {
      prev_page_url: data.data.prev_page_url,
      next_page_url: data.data.next_page_url,
      total: data.data.total,
      per_page: data.data.per_page,
    };
  } catch (error) {
    console.error('Failed to fetch content:', error);
  } finally {
    authStore.isLoading = false;
  }
};

const submitFavorite = async (id) => {
  authStore.isLoading = true;
  try {
    await customeApi.get('/add-favorite',{
      "content_id" : id
    }, {
      headers : {
        Authorization : `Bearer ${authStore.userToken}`
      }
    });
  }catch(e) {
    console.log(e)
  } finally {
    authStore.isLoading = false;
  }
}

// Fungsi untuk mengubah halaman
const changePage = (step) => {
  currentPage.value += step;
  fetchContent();
};

// Panggil API setiap kali searchQuery berubah
watch(searchQuery, () => {
  currentPage.value = 1;
  fetchContent();
});

// Panggil API saat komponen dimuat
onMounted(fetchContent);
</script>