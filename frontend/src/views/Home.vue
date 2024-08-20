<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="welcome-page">
      <div class="header-section">
        <h1 class="main-header">Welcome to Our Cool Library!</h1>
        <section>
          <ul>
            <li>
              <router-link to="/library" class="big-button">Explore the Library</router-link>
            </li>
          </ul>
        </section>
      </div>
  
      <div class="info-section">
        <h4>Important Information:</h4>
        <ul>
          <li>The library will fine you if you do not return an item in 30 seconds.</li>
          <li>Check how many items you can take out in my profile.</li>
          <li>Paying fines is as simple as giving us your card number.</li>
          <li>Holding a book has no consequences; want it a bit later? Hold it!</li>
          <li>Admins have access to reports in their profile.</li>
          <li>Admins can edit and delete items.</li>
          <li>Publishers can create items in their profile.</li>
        </ul>
      </div>
    </div>
  </template>
  
  <style scoped>
  .welcome-page {
    text-align: center;
    padding: 20px;
    font-family: 'Poppins', sans-serif;
    background-image: url('https://i.pinimg.com/originals/3e/04/73/3e04731b9869cc1e1ea04d3ab72068fb.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    height: 100vh;
  }
  
  .header-section {
    background-color: rgba(255, 255, 255, 0.6);
    padding: 50px;
  }

.big-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    font-size: 18px;
    margin: 10px;
    transition: background-color 0.3s ease-in-out;
}

.big-button:hover {
    background-color: #0056b3;
}

.info-section {
    background-color: rgba(224, 224, 224, 0.6);
    padding: 20px;
}
  
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
  
.main-header {
    font-size: 2.8rem;
    font-family: 'Poppins', sans-serif;
    margin-bottom: 10px;
}
</style>
  
