<script setup>
import axios from 'axios'
import router from '../router';
import { ref } from 'vue'
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore()
const { isLoggedIn, user } = storeToRefs(mainStore)

const firstName = ref("")
const lastName = ref("")
const password = ref("")
const isLoggingIn = ref(true)
const roleId = ref(1)

const city = ref("")
const companyName = ref("")


function setUserRole(event) {
    const roleChosen = event.target.value
    if (roleChosen === "publisher") roleId.value = 4
    if (roleChosen === "admin") roleId.value = 3
    if (roleChosen === "faculty") roleId.value = 2
    if (roleChosen === "customer") roleId.value = 1
}

async function login() {
    const customer = {
        firstName: firstName.value,
        lastName: lastName.value,
        password: password.value,
        city: city.value,
        companyName: companyName.value
    }

    axios.post(`http://${import.meta.env.VITE_SERVER_URL}:3000/api/customers/login`, customer)
        .then((response) => {
            user.value = response.data
            window.alert("Logged in successfully.")
            isLoggedIn.value = true
            router.push('/')
        })
        .catch((error) => {
            window.alert("Could not log in.")
        });
}

function signup() {
    const customer = {
        firstName: firstName.value,
        lastName: lastName.value,
        password: password.value,
        roleId: roleId.value
    }
    axios.post(`http://${import.meta.env.VITE_SERVER_URL}:3000/api/customers/create`, customer).then((response) => {
        window.alert("Created user successfully, please log in.")
    })
        .catch((error) => {
            window.alert("Could not create your user.")
        });
}
</script>

<template>
    <div class="auth-page">
        <div v-if="isLoggingIn" class="auth-form">
            <form class="form" action="" @submit.prevent="login">
                <h1>Login</h1>
                <input type="text" placeholder="First Name" required="true" v-model="firstName" />
                <input type="text" placeholder="Last Name" required="true" v-model="lastName" />
                <input type="password" placeholder="Password" required="true" v-model="password" />
                <button class="submit-button" type="submit">Login</button>
            </form>
            <button class="submit-button" @click="isLoggingIn = false">Create an account?</button>
        </div>

        <div v-else class="auth-form">
            <form class="form" action="" @submit.prevent="signup">
                <h1>Sign Up</h1>
                <input type="text" placeholder="First Name" required="true" v-model="firstName" />
                <input type="text" placeholder="Last Name" required="true" v-model="lastName" />
                <input type="password" placeholder="Password" required="true" v-model="password" />
                <input v-if="roleId === 4" type="text" placeholder="City Name" required="true" v-model="city" />
                <input v-if="roleId === 4" type="text" placeholder="Company Name" required="true" v-model="companyName" />
                <p>Please select your role. Be truthful. This really doesn't let you do much except see more fake generated
                    database data and take out more items.</p>
                <select required="true" @input="setUserRole">
                    <option value="customer">Customer</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                    <option value="publisher">Publisher</option>
                </select>
                <button class="submit-button" type="submit">Register</button>
            </form>
            <button class="submit-button" @click="isLoggingIn = true">Already have an account?</button>
        </div>
    </div>
</template>
  
<style scoped>
.auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    background-image: url('https://i.pinimg.com/originals/3e/04/73/3e04731b9869cc1e1ea04d3ab72068fb.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    height: 100vh;
}

.auth-form {
    width: 320px;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.form {
    display: grid;
    gap: 15px;
    text-align: center;
}

input[type="text"],
input[type="password"] {
    text-align: center;
    width: 100%;
    padding: 10px 0px 10px 0px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 12px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
}

button:hover {
    background-color: #0056b3;
}

.submit-button {
    margin-top: 10px;
}
</style>
  
