import { customeApi } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const isLoading = ref(false);
  const isErr = ref(false);
  const errMsg = ref([]);
  const $toast = useToast();
  const userToken = ref(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );
  const userData = ref(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const loginUser = async (inputData) => {
    isLoading.value = true;
    try {
      const { email, password } = inputData;
      const { data } = await customeApi.post("/auth/login", {
        email,
        password,
      });
      const { token, user } = data.data;
      console.log(data)
      userToken.value = token;
      userData.value = user;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));
      isLoading.value = false;
      $toast.success("Berhasil Melakukan Login!", {
        position: "top-right",
      });
      router.push({ name: "Home" });
    } catch (error) {
      isLoading.value = false;
      isErr.value = true;
      if (error.response && error.response.errors) {
        errMsg.value = error.response.errors;
      } else {
        errMsg.value = { general: [error.response.message] };
      }
    }
  };

  const registerUser = async (inputData) => {
    isLoading.value = true;
    try {
      const { name, email, password, password_confirmation } = inputData;
      const { data } = await customeApi.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      const { token, user } = data.data;
      userData.value = user;
      userToken.value = token;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));
      isLoading.value = false;
      $toast.success("Berhasil Melakukan Register!", {
        position: "top-right",
      })
      router.push({ name: "Home" });
    } catch (error) {
      isLoading.value = false;
      isErr.value = true;
      if (error.response && error.response.data.errors) {
        errMsg.value = error.response.data.errors;
      } else {
        errMsg.value = { general: [error.response.data.message] };
      }
    }
  };

  const logoutUser = async () => {
    await customeApi.post("/auth/logout", null, {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    userToken.value = null;
    userData.value = null;
    $toast.success("Berhasil Melakukan Logout!", {
      position: "top-right",
    })
    router.push({ name: "Home" });
  };

  return {
    userToken,
    userData,
    isErr,
    errMsg,
    isLoading,
    loginUser,
    logoutUser,
    registerUser,
  };
});
