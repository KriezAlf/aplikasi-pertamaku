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
  const response = await fetch(`http://4.237.59.7:3000/api/user/${userId.value}`);
  users.value = await response.json();
};

const changeEmail = async () => {
  const sanitizedNewEmail = DOMPurify.sanitize(newEmail.value);
if (!userId.value) {
  console.error("User ID is empty");
  return;
}


  await fetch(`http://4.237.59.7:3000/api/user/${userId.value}/change-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',     
      },
    body: JSON.stringify({ email: sanitizedNewEmail }), 
  });
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
