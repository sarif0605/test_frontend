<template>
  <section class="mx-auto max-w-6xl p-4 mt-16">
    <h1 class="text-3xl font-bold mb-6 text-center animate-fade-in">Favorite</h1>

    <LoadingComponent v-if="authStore.isLoading" />

    <div v-else-if="dataContent.length < 1" class="text-center text-gray-500 animate-fade-in">
      Data belum tersedia.
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        class="card bg-base-100 w-full shadow-xl transform transition-all hover:animate-card-hover"
        v-for="data in dataContent"
        :key="data.id"
      >
        <figure class="px-10 pt-10 animate-scale-up">
          <img
            :src="data.content.image_url"
            alt="Gambar"
            class="rounded-xl object-cover h-48 w-full"
          />
        </figure>

        <div class="card-body items-center text-center">
          <h2 class="card-title">{{ data.content.title }}</h2>
          <p>{{ data.content.content.substring(0, 20) }}...</p>
          <p>By. {{ data.user?.name || 'User ID: ' + data.user_id }}</p>
          <p>{{ new Date(data.created_at).toLocaleDateString() }}</p>

          <div class="card-actions flex justify-center gap-2">
            <RouterLink 
              :to="{ name: 'ContentId', params: { id: data.content.id } }" 
              class="btn btn-primary btn-sm sm:btn-md"
            >
              Lihat
            </RouterLink>
            <button
              class="btn btn-accent btn-sm sm:btn-md"
              @click="openDeleteDialog(data)"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <DeleteComponent
    :visible="deleteDialogVisible"
    :itemName="selectedFavorite?.content?.title"
    @update:visible="deleteDialogVisible = $event"
    @confirmDelete="deleteFavorite"
  />
</template>

<script setup>
import { customeApi } from '@/api';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from "vue-toast-notification";
import DeleteComponent from '@/components/DeleteComponent.vue';

const $toast = useToast();
const authStore = useAuthStore();
const dataContent = ref([]);
const deleteDialogVisible = ref(false);
const selectedFavorite = ref(null);

const getAll = async () => {
  try {
    authStore.isLoading = true;
    const { data } = await customeApi.get('/get-favorite', {
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
      },
    });
    dataContent.value = data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    authStore.isLoading = false;
  }
};

const openDeleteDialog = (favorite) => {
  selectedFavorite.value = favorite;
  deleteDialogVisible.value = true;
};

const deleteFavorite = async () => {
  if (!selectedFavorite.value) return;

  try {
    await customeApi.delete('/remove-favorite', {
      data: { content_id: selectedFavorite.value.content.id },
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
      },
    });

    $toast.success("Berhasil Menghapus Daftar Favorit!", { position: "top-right" });

    dataContent.value = dataContent.value.filter(
      item => item.content.id !== selectedFavorite.value.content.id
    );

    deleteDialogVisible.value = false;
  } catch (error) {
    $toast.error("Gagal Menghapus Daftar Favorit!", { position: "top-right" });
  }
};

onMounted(() => {
  getAll();
});
</script>
