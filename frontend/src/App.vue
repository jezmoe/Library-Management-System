<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore()
const { isLoggedIn, user } = storeToRefs(mainStore)

function signOut() {
  isLoggedIn.value = false
  user.value = {}
}
</script>

<template>
  <div class="application">
    <header class="main-header">
      <nav class="main-header">
        <RouterLink class="navbutton" to="/">Home</RouterLink>
        <RouterLink class="navbutton" to="/library">Library</RouterLink>
        <RouterLink class="navbutton" to="/inventory">My Items</RouterLink>
        <RouterLink class="navbutton" to="/fines">My Fines</RouterLink>
        <RouterLink class="navbutton" to="/profile">My Profile</RouterLink>
        <RouterLink v-if="isLoggedIn === false" class="navbutton" to="/login">
          Login</RouterLink>
        <RouterLink v-else="isLoggedIn === true" class="navbutton" @click="signOut" to="/">Log Out</RouterLink>

      </nav>
    </header>
    <div class="content-container">
      <RouterView />
    </div>
  </div>
</template>
<style scoped>
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #77CBB9;
  padding: 15px 0;
  text-align: center;
  color: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  font-family: 'Poppins', sans-serif;
}

.content-container {
  margin-top: 55px;
}

.navbutton {
  text-decoration: none;
  padding: 10px 20px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease-in-out;
  margin: 0 10px;
}

.navbutton:hover {
  background-color: #0056b3;
}
</style>

<style>
body {
  font-family: sans-serif;
  padding: 0;
  margin: 0;
  background-color: #CDD3D5;
}
</style>
