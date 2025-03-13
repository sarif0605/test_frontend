import PublicLayouts from '@/layouts/PublicLayouts.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import CategoryByIdView from '@/views/CategoryByIdView.vue'
import CategoryView from '@/views/CategoryView.vue'
import CommentView from '@/views/CommentView.vue'
import ContentByIdView from '@/views/ContentByIdView.vue'
import ContentView from '@/views/ContentView.vue'
import FavoriteView from '@/views/FavoriteView.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component : PublicLayouts,
      children: [
        {
          path: '/',
          name: 'Home',
          component : HomeView
        },
        {
          path: '/content',
          name: 'Content',
          component: ContentView
        },
        {
          path: '/content/:id',
          name: 'ContentId',
          component: ContentByIdView
        },
        {
          path: '/category/:id',
          name: 'CategoryId',
          component: CategoryByIdView
        },
        {
          path: '/category',
          name: 'Category',
          component: CategoryView
        },
        {
          path: '/favorite',
          name: 'Favorite',
          component: FavoriteView
        },
        {
          path: '/comment/:id',
          name: 'Comment',
          component: CommentView
        }
      ],
    },
    {
      path : "/login",
      name : "Login",
      component: LoginView
    },
    {
      path: '/register',
      name : 'Register',
      component: RegisterView
    }
  ],
})

export default router
