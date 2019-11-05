<template>
<div v-masonry transition-duration="0.3s" item-selector=".col" class="masonry-container row" id="gifs">
	<div v-masonry-tile v-for="gif in gifs" :key="gif.id" class="col s12 m6 l4 xl3 gif">
		<span class="gifContent">
			<div v-if="gif.gildings.gid_1!=undefined||gif.gildings.gid_2!=undefined||gif.gildings.gid_3!=undefined" class="gildings">
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
			<img v-on:click="$emit('setFramableUrlEmit', gif.framableLink)" :src="gif.preview" class="gifPreview"/>
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
#gifs {
}
.gif{
	margin-bottom:10px;
}
@media screen and (max-width: 993px) {
	.gif {
		font-size: 17px;
	}
}
@media screen and (min-width: 994px) {
	.gif {
		font-size: 21px;
	}
}
.gifContent{
	margin-top:10px;
	background-color:#2a2727;
	padding:10px;
	display:block;
	cursor:default;
	color:#dddddd;
	text-align:center;
	
}
.gifTitle{
	font-weight:bold;
	line-height:1em;
	text-align:left;
	color:#af5734;
	margin-bottom:3px;
	font-size:1.2em;
}

.gifPreview{
	width:100%;
	cursor:pointer;
}
.gifDescription{
	font-style:italic;
	text-align:left;
	line-height:1.15em;
	font-size:0.8em;
}
.gifData{
	text-align:right;
	font-size:0.8em;
}
.gildings{
	position:absolute;
	background:rgba(0,0,0,0.5);
	box-shadow: 0px 0px 2px 5px rgba(0,0,0,0.5);
	border-radius:20% 20% 20% 20%;
}
.gifDate{
	float:right;
	font-size:0.9em;
	color:#9e6f5a;
}
.gifAuthor{
	float:left;
	font-size:0.9em;
	color:#9e6f5a;
}
.gifKarma,.gifComments,.gifSilver,.gifGold,.gifPlatinum{
	display:inline-block;
	text-align:left;
	padding-right:10px;
	margin-top:5px;
	font-size:1em;
	line-height:1em;
	vertical-align:middle;
}
.gildings{
	/*box-shadow: inset 0px 0px 40px 40px #000000;*/
}
.dataValeur{
	vertical-align:middle;
}
.gifTitle:hover{
	color:#bf7e64
}
.gifKarma>i{
	color:#ff8b60;
}
.arrowKarma {
    background-image: url("https://www.redditstatic.com/sprite-reddit.e5NqNKsOkdA.png");
    background-position: -105px -1654px;
    background-repeat: no-repeat;
    margin: 2px 0px 0px 0px;
    width: 100%;
    height: 14px;
    display: inline-block;
    cursor: pointer;
    width: 15px;
    margin-left: auto;
    margin-right: auto;
    outline: none;
	vertical-align:middle;
	margin-right:5px;
}
.inlineIcon{
	display:inline;
	vertical-align:middle;
	height:1.3em;
	margin-right:3px;
}

</style>