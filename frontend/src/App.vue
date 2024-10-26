<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';
import DOMPurify from 'dompurify';

const userId = ref('');
const users = ref(null);
const newEmail = ref('');

const sanitizedUserId = DOMPurify.sanitize(userId.value);
const sanitizedNewEmail = DOMPurify.sanitize(newEmail.value);

const getUser = async () => {
  try{
    if(!userId.value){
      console.error("User ID is empty");
      return;
  }
  const response = await fetch(`/api/user/${userId.value}`);
  if(!response.ok){
    throw new Error(`Failed to fetch user data: ${response.statusText}`);
  }
   users.value = await response.json();
   console.log("User data retrieved successfully");
   } catch (error){
     console.error("Error fetching user data:", error.message);
  }  
};

const changeEmail = async () => {
  const sanitizedNewEmail = DOMPurify.sanitize(newEmail.value);
  try {
    if (!userId.value) {
      console.error("User ID is empty");
      return;
    }
    if (!sanitizedNewEmail) {
      console.error("Email is empty");
      return;
    }

    const response = await fetch(`/api/user/${userId.value}/change-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: sanitizedNewEmail }),
    });

    if (!response.ok) {
      throw new Error(`Failed to change email: ${response.statusText}`);
    }
    console.log("Email changed successfully");
  } catch (error) {
    console.error("Error changing email:", error.message);
  }
};


</script>
<template>
  <div id="app">
    <h1>User Dashboard</h1>
    <div>
      <input v-model="userId" placeholder="Enter User ID" />
      <button @click="getUser">Get User Info</button>
    </div>
    <div v-if="users">
      <template v-for="user in users">
        <h2>{{ user.name }}</h2>
        <p>Email: {{ user.email }}</p>
        <hr />
      </template>
    </div>
    <CommentSection />
    <form @submit.prevent="changeEmail">
      <h3>Change Email</h3>
      <input v-model="newEmail" placeholder="New Email" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
