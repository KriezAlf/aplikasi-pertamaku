<script setup>
import { ref } from 'vue';
import DOMPurify from 'dompurify';

const comment = ref('');
const comments = ref('');

const submitComment = () => {
  const safeComment = DOMPurify.sanitize(comment.value); // Sanitize the user input
  comments.value += `<p>${safeComment}</p>`;
  comment.value = ''; // Clear the input
};

</script>

<template>
 <div>
   <h3>Comments</h3>
   <input v-model="comment" placeholder="Leave a comment" />
   <button @click="submitComment">Submit</button>
   <div>
     <template v-for="commentText in commentsArray">
       <p>{{ commentText }}</p>
     </template>
   </div>
  </div>
</template>
