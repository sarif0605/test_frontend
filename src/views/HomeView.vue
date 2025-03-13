<template>
  <div class="hero bg-base-200 min-h-screen flex justify-center items-center mt-6">
    <div class="hero-content text-center lg:text-left flex-col lg:flex-row animate-fade-in">
      <div class="animate-scale-up">
        <h1 class="text-4xl font-bold text-center lg:text-left mb-4">
          Membaca Buku Membawa Kita Terhadap Pengetahuan Yang Luas!
        </h1>
        <p class="py-6 mb-2 px-4 sm:px-0">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
          quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
        <RouterLink :to="{ name: 'Content' }" class="btn btn-primary">Get Started</RouterLink>
      </div>
    </div>
  </div>

  <section class="mx-auto max-w-6xl p-4">
    <h1 class="text-2xl font-bold mb-4">Category</h1>
    <LoadingComponent v-if="authStore.isLoading" />

    <div v-else-if="dataCategory && dataCategory.length < 1" class="text-center text-gray-500">
      Data belum tersedia.
    </div>
    <div v-else class="grid grid-cols-2 gap-4">
    <div
      class="card bg-base-100 image-full w-full shadow-xl transform transition-transform hover:scale-105 hover:shadow-lg animate-fade-in"
      v-for="data in dataCategory"
      :key="data.id"
    >
        <figure class="rounded-lg">
          <img :src="data.image_url" alt="Gambar Buku" class="object-cover h-48 w-full" />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-lg font-semibold mb-2">{{ data.title }}</h2>
          <div class="card-actions justify-between items-center mt-4">
            <RouterLink
              :to="{ name: 'CategoryId', params: { id: data.id } }"
              class="btn btn-primary"
            >
              Lihat
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
</section>

  <section class="mx-auto max-w-6xl p-4">
    <h1 class="text-2xl font-bold mb-4">Content New</h1>
    <!-- Komponen Loading -->
    <LoadingComponent v-if="authStore.isLoading" />

    <div v-else-if="dataContent && dataContent.length < 1" class="text-center text-gray-500">
      Data belum tersedia.
    </div>

    <!-- Jika Data Tersedia -->
    <div v-else class="grid grid-cols-2 gap-4">
    <div
      class="card bg-base-100 image-full w-full shadow-xl transform transition-transform hover:scale-105 hover:shadow-lg animate-fade-in"
      v-for="data in dataContent"
      :key="data.id"
    >
        <figure class="rounded-lg overflow-hidden">
          <img :src="data.image_url" alt="Gambar Buku" class="object-cover h-48 w-full" />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-lg font-semibold mb-2">{{ data.title }}</h2>
          <p class="text-sm text-white">{{ data.user?.name || 'Nama tidak tersedia' }}</p>
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
  </section>
</template>

<script setup>
import { customeApi } from '@/api';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from "vue-toast-notification";

const $toast = useToast();
const authStore = useAuthStore();
const dataContent = ref([]);
const dataCategory = ref([]);

const getAllContent = async () => {
  try {
    authStore.isLoading = true;
    const { data } = await customeApi.get('/content-three');
    console.log("apakah data tampil");
    console.log(data);
    dataContent.value = data.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    authStore.isLoading = false;
  }
};

const submitFavorite = async (id) => {
  authStore.isLoading = true;
  try {
    await customeApi.post('/add-favorite',{
      "content_id" : id
    }, {
      headers : {
        Authorization : `Bearer ${authStore.userToken}`
      }
    });
    $toast.success("Berhasil Tambah Kemenu Favorite!", {
        position: "top-right",
      });
  }catch(e) {
    $toast.error("Gagal Tambah Kemenu Favorit!", {
        position: "top-right",
      });
  } finally {
    authStore.isLoading = false;
  }
}

const getAllCategory = async () => {
  try {
    authStore.isLoading = true;
    const { data } = await customeApi.get('/category-all');
    console.log("apakah data tampil");
    console.log(data);
    dataCategory.value = data.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    authStore.isLoading = false;
  }
};

onMounted(() => {
  getAllContent();
  getAllCategory();
});
</script>
