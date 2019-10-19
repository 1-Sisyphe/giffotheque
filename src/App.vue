<template>
  <div id="app" class="container">
    <h1>Giffothèque de France</h1>

    <gif-cards :gifs="gifs"/>
  </div>
</template>

<script>
 import GifCards from '@/components/GifCards.vue'
 import gifs from '@/assets/reddit_data.json'
export default {
  name: 'app',
  components: {
    GifCards,
  },
  data() {
    return {
      gifs: gifs
    }
  },
}
</script>

<style>
button {
  background: #009435;
  border: 1px solid #009435;
}

.small-container {
  max-width: 680px;
}
</style>
