<template>
  <div class="hero bg-base-200 min-h-screen mt-9">
    <LoadingComponent v-if="authStore.isLoading" />

    <!-- Fallback untuk Data Kosong -->
    <div v-else-if="!content" class="text-center text-gray-500">
      Data tidak tersedia.
    </div>

    <!-- Konten Utama -->
    <div v-else class="hero-content flex-col lg:flex-row gap-8">
      <img
        :src="content.image_url"
        alt="Content Image"
        class="w-full max-w-xs lg:max-w-sm rounded-lg shadow-2xl object-cover"
      />
      <div>
        <h1 class="text-5xl font-bold">{{ content.title || "Judul Tidak Tersedia" }}</h1>
        <p class="py-6">{{ content.content || "Konten tidak tersedia." }}</p>
        <p class="text-sm text-gray-500">
          By. <span class="font-semibold">{{ content.user?.name || "Tidak diketahui" }}</span>
        </p>
        <p class="text-sm text-gray-500">{{ new Date(content.created_at).toLocaleDateString() }}</p>

        <RouterLink v-if="authStore.userToken" :to="{ name: 'Comment', params: { id: content.id } }" class="btn btn-secondary mt-4 mr-3">
          Komentar
        </RouterLink>
        <RouterLink :to="{ name: 'Content' }" class="btn btn-primary mt-4">
          Kembali
        </RouterLink>

        <!-- Bagian Komentar -->
        <div v-if="content.comments.length > 0" class="mt-6">
          <h2 class="text-2xl font-semibold mb-4">Komentar</h2>
          <div v-for="comment in content.comments" :key="comment.id" class="bg-white p-4 rounded-lg shadow-md mb-4">
            <p class="font-semibold text-gray-800">⭐ {{ comment.rating }} / 5</p>
            <p class="text-gray-700">{{ comment.comment_text }}</p>
            <p class="text-sm text-gray-500 mt-2">
              {{ new Date(comment.created_at).toLocaleDateString() }}
            </p>
          </div>
        </div>
        <div v-else class="mt-6 text-gray-500">Belum ada komentar.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { customeApi } from "@/api";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/AuthStore";
import LoadingComponent from "@/components/LoadingComponent.vue";

const authStore = useAuthStore();
const route = useRoute();
const content = ref(null);

const detailContent = async () => {
  authStore.isLoading = true;
  try {
    const { data } = await customeApi.get(`/content/${route.params.id}`);
    content.value = data.data;
    console.log(data.data);
  } catch (error) {
    console.error("Gagal memuat data:", error);
  } finally {
    authStore.isLoading = false;
  }
};

onMounted(() => {
  detailContent();
});
</script>
