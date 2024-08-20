<script setup>
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import axios from 'axios'

const mainStore = useMainStore()
const { user } = storeToRefs(mainStore)

const apiUrl = `http://${import.meta.env.VITE_SERVER_URL}:3000/api`;

const loanedMedia = ref([]);
const loanedBooks = ref([]);
const loanedDevices = ref([]);

const heldDevices = ref([]);
const heldBooks = ref([]);
const heldMedia = ref([]);

onMounted(async () => {
  try {
    getLoanedBooks()
    getLoanedMedia()
    getLoanedDevices()
    getHeldBooks()
    getHeldMedia()
    getHeldDevices()
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

async function getLoanedMedia() {
  const mediaResponse = await axios.get(`${apiUrl}/items/loanedMedia/${user.value.id}`);
  loanedMedia.value = mediaResponse.data;
}

async function getLoanedBooks() {
  const booksResponse = await axios.get(`${apiUrl}/items/loanedBooks/${user.value.id}`);
  loanedBooks.value = booksResponse.data;
}

async function getLoanedDevices() {
  const devicesResponse = await axios.get(`${apiUrl}/items/loanedDevices/${user.value.id}`);
  loanedDevices.value = devicesResponse.data;
}

async function getHeldMedia() {
  const mediaResponse = await axios.get(`${apiUrl}/items/heldMedia/${user.value.id}`)
  heldMedia.value = mediaResponse.data
}

async function getHeldBooks() {
  const bookResponse = await axios.get(`${apiUrl}/items/heldBooks/${user.value.id}`)
  heldBooks.value = bookResponse.data
}

async function getHeldDevices() {
  const devicesResponse = await axios.get(`${apiUrl}/items/heldDevices/${user.value.id}`)
  heldDevices.value = devicesResponse.data
}

async function returnBook(id) {
  const body = {
    userId: user.value.id,
    bookId: id
  }
  await axios.post(`${apiUrl}/items/returnBook`, body)
  getLoanedBooks()
}

async function returnMedia(id) {
  const body = {
    userId: user.value.id,
    mediaId: id
  }
  await axios.post(`${apiUrl}/items/returnMedia`, body)
  getLoanedMedia()
}

async function returnDevice(id) {
  const body = {
    userId: user.value.id,
    deviceId: id
  }
  await axios.post(`${apiUrl}/items/returnDevice`, body)
  getLoanedDevices()
}

async function extendBook(id) {
  const body = {
    userId: user.value.id,
    bookId: id
  }
  await axios.post(`${apiUrl}/items/extendBook`, body)
  getLoanedBooks()
}

async function extendDevice(id) {
  const body = {
    userId: user.value.id,
    deviceId: id
  }
  await axios.post(`${apiUrl}/items/extendDevice`, body)
  getLoanedDevices()
}

async function extendMedia(id) {
  const body = {
    userId: user.value.id,
    mediaId: id
  }
  await axios.post(`${apiUrl}/items/extendMedia`, body)
  getLoanedMedia()
}

async function loanBook(id) {
  const body = {
    userId: user.value.id,
    bookId: id
  }
  await axios.post(`${apiUrl}/items/loanBook`, body).catch(() => {
    alert("You are at your max limit of books.")
  })
  heldBooks.value = []
  getLoanedBooks()
  getHeldBooks()
}

async function loanMedia(id) {
  const body = {
    userId: user.value.id,
    mediaId: id
  }
  await axios.post(`${apiUrl}/items/loanMedia`, body).catch(() => {
    alert("You are at your max limit of books.")
  })
  heldMedia.value = []
  getLoanedMedia()
  getHeldMedia()
}

async function loanDevice(id) {
  const body = {
    userId: user.value.id,
    deviceId: id
  }
  await axios.post(`${apiUrl}/items/loanDevice`, body).catch(() => {
    alert("You are at your max limit of books.")
  })
  heldDevices.value = []
  getLoanedDevices()
  getHeldMedia()
}
</script>

<template>
  <div class="inventory-page">
    <h2 class="page-title">Loaned Items</h2>

    <div class="inventory-section">
      <h3>Books</h3>
      <table v-if="loanedBooks.length != 0" table class="inventory-table">
        <th>Title</th>
        <th>ISBN</th>
        <th>Edition</th>
        <th>Loan Date</th>
        <th>Loan Until</th>
        <th>Returned Date</th>
        <th>Actions</th>
        <tr v-for="book in loanedBooks" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.isbn }}</td>
          <td> {{ book.edition }}</td>
          <td> {{ book.loaned_at }}</td>
          <td> {{ book.loaned_until }}</td>
          <td> {{ book.returned_at }}</td>
          <td>
            <button class="action-button return-button" @click="returnBook(book.book_id)"
              :disabled="book.returned_at !== null">Return</button>
            <button class="action-button extend-button" @click="extendBook(book.book_id)"
              :disabled="book.returned_at !== null">Extend</button>
          </td>
        </tr>
      </table>
      <div v-else>
        <p>You do not have any books to check out.</p>
      </div>
    </div>

    <div class="inventory-section">
      <h3>Devices</h3>
      <table v-if="loanedDevices.length != 0" class="inventory-table">
        <th>Name</th>
        <th>Type</th>
        <th>Serial Number</th>
        <th>Loan Date</th>
        <th>Loan Until</th>
        <th>Returned Date</th>
        <th>Actions</th>
        <tr v-for="device in loanedDevices" :key="device.id">
          <td>{{ device.device_name }}</td>
          <td>{{ device.device_type }}</td>
          <td> {{ device.serial_number }}</td>
          <td> {{ device.loaned_at }}</td>
          <td> {{ device.loaned_until }}</td>
          <td> {{ device.returned_at }}</td>
          <td>
            <button class="action-button return-button" @click="returnDevice(device.device_id)"
              :disabled="device.returned_at !== null">Return</button>
            <button class="action-button extend-button" @click="extendDevice(device.device_id)"
              :disabled="device.returned_at !== null">Extend</button>
          </td>
        </tr>
      </table>

      <div v-else>
        <p>You do not have any devices to check out.</p>
      </div>
    </div>

    <div class="inventory-section">
      <h3>Media</h3>
      <table v-if="loanedMedia.length != 0" class="inventory-table">
        <th>Title</th>
        <th>Author</th>
        <th>Media Link</th>
        <th>Loan Date</th>
        <th>Loan Until</th>
        <th>Returned Date</th>
        <th>Actions</th>
        <tr v-for="item in loanedMedia" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.author }}</td>
          <td>{{ item.file_link }}</td>
          <td>{{ item.loaned_at }}</td>
          <td>{{ item.loaned_until }}</td>
          <td>{{ item.returned_at }}</td>
          <td>
            <button class="action-button return-button" @click="returnMedia(item.media_id)"
              :disabled="item.returned_at !== null">Return</button>
            <button class="action-button extend-button" @click="extendMedia(item.media_id)"
              :disabled="item.returned_at !== null">Extend</button>
          </td>
        </tr>
      </table>

      <div v-else>
        <p>You do not have any media to check out.</p>
      </div>
    </div>

    <h2 class="page-title">Held Items</h2>
    <div class="inventory-section">
      <h3>Books</h3>
      <table v-if="heldBooks.length != 0" table class="inventory-table">
        <th>Title</th>
        <th>ISBN</th>
        <th>Edition</th>
        <th>Hold Date</th>
        <th>Held Until</th>
        <th>Actions</th>
        <tr v-for="book in heldBooks" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.isbn }}</td>
          <td> {{ book.edition }}</td>
          <td> {{ book.held_at }}</td>
          <td> {{ book.held_until }}</td>
          <td>
            <button class="action-button return-button" @click="loanBook(book.book_id)">Loan</button>
          </td>
        </tr>
      </table>
      <div v-else>
        <p>You do not have any held books to loan.</p>
      </div>
    </div>

    <div class="inventory-section">
      <h3>Devices</h3>
      <table v-if="heldDevices.length != 0" class="inventory-table">
        <th>Name</th>
        <th>Type</th>
        <th>Serial Number</th>
        <th>Hold Date</th>
        <th>Held Until</th>
        <th>Actions</th>
        <tr v-for="device in heldDevices" :key="device.id">
          <td>{{ device.device_name }}</td>
          <td>{{ device.device_type }}</td>
          <td> {{ device.serial_number }}</td>
          <td> {{ device.held_at }}</td>
          <td> {{ device.held_until }}</td>
          <td>
            <button class="action-button return-button" @click="loanDevice(device.device_id)">Loan</button>
          </td>
        </tr>
      </table>

      <div v-else>
        <p>You do not have any held devices to loan.</p>
      </div>
    </div>

    <div class="inventory-section">
      <h3>Media</h3>
      <table v-if="heldMedia.length != 0" class="inventory-table">
        <th>Title</th>
        <th>Author</th>
        <th>Media Link</th>
        <th>Hold Date</th>
        <th>Held Until</th>
        <th>Actions</th>
        <tr v-for="item in heldMedia" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.author }}</td>
          <td>{{ item.file_link }}</td>
          <td>{{ item.held_at }}</td>
          <td>{{ item.held_until }}</td>
          <td>
            <button class="action-button return-button" @click="loanMedia(item.media_id)">Loan</button>
          </td>
        </tr>
      </table>

      <div v-else>
        <p>You do not have any held media to loan.</p>
      </div>
    </div>
  </div>
</template>
  
<style scoped>
.inventory-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  background-image: url('https://i.pinimg.com/originals/3e/04/73/3e04731b9869cc1e1ea04d3ab72068fb.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100vh;
}

.page-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.inventory-section {
  width: 80%;
  margin-bottom: 20px;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.action-button {
  background-color: #007BFF;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.return-button {
  margin-right: 5px;
}

.action-button:hover {
  background-color: #0056b3;
}

table,
th,
td {
  border: 1px solid;
}

table {
  background-color: rgba(255, 255, 255, 0.9);
}

button:disabled {
  background-color: gray;
}
</style>
  
