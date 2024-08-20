<script setup>
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import axios from 'axios'

const mainStore = useMainStore()
const { user, isLoggedIn } = storeToRefs(mainStore)

const apiUrl = `http://${import.meta.env.VITE_SERVER_URL}:3000/api`;

const media = ref([]);
const books = ref([]);
const devices = ref([]);

const isEditingBook = ref(false)
const isEditingMedia = ref(false)
const isEditingDevice = ref(false)

const editBookId = ref(-1)
const editBookTitle = ref("")
const editBookISBN = ref("")
const editBookCondition = ref("")
const editBookEdition = ref("")
const editBookYear = ref("")

const editDeviceId = ref(-1)
const editDeviceName = ref("")
const editDeviceType = ref("")
const editDeviceHistory = ref("")
const editDeviceManufacturer = ref("")
const editDeviceOS = ref("")
const editDeviceSerial = ref("")

const editMediaId = ref(-1)
const editMediaAuthor = ref("")
const editMediaTitle = ref("")
const editMediaType = ref("")
const editMediaSize = ref("")

onMounted(async () => {
    try {
        getBooks()
        getDevices()
        getMedia()
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

async function getMedia() {
    const itemsResponse = await axios.get(`${apiUrl}/items/media`);
    media.value = itemsResponse.data;
}

async function getDevices() {
    const devicesResponse = await axios.get(`${apiUrl}/items/devices`);
    devices.value = devicesResponse.data;
}

async function getBooks() {
    const booksResponse = await axios.get(`${apiUrl}/items/books`);
    books.value = booksResponse.data;
}

async function loanBook(id) {
    const request = {
        userId: user.value.id,
        bookId: id
    }
    await axios.post(`${apiUrl}/items/loanBook`, request).catch(() => {
        alert("You are at your max limit of books.")
    })
    getBooks()
}

async function holdBook(id) {
    const request = {
        userId: user.value.id,
        bookId: id
    }
    await axios.post(`${apiUrl}/items/holdBook`, request)
    getBooks()
}

async function loanMedia(id) {
    const request = {
        userId: user.value.id,
        mediaId: id
    }
    await axios.post(`${apiUrl}/items/loanMedia`, request).catch(() => {
        alert("You are at your max limit of media.")
    })
    getMedia()
}

async function holdMedia(id) {
    const request = {
        userId: user.value.id,
        mediaId: id
    }
    await axios.post(`${apiUrl}/items/holdMedia`, request)
    getMedia()
}

async function loanDevice(id) {
    const request = {
        userId: user.value.id,
        deviceId: id
    }
    await axios.post(`${apiUrl}/items/loanDevice`, request).catch(() => {
        alert("You are at your max limit of devices.")
    })
    getDevices()
}

async function holdDevice(id) {
    const request = {
        userId: user.value.id,
        deviceId: id
    }
    await axios.post(`${apiUrl}/items/holdDevice`, request)
    getDevices()
}

async function deleteBook(id) {
    await axios.delete(`${apiUrl}/items/deleteBook/${id}`).catch(() => {
        alert("Cannot delete the book, it references other records and this would lose historical records.")
    })
    getBooks()
}

async function deleteDevice(id) {
    await axios.delete(`${apiUrl}/items/deleteDevice/${id}`).catch(() => {
        alert("Cannot delete the device, it references other records and this would lose historical records.")
    })
    getDevices()
}

async function deleteMedia(id) {
    await axios.delete(`${apiUrl}/items/deleteMedia/${id}`).catch(() => {
        alert("Cannot delete the media, it references other records and this would lose historical records.")
    })
    getMedia()
}

async function editBook(id) {
    const book = books.value.find(element => element.id == id)
    editBookId.value = id
    editBookTitle.value = book.title
    editBookISBN.value = book.isbn
    editBookCondition.value = book.condition
    editBookEdition.value = book.edition
    editBookYear.value = book.release_year
    isEditingBook.value = true
}

async function editMedia(id) {
    const mediaItem = media.value.find(element => element.id == id)
    editMediaId.value = id
    editMediaTitle.value = mediaItem.title
    editMediaAuthor.value = mediaItem.author
    editMediaType.value = mediaItem.file_type
    editMediaSize.value = mediaItem.file_size
    isEditingMedia.value = true
}

async function editDevice(id) {
    const device = devices.value.find(element => element.id == id)
    editDeviceId.value = id
    editDeviceName.value = device.device_name
    editDeviceType.value = device.device_type
    editDeviceHistory.value = device.maintenance_history
    editDeviceManufacturer.value = device.manufacturer
    editDeviceOS.value = device.operating_system
    editDeviceSerial.value = device.serial_number
    isEditingDevice.value = true
}

async function saveBook() {
    const request = {
        id: editBookId.value,
        title: editBookTitle.value,
        isbn: editBookISBN.value,
        condition: editBookCondition.value,
        edition: editBookEdition.value,
        year: editBookYear.value
    }
    await axios.post(`${apiUrl}/items/updateBook`, request)
    getBooks()
    isEditingBook.value = false
}

async function saveMedia() {
    const request = {
        id: editMediaId.value,
        title: editMediaTitle.value,
        author: editMediaAuthor.value,
        type: editMediaType.value,
        size: editMediaSize.value
    }
    await axios.post(`${apiUrl}/items/updateMedia`, request)
    getMedia()
    isEditingMedia.value = false
}

async function saveDevice() {
    const request = {
        id: editDeviceId.value,
        device_name: editDeviceName.value,
        device_type: editDeviceType.value,
        maintenance_history: editDeviceHistory.value,
        operating_system: editDeviceOS.value,
        serial_number: editDeviceSerial.value,
    }
    await axios.post(`${apiUrl}/items/updateDevice`, request)
    getDevices()
    isEditingDevice.value = false
}

async function confirmDeleteBook(id) {
    const isConfirmed = window.confirm("Are you sure you want to delete this Book?");
    if (isConfirmed) {
        await deleteBook(id);
    }
}

async function confirmDeleteDevice(id) {
    const isConfirmed = window.confirm("Are you sure you want to delete this Device?");
    if (isConfirmed) {
        await deleteDevice(id);
    }
}

async function confirmDeleteMedia(id) {
    const isConfirmed = window.confirm("Are you sure you want to delete this Media?");
    if (isConfirmed) {
        await deleteMedia(id);
    }
}

</script>
<template>
    <div class="inventory-page">
        <h2 class="page-title">Library Inventory</h2>

        <div class="inventory-section">
            <h3>Books</h3>
            <table v-if="books.length != 0 && isEditingBook == false" table class="inventory-table">
                <th>Title</th>
                <th>ISBN</th>
                <th>Condition</th>
                <th>Edition</th>
                <th>Release Year</th>
                <th>Actions</th>
                <tr v-for="book in books" :key="book.id">
                    <td>{{ book.title }}</td>
                    <td>{{ book.isbn }}</td>
                    <td> {{ book.condition }}</td>
                    <td> {{ book.edition }}</td>
                    <td> {{ book.release_year }}</td>
                    <td>
                        <button class="action-button return-button" @click="loanBook(book.id)"
                            :disabled="isLoggedIn === false">Loan</button>
                        <button class="action-button extend-button" @click="holdBook(book.id)"
                            :disabled="isLoggedIn === false">Hold</button>
                        <button v-if="user.role_id === 3" class="action-button delete-button"
                            @click="confirmDeleteBook(book.id)" :disabled="isLoggedIn === false">Delete</button>
                        <button v-if="user.role_id === 3" class="action-button edit-button"
                            @click="editBook(book.id)">Edit</button>
                    </td>
                </tr>
            </table>
            <div v-else-if="isEditingBook" class="auth-form">
                <form class="form" action="" @submit.prevent="saveBook">
                    <h1>Edit Book</h1>
                    <input type="text" placeholder="Book Title" v-model="editBookTitle" required="true" />
                    <input type="text" placeholder="Edition" v-model="editBookEdition" required="true" />
                    <input type="text" placeholder="Release Year" v-model="editBookYear" required="true" />
                    <input type="text" placeholder="Book Condition" v-model="editBookCondition" required="true" />
                    <input type="text" placeholder="ISBN" required="true" v-model="editBookISBN" />
                    <button class="action-button" type="submit">Save</button>
                </form>
            </div>
            <div v-else>
                <p>No books left!</p>
            </div>
        </div>

        <div class="inventory-section">
            <h3>Devices</h3>
            <table v-if="devices.length != 0 && isEditingDevice === false" class="inventory-table">
                <th>Name</th>
                <th>Type</th>
                <th>Maintenance History</th>
                <th>Manufacturer</th>
                <th>Operating System</th>
                <th>Serial Number</th>
                <th>Time Released</th>
                <th>Actions</th>
                <tr v-for="device in devices" :key="device.id">
                    <td>{{ device.device_name }}</td>
                    <td>{{ device.device_type }}</td>
                    <td> {{ device.maintenance_history }}</td>
                    <td> {{ device.manufacturer }}</td>
                    <td> {{ device.operating_system }}</td>
                    <td> {{ device.serial_number }}</td>
                    <td> {{ device.year_publish }}</td>
                    <td>
                        <button class="action-button return-button" @click="loanDevice(device.id)"
                            :disabled="isLoggedIn === false">Loan</button>
                        <button class="action-button extend-button" @click="holdDevice(device.id)"
                            :disabled="isLoggedIn === false">Hold</button>
                        <button v-if="user.role_id === 3" class="action-button delete-button"
                            @click="confirmDeleteDevice(device.id)" :disabled="isLoggedIn === false">Delete</button>
                        <button v-if="user.role_id === 3" class="action-button edit-button"
                            @click="editDevice(device.id)">Edit</button>
                    </td>
                </tr>
            </table>
            <div v-else-if="isEditingDevice" class="auth-form">
                <form class="form" action="" @submit.prevent="saveDevice">
                    <h1>Edit Device</h1>
                    <input type="text" placeholder="Device Name" required="true" v-model="editDeviceName" />
                    <input type="text" placeholder="Device Type" required="true" v-model="editDeviceType" />
                    <input type="text" placeholder="Maintenance History" required="true" v-model="editDeviceHistory" />
                    <input type="text" placeholder="Manufacturer" required="true" v-model="editDeviceManufacturer" />
                    <input type="text" placeholder="Operating System" required="true" v-model="editDeviceOS" />
                    <input type="text" placeholder="Serial Number" required="true" v-model="editDeviceSerial" />
                    <button class="action-button" type="submit">Save</button>
                </form>
            </div>
            <div v-else>
                <p>No devices left!</p>
            </div>
        </div>

        <div class="inventory-section">
            <h3>Media</h3>
            <table v-if="media.length != 0 && isEditingMedia === false" class="inventory-table">
                <th>Author</th>
                <th>Title</th>
                <th>Media Type</th>
                <th>Media Size</th>
                <th>Actions</th>
                <tr v-for="item in media" :key="item.id">
                    <td>{{ item.author }}</td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.file_type }}</td>
                    <td>{{ item.file_size }}</td>
                    <td>
                        <button class="action-button return-button" @click="loanMedia(item.id)"
                            :disabled="isLoggedIn === false">Loan</button>
                        <button class="action-button extend-button" @click="holdMedia(item.id)"
                            :disabled="isLoggedIn === false">Hold</button>
                        <button v-if="user.role_id === 3" class="action-button delete-button"
                            @click="confirmDeleteMedia(item.id)" :disabled="isLoggedIn === false">Delete</button>
                        <button v-if="user.role_id === 3" class="action-button edit-button"
                            @click="editMedia(item.id)">Edit</button>
                    </td>
                </tr>
            </table>
            <div v-else-if="isEditingMedia" class="auth-form">
                <form class="form" action="" @submit.prevent="saveMedia">
                    <h1>Edit Media</h1>
                    <input type="text" placeholder="Author Name" required="true" v-model="editMediaAuthor" />
                    <input type="text" placeholder="Media Title" required="true" v-model="editMediaTitle" />
                    <input type="text" placeholder="Media File Type" required="true" v-model="editMediaType" />
                    <input type="text" placeholder="Media File Size" required="true" v-model="editMediaSize" />
                    <button class="action-button" type="submit">Save</button>
                </form>
            </div>
            <div v-else>
                <p>No media left!</p>
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

.extend-button {
    margin-right: 5px;
}

.delete-button {
    margin-right: 5px;
}

.edit-button {
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
    background-color: #666;
}


.form {
    display: grid;
    gap: 15px;
    text-align: center;
}
</style>
  
