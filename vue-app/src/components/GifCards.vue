<template>
  <div id="gif-cards" class="col s12 cards-container">
    <div class="col s12 m6 l4" v-for="gif in gifs" :key="gif.id">
      <div class="card">
        <div class="card-image">
          <img :src="gif.preview" />
        </div>
        <div class="card-content">
          <span class="card-title">{{gif.title}}</span>
          <p>
            <i class="material-icons" style="vertical-align: -6px;">arrow_upward</i>
            {{gif.karma}}
          </p>
          <p>
            <i class="material-icons" style="vertical-align: -6px;">calendar_today</i>
            {{gif.date | moment("MM-DD-YY")}}
          </p>
          {{gif.author}}
        </div>
        <div class="card-action">
          <a :href="gif.permalink">r/france</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "gif-cards",
  props: {
    gifs: Array
  }
};
</script>

<style scoped>
.cards-container {
  column-break-inside: avoid;
}
.cards-container .card {
  display: inline-block;
  overflow: visible;
}

@media only screen and (max-width: 600px) {
  .cards-container {
    -webkit-column-count: 1;
    -moz-column-count: 1;
    column-count: 1;
  }
}
@media only screen and (min-width: 601px) {
  .cards-container {
    -webkit-column-count: 2;
    -moz-column-count: 2;
    column-count: 2;
  }
}
@media only screen and (min-width: 993px) {
  .cards-container {
    -webkit-column-count: 3;
    -moz-column-count: 3;
    column-count: 3;
  }
}
.text-center {
  text-align: center;
}
</style>