<template>
    <div class="mx-auto max-w-6xl px-8 rounded-xl py-24">
      <div class="flex flex-col items-center">
        <div class="w-48 h-48 mb-4 rounded overflow-hidden">
          <img
            :src="review.image_url"
            alt="Avatar"
            class="object-cover w-full h-full"
          />
        </div>
        <h2 class="text-2xl font-semibold mb-2">{{ review.title }}</h2>
        <p class="text-lg text-gray-600 mb-2">Year: {{ review.year }}</p>
        <p class="text-gray-700 mb-4"></p>
        <form class="w-full max-w-sm" @submit.prevent="submitReview">
          <label class="input input-bordered flex items-center gap-2 mb-4">
            <input type="text" v-model="critic" class="grow" placeholder="Critic" required />
          </label>
          <div class="rating flex justify-center">
            <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400" v-model="rating" value="1" />
            <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400" v-model="rating" value="2" />
            <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400" v-model="rating" value="3" />
            <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400" v-model="rating" value="4" />
            <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400" v-model="rating" value="5" />
          </div>
          <button type="submit" class="btn btn-primary mt-4">Submit Review</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { customeApi } from '@/api';
  import { useAuthStore } from '@/stores/AuthStore';
  
import { useToast } from "vue-toast-notification";
  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();
  const review = ref('');
  const critic = ref('');
  const rating = ref(3);
  const $toast = useToast();

  console.log(route.params.id)
  
  const getReviewById = async () => {
    try {
      const { data } = await customeApi.get(`/content/${route.params.id}`);
      review.value = data.data;
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch review:', error);
    }
  };
  
  const submitReview = async () => {
    try {
      await customeApi.post(`/comment`, {
        content_id: route.params.id,
        comment_text: critic.value,
        rating: rating.value,
      },
    {
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
      },
    });
    $toast.success("Berhasil Melakukan Komentar!", {
        position: "top-right",
      });
      router.push({ name: 'Home' });
    } catch (error) {
      $toast.error("Gagal Melakukan Komentar!", {
        position: "top-right",
      });
    }
  };
  
  onMounted(() => {
    getReviewById();
  });
  </script>