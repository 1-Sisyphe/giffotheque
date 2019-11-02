<template>
<div v-masonry transition-duration="0.3s" item-selector=".col" class="masonry-container row" id="gifs">
	<div v-masonry-tile class="col s12 m6 l4 xl3 gif" v-for="gif in gifs" :key="gif.id">
		<span class="gifContent">
			<div class="gildings">
				<div v-if="gif.gildings.gid_1!=undefined" class="gifSilver">
					<img class="inlineIcon" src="https://www.redditstatic.com/gold/awards/icon/silver_24.png"/>
					<span class="dataValeur">{{gif.gildings.gid_1}}</span>
				</div>
				<div v-if="gif.gildings.gid_2!=undefined" class="gifGold">
					<img class="inlineIcon" src="https://www.redditstatic.com/gold/awards/icon/gold_24.png"/>
					<span class="dataValeur">{{gif.gildings.gid_2}}</span>
				</div>
				<div v-if="gif.gildings.gid_3!=undefined" class="gifPlatinum">
					<img class="inlineIcon" src="https://www.redditstatic.com/gold/awards/icon/platinum_24.png"/>
					<span class="dataValeur">{{gif.gildings.gid_3}}</span>
				</div>
			</div>
			<img v-on:click.prevent="$emit('setFramableUrlEmit', gif.framableLink)" :src="gif.preview" class="gifPreview"/>
			<a target="_blank" :href="gif.permalink"><div class="gifTitle">{{gif.title}}</div></a>
			<div class="gifDate">{{gif.date | moment("MM-DD-YY")}}</div><div class="gifAuthor">u/{{gif.author}}</div><br>
			
			<div class="gifDescription">{{gif.description}}</div>
			<div class="gifData">
				<div class="gifKarma">
					<!--<i class="material-icons left">arrow_upward</i>--><div class="arrowKarma"></div><span class="dataValeur">{{gif.karma}}</span>
				</div>
				<div class="gifComments">
					<i class="material-icons left">comment</i><span class="dataValeur">{{gif.comments}}</span>
				</div>
			</div>
		</span>
	</div>
</div>
</template>

<script>
export default {
	name: "gif-cards",
	props: {
		gifs: Array
	},
};

</script>

<style scoped>
</style>