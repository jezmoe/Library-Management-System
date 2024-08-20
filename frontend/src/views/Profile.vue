<script setup>
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import axios from 'axios'

const mainStore = useMainStore()
const { user } = storeToRefs(mainStore)

const periods = ['lastDay', 'lastWeek', 'lastMonth', 'lastYear'];
const selectedPeriod = ref(periods[0]);
const totalFines = ref(0);
const selectedRoleId = ref(null);

const pastLoansData = ref([]);
const selectedStartDate = ref(null);
const selectedEndDate = ref(null);

const roles = ref([]);
const customers = ref([]);
const selectedCustomerId = ref(null);
const includeBooks = ref(false);
const includeMedia = ref(false);
const includeDevices = ref(false);
const currentBooksData = ref([]);
const currentMediaData = ref([]);
const currentDevicesData = ref([]);

const apiUrl = `http://${import.meta.env.VITE_SERVER_URL}:3000/api/fines`;

const fetchFinesReport = async () => {
  try {
    const response = await axios.get(`${apiUrl}/reports/fines`, {
      params: {
        period: selectedPeriod.value,
        roleId: selectedRoleId.value,
      },
    });
    if (response.data.length > 0) {
      totalFines.value = response.data[0].total_fines;
    } else {
      totalFines.value = 0;
    }
  } catch (error) {
    console.error('Error fetching fines report:', error);
  }
};

const fetchPastLoansReport = async () => {
  try {
    const response = await axios.get(`${apiUrl}/reports/pastLoans`, {
      params: {
        startDate: selectedStartDate.value,
        endDate: selectedEndDate.value,
      },
    });
    pastLoansData.value = response.data;
  } catch (error) {
    console.error('Error fetching pastLoans report:', error);
  }
};


async function fetchCurrentBooks() {
  try {
    const booksResponse = await axios.get(`${apiUrl}/reports/currentbooks/${selectedCustomerId.value}`);
    currentBooksData.value = booksResponse.data;
  } catch (error) {
    console.error('Error fetching current books:', error);
  }
};

async function fetchCurrentMedia() {
  try {
    const mediaResponse = await axios.get(`${apiUrl}/reports/currentmedia/${selectedCustomerId.value}`);
    currentMediaData.value = mediaResponse.data;
  } catch (error) {
    console.error('Error fetching current media:', error);
  }
}

async function fetchCurrentDevices() {
  try {
    const devicesResponse = await axios.get(`${apiUrl}/reports/currentdevices/${selectedCustomerId.value}`);
    currentDevicesData.value = devicesResponse.data;
  } catch (error) {
    console.error('Error fetching current devices:', error);
  }
}

async function fetchCurrentLoansReport() {
  if (includeBooks.value) {
    await fetchCurrentBooks();
  }

  if (includeMedia.value) {
    await fetchCurrentMedia();
  }

  if (includeDevices.value) {
    await fetchCurrentDevices();
  }
}

const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/reports/customers`);
    customers.value = response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
};

const fetchRoles = async () => {
  try {
    const response = await axios.get(`${apiUrl}/reports/roles`);
    roles.value = response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
};

onMounted(() => {
  if (user.value.role_id === 3) {
    fetchFinesReport();
    fetchPastLoansReport();
    fetchCurrentLoansReport();
    fetchCurrentBooks();
    fetchCurrentMedia();
    fetchCurrentDevices();
    fetchCustomers();
    fetchRoles();
  }
});


const currentTab = ref('Book');


const condition_book = ref("")
const isbn = ref("")
const book_title = ref("")
const year_book = ref("")
const edition = ref("")
const genre = ref("")

const media_title = ref("")
const file_link = ref("")
const file_type = ref("")
const author = ref("")
const file_size = ref("")

const device_type = ref("")
const device_name = ref("")
const manufacturer = ref("")
const year_publish = ref("")
const serial_number = ref("")
const operating_system = ref("")
const maintenance_history = ref("")


const changeTab = (tab) => {
  currentTab.value = tab;
}

async function addItem() {
  const book = {
    userId: user.value.id,
    condition_book: condition_book.value,
    isbn: isbn.value,
    book_title: book_title.value,
    year_book: year_book.value,
    edition: edition.value,
    genre: genre.value
  }
  const media = {
    userId: user.value.id,
    media_title: media_title.value,
    file_link: file_link.value,
    file_type: file_type.value,
    author: author.value,
    file_size: file_size.value
  }

  const device = {
    userId: user.value.id,
    device_type: device_type.value,
    device_name: device_name.value,
    manufacturer: manufacturer.value,
    year_publish: year_publish.value,
    serial_number: serial_number.value,
    operating_system: operating_system.value,
    maintenance_history: maintenance_history.value
  }

  try {
    if (currentTab.value === 'Book') {
      await axios.post(`http://${import.meta.env.VITE_SERVER_URL}:3000/api/items/createBook`, book);
    } else if (currentTab.value === 'Media') {
      await axios.post(`http://${import.meta.env.VITE_SERVER_URL}:3000/api/items/createMedia`, media);
    } else if (currentTab.value === 'Device') {
      await axios.post(`http://${import.meta.env.VITE_SERVER_URL}:3000/api/items/createDevice`, device);
    }
    window.alert('Item added successfully');
  } catch (error) {
    window.alert('Error adding item. Please try again.');
  }
}
</script>


<template>
  <div class="user-profile-page">
    <div class="user-information">
      <h2 class="page-title">Your Information</h2>
      <div class="user-detail">
        <strong>First Name:</strong>
        <p>{{ user.first_name }}</p>
      </div>
      <div class="user-detail">
        <strong>Last Name:</strong>
        <p>{{ user.last_name }}</p>
      </div>
      <div class="user-detail">
        <strong>Registration Date:</strong>
        <p>{{ user.registration_date }}</p>
      </div>
      <div class="user-detail">
        <strong>Role:</strong>
        <p v-if="user.role_id === 1">Customer</p>
        <p v-else-if="user.role_id === 2">Faculty</p>
        <p v-else-if="user.role_id === 3">Admin</p>
        <p v-else-if="user.role_id === 4">Publisher</p>
      </div>
      <div class="user-detail">
        <strong>Max Allowed Items:</strong>
        <p v-if="user.role_id === 1">Books: 1, Media: 1, Devices: 1</p>
        <p v-else-if="user.role_id === 2">Books: 3, Media: 1, Devices: 1</p>
        <p v-else-if="user.role_id === 3">Books: 5, Media: 5, Devices: 5</p>
        <p v-else-if="user.role_id === 4">Books: 0, Media: 0, Devices: 0</p>
      </div>
    </div>


    <h2 v-if="user.role_id === 3">Admin Section</h2>
    <h3 v-if="user.role_id === 3">Fines Report</h3>

    <div v-if="user.role_id === 3" class="user-information report-section">
      <div class="user-detail">
        <strong>Select Period for Fines:</strong>
        <select v-model="selectedPeriod">
          <option v-for="period in periods" :key="period" :value="period">{{ period }}</option>
        </select>
      </div>

      <div class="user-detail">
        <strong>Select Role:</strong>
        <select v-model="selectedRoleId">
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.role_name }}
          </option>
        </select>
      </div>
      <button @click="fetchFinesReport">Run</button>
      <div class="user-detail">
        <strong>Total Fines Collected:</strong>
        <p> ${{ totalFines || "0" }}</p>
      </div>
    </div>

    <h3 v-if="user.role_id === 3">Loans Report</h3>
    <div v-if="user.role_id === 3" class="user-information report-section">
      <div class="user-detail">
        <strong>Select Period for Past Loans:</strong>
        <div>
          <label for="startDate">Start Date:</label>
          <input type="date" id="startDate" v-model="selectedStartDate">
        </div>
        <div>
          <label for="endDate">End Date:</label>
          <input type="date" id="endDate" v-model="selectedEndDate">
        </div>
        <button @click="fetchPastLoansReport">Run</button>
      </div>
      <div class="user-detail">
        <strong>Past Loans Information:</strong>
        <table class="loan-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Item Type</th>
              <th>Item Name</th>
              <th>Returned At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="loan in pastLoansData" :key="loan.id">
              <td>{{ loan.customer_name }}</td>
              <td>{{ loan.item_type }}</td>
              <td>{{ loan.item_name }}</td>
              <td>{{ loan.returned_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <h3 v-if="user.role_id === 3">Current Loans Report</h3>
    <div v-if="user.role_id === 3" class="user-information report-section">
      <div class="user-detail">
        <strong>Select Customer for Current Loans:</strong>
        <select v-model="selectedCustomerId">
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.customer_name }}
          </option>
        </select>
      </div>
      <div class="user-detail">
        <strong>Include in Report:</strong>
        <label>
          <input type="checkbox" v-model="includeBooks" /> Books
        </label>
        <label>
          <input type="checkbox" v-model="includeMedia" /> Media
        </label>
        <label>
          <input type="checkbox" v-model="includeDevices" /> Devices
        </label>
      </div>
      <button @click="fetchCurrentLoansReport">Run</button>
    </div>

    <div v-if="user.role_id === 3">
      <div v-if="includeBooks">
        <h3>Books</h3>
        <template v-if="currentBooksData.length !== 0">
          <table class="currentLoansBook-table">
            <th>Title</th>
            <th>ISBN</th>
            <th>Edition</th>
            <th>Loan Date</th>
            <th>Loan Until</th>
            <tr v-for="book in currentBooksData" :key="book.id">
              <td>{{ book.title }}</td>
              <td>{{ book.isbn }}</td>
              <td>{{ book.edition }}</td>
              <td>{{ book.loaned_at }}</td>
              <td>{{ book.loaned_until }}</td>
            </tr>
          </table>
        </template>
        <p v-else>This user has no books.</p>
      </div>

      <div v-if="includeMedia">
        <h3>Media</h3>
        <template v-if="currentMediaData.length !== 0">
          <table class="currentLoansMedia-table">
            <th>Title</th>
            <th>Author</th>
            <th>Media Link</th>
            <th>Loan Date</th>
            <th>Loan Until</th>
            <tr v-for="item in currentMediaData" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.author }}</td>
              <td>{{ item.file_link }}</td>
              <td>{{ item.loaned_at }}</td>
              <td>{{ item.loaned_until }}</td>
            </tr>
          </table>
        </template>
        <p v-else>This user has no media.</p>
      </div>

      <div v-if="includeDevices">
        <h3>Devices</h3>
        <template v-if="currentDevicesData.length !== 0">
          <table class="currentLoansDevice-table">
            <th>Name</th>
            <th>Type</th>
            <th>Serial Number</th>
            <th>Loan Date</th>
            <th>Loan Until</th>
            <tr v-for="device in currentDevicesData" :key="device.id">
              <td>{{ device.device_name }}</td>
              <td>{{ device.device_type }}</td>
              <td>{{ device.serial_number }}</td>
              <td>{{ device.loaned_at }}</td>
              <td>{{ device.loaned_until }}</td>
            </tr>
          </table>
        </template>
        <p v-else>This user has no devices.</p>
      </div>
    </div>

    <h2 v-if="user.role_id === 4">Publisher Section</h2>
    <div v-if="user.role_id === 4" class="user-information additem-page">
      <div class="tab-navigation">
        <button @click="changeTab('Book')">Book</button>
        <button @click="changeTab('Media')">Media</button>
        <button @click="changeTab('Device')">Device</button>
      </div>

      <form v-if="currentTab === 'Book'" class="tab-content">
        <label>Condition:</label>
        <input type="text" required v-model="condition_book" />

        <label>ISBN:</label>
        <input type="text" required v-model="isbn" />

        <label>Title:</label>
        <input type="text" required v-model="book_title" />

        <label>Year:</label>
        <input type="text" required v-model="year_book" />

        <label>Edition:</label>
        <input type="text" required v-model="edition" />

        <label>Genre:</label>
        <input type="text" required v-model="genre" />
      </form>

      <form v-if="currentTab === 'Media'" class="tab-content">
        <label>Title:</label>
        <input type="text" required v-model="media_title" />

        <label>File Link:</label>
        <input type="text" required v-model="file_link" />

        <label>File Type:</label>
        <input type="text" required v-model="file_type" />

        <label>Author:</label>
        <input type="text" required v-model="author" />

        <label>File Size:</label>
        <input type="text" required v-model="file_size" />
      </form>

      <form v-if="currentTab === 'Device'" class="tab-content">
        <label>Device Type:</label>
        <input type="text" required v-model="device_type" />

        <label>Device Name:</label>
        <input type="text" required v-model="device_name" />

        <label>Manufacturer:</label>
        <input type="text" required v-model="manufacturer" />

        <label>Year Publish:</label>
        <input type="date" required v-model="year_publish" />

        <label>Serial Number:</label>
        <input type="text" required v-model="serial_number" />

        <label>Operating System:</label>
        <input type="text" required v-model="operating_system" />

        <label>Maintenance History:</label>
        <input type="text" required v-model="maintenance_history" />
      </form>

      <button @click="addItem">Add</button>
    </div>

  </div>
</template>

<style scoped>
.user-profile-page {
  text-align: center;
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

.user-information {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.user-detail {
  margin: 10px 0;
  text-align: left;
}

.user-detail strong {
  font-weight: bold;
  margin-right: 5px;
  color: #007BFF;
}

.user-detail p {
  margin: 0;
}

.report-section {
  margin-top: 20px;
}

.report-section select {
  padding: 8px;
  font-size: 14px;
  margin-left: 10px;
}

.report-section p {
  font-weight: bold;
  color: #007BFF;
}

.additem-page {
  text-align: center;
  margin: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  border: solid
}

.tab-navigation {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.tab-navigation button {
  padding: 10px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.tab-navigation button:hover {
  background-color: #0056b3;
}

.tab-content {
  display: flex;
  flex-direction: column;
}

.tab-content form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
}

.tab-content label {
  margin-top: 10px;
  text-align: left;
}

.tab-content input,
.tab-content select {
  padding: 8px;
  font-size: 14px;
  margin-top: 5px;
}

.tab-content button {
  margin-top: 20px;
  padding: 12px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.tab-content button:hover {
  background-color: #0056b3;
}

.loan-table,
.currentLoansBook-table,
.currentLoansMedia-table,
.currentLoansDevice-table {

  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.loan-table th,
.loan-table td,
.currentLoansBook-table th,
.currentLoansBook-table td,
.currentLoansMedia-table th,
.currentLoansMedia-table td,
.currentLoansDevice-table th,
.currentLoansDevice-table td {
  background-color: white;
  border: 1px solid;
  padding: 8px;
  text-align: left;
}

.loan-table th,
.currentLoansBook-table th,
.currentLoansMedia-table th,
.currentLoansDevice-table th {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
  
