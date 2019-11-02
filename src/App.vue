<template>
<div id="app">
	<div class="container-fluid" id="containerBanniere">
		<img id="banniere" src="./assets/titre.png" />
		<div id="slogan">Peut-être la toute première giffothèque de France au monde</div>
	</div>
	<div class="container">
		<a id="menuBtn" href="#" data-activates="slide-out" class="btn-large button-collapse hoverable"><i class="material-icons left">menu</i>Filtrer</a><br>
		<a id="triDate" href="#" class="btn hoverable btnTri" v-on:click="sortBy('date')" v-bind:class="{ disabled: currentCriteria!='date' }">
			<i class="material-icons right">{{iconSortBy('date')}}</i>Date
		</a>
		<a id="triKarma" href="#" class="btn hoverable btnTri" v-on:click="sortBy('karma')" v-bind:class="{ disabled: currentCriteria!='karma' }">
			<i class="material-icons right">{{iconSortBy('karma')}}</i>Karma
		</a>
		<!--<div id="wrapTri">
			<a id="triComments" href="#" class="btn hoverable btnTri" v-on:click="sortBy('comments')" v-bind:class="{ disabled: currentCriteria!='comments' }">
				<i class="material-icons right">{{iconSortBy('comments')}}</i>Commentaires
			</a>
		</div>-->
	</div>
	<div id="slide-out" class="side-nav">
		<hr>
		<i v-on:click="clearTags('tags')" v-if="selectedTags.length!=0" class="material-icons right clearTags">clear</i><br>
		<h3 class="categoryTags">Thèmes</h3>
		<div id="wrapTags">
			<div class="col s12 m6 l4 tag"  v-for="(nb,tag) in tags" :key="tag" v-on:click="selectTag(tag)" v-bind:class="{ tagActif: tagIsSelected(tag) }">
				{{tag}} ({{nb}})
			</div>
		</div>
		<hr>
		
		<i v-on:click="clearTags('authors')" v-if="selectedAuthors.length!=0" class="material-icons right clearTags">clear</i><br>
		<h3 class="categoryTags">Auteurs </h3>
		<div id="wrapAuteurs">
			<div class="col s12 m6 l4 tag"  v-for="(nb,author) in authors" :key="author" v-on:click="selectAuthor(author)" v-bind:class="{ tagActif: authorIsSelected(author) }">
				{{author}} ({{nb}})
			</div>
		</div>
		<hr><br>
	</div>
	<div class="container">
		<gif-cards :gifs="displayedList" v-on:setFramableUrlEmit="setFramableUrl($event)"/>
	</div>
	<div id="wrapFramable" v-on:click="framableVisible=false" v-if="framableVisible">
		<div id="wrapCloseFramable">
			<i class="material-icons right clearTags" id="closeFramable">clear</i>
		</div>
		<embed v-bind:src="currentFramableLink" id="framableObj">
	</div>
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
			gifs: gifs,
            sortDirection:{
                "karma":1,
                "date":1,
                "comments":1
            },
            currentCriteria:"date",
			authors : {},
			tags:{},
			selectedTags:[],
			selectedAuthors:[],
			currentFramableLink:"",
			framableVisible : false
		}
	}, 
	computed: {
		displayedList: function () {
			var filteredGifs = this.gifs.slice()
			var authors = this.selectedAuthors
			if(authors.length!=0){
				filteredGifs = filteredGifs.filter(function(a){
					return authors.indexOf(a['author'])!=-1
				})
			}
			var tags = this.selectedTags
			if(tags.length!=0){
				filteredGifs = filteredGifs.filter(function(a){
					for(var i = 0;i<tags.length;i++){
						if(a['tags'].indexOf(tags[i])!=-1) return true
					}
				})
			}
			return filteredGifs
		}
	},
	methods: {
        sortBy: function (criteria) {
            if(criteria==this.currentCriteria)this.sortDirection[criteria] = -this.sortDirection[criteria]
            this.currentCriteria = criteria
            var direction = this.sortDirection[this.currentCriteria]
            this.gifs = this.gifs.sort(function(a, b) {
                return direction*(b[criteria] - a[criteria]);
            })
			this.$nextTick(() => this.$redrawVueMasonry());
		},
		selectAuthor:function(aut){
			if(this.selectedAuthors.indexOf(aut)==-1){
				this.selectedAuthors.push(aut)
			}else{
				this.selectedAuthors.splice(this.selectedAuthors.indexOf(aut),1)
			}
			this.$nextTick(() => this.$redrawVueMasonry());
		},
		selectTag:function(tag){
			if(this.selectedTags.indexOf(tag)==-1){
				this.selectedTags.push(tag)
			}else{
				this.selectedTags.splice(this.selectedTags.indexOf(tag),1)
			}
			this.$nextTick(() => this.$redrawVueMasonry());
		},
		tagIsSelected(tag){
			return this.selectedTags.indexOf(tag)!=-1
		},
		authorIsSelected(aut){
			return this.selectedAuthors.indexOf(aut)!=-1
		},
		iconSortBy(btn){
			if(btn!=this.currentCriteria){
				return ""
			}else{
				return (this.sortDirection[btn]==1 ? "expand_more" : "expand_less")
			}
		},
		clearTags(type){
			if(type=="tags")this.selectedTags = []
			if(type=="authors")this.selectedAuthors = []
		},
		setFramableUrl(url){
			if(url!==""&&url!==undefined){
				this.currentFramableLink = url
				this.framableVisible = true
			}
		}
    },
	beforeMount() {
		for(var i=0; i<this.gifs.length; i++){
			if(this.gifs[i]['customThumbnail']!==undefined){
				if(this.gifs[i]['customThumbnail']!=""){
					this.gifs[i]['preview'] = this.gifs[i]['customThumbnail']
				}
			}
			if(this.gifs[i]['customFramableLink']!==undefined){
				if(this.gifs[i]['customFramableLink']!=""){
					this.gifs[i]['framableLink'] = this.gifs[i]['customFramableLink']
				}
			}
			if(this.gifs[i]['gildings']===undefined){
				this.gifs[i]['gildings'] = {}
			}
			if(this.authors[this.gifs[i]['author']]===undefined){
				this.authors[this.gifs[i]['author']] = 1
			}else{
				this.authors[this.gifs[i]['author']]++
			}
			if(this.gifs[i]['tags']==undefined)this.gifs[i]['tags'] = []
			for(var j=0;j<this.gifs[i]['tags'].length;j++){
				if(this.tags[this.gifs[i]['tags'][j]]===undefined){
					this.tags[this.gifs[i]['tags'][j]] = 1
				}else{
					this.tags[this.gifs[i]['tags'][j]]++
				}
			}
		}
		/*this.tags.sort(function(a,b){
            return b.lastModifiedOn - a.lastModifiedOn
        })*/
	},
	mounted: function(){
		this.sortDirection[this.currentCriteria]=-1
		this.sortBy(this.currentCriteria)
	},
}

</script>
<style>

div {
  /* linearly increase the font-size from 16->32px 
     between a viewport width of 600px-> 1200px  */
  @include fluid-type(font-size, 600px, 1200px, 16px, 32px);
}
@media screen and (max-width: 993px) {
  body {
     font-size: 18px;
  }
}
@media screen and (min-width: 1200px) {
  body {
     font-size: 16px;
  }
}
body{
	background:rgb(0, 0, 0);
	color:#ddd;
	font-family: 'Barlow Condensed', sans-serif;
}
#wrapFramable{
	position:fixed;
	bottom:0px;
	width:100%;
	background:#101010;
	padding-top:20px;
	cursor:pointer;
	vertical-align:middle;
}
#closeFramable{
	margin-right: 15px;
	margin-top: 15px;
	color:#dc5116;
}
#wrapCloseFramable{
	height: 59px;
	margin-top: -20px;
	background-color:#040404;
}
#wrapCloseFramable:hover{
	background-color:#070707;
}
#wrapCloseFramable:hover>#closeFramable{
	color:#bf7e64;
}
#framableObj{
	width:100%;
	height:45vh;
}
#containerBanniere{
	position:relative;
	text-align:center;
	background-image:url(./assets/banniere.png);
	background-size:100% auto;
	background-position:center;
}
#banniere{
	max-width:60%;
}
#slogan{
	color:white;
	position:absolute;
	bottom:-2px;
	right:2px;
	font-style:italic;
}
#slide-out{
	color:black;
	text-align:center;
	background:#111;
	color:#eee;
	padding:30px;
	width:30vw;
	min-width:500px;
	
}
.categoryTags{
	color:#dc5116;
	margin:5px;
	margin-bottom:15px;
}
.clearTags{
	color:#dc5116;
	cursor:pointer;
	margin-left:10px;
}
.clearTags:hover{
	color:#ba3c07;
}
.tag{
	display:inline-block;
	margin:2px 5px;
	border-radius:4px;
	cursor:pointer;
	padding:5px 10px;
	font-size:1.2em;
	background:#222;
	border:solid grey 2px;
	color:#dddddd;
}
.tagActif{
	border:solid grey 2px;
	background:#ba3c07;
}
.btn.disabled{
	cursor:pointer;
}
.btnTri{
	background:#ba3c07;
}
.btnTri:hover{
	background:#dc5116
}
#menuBtn{
	vertical-align:middle;
	background-color:#ba3c07;
	float:right;
}
#menuBtn:hover{
	background-color:#dc5116;
}
.selectableList{
	text-align:center;
}
#wrapTags,#wrapAuteurs,#wrapTrier{
	text-align:center;
	margin-bottom:30px;
}
#gifs {
}
.gif{
	margin-bottom:10px;
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
	font-size:1.5em;
	font-weight:bold;
	line-height:1.15em;
	text-align:left;
	color:#af5734;
	margin-bottom:3px
}
.gifPreview{
	width:100%;
	cursor:pointer;
}
.gifDescription{
	font-style:italic;
	text-align:left;
	font-size:1.1em;
	line-height:1.15em;
}
.gifData{
	text-align:right;
}
.gildings{
	position:absolute;
	background:rgba(0,0,0,0.3);
	box-shadow: 0px 0px 2px 5px rgba(0,0,0,0.3);
	border-radius:50% 20% / 10% 40%;
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
i.left{
	margin-right:5px;
	font-size:1.2em;
}
#wrapTri{
	text-align:right;
}
.inlineIcon{
	display:inline;
	vertical-align:middle;
	height:1.3em;
	margin-right:3px;
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

</style>