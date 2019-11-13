<template>
<div id="app">
	<div id="toTop" v-if="scrolling" v-on:click="toTop()"><i class="material-icons left">arrow_upward</i></div>
	<div class="container-fluid" id="containerBanniere">
		<img id="banniere" src="./assets/titre.png" />
		<div id="slogan">Peut-être la toute première giffothèque de France au monde</div>
	</div>
	<div class="container" id="containerBoutons">
		<a id="menuBtn" href="#" @click="menu=!menu" class="btn-large button-collapse hoverable btnTri"><i class="material-icons left">menu</i>Filtrer</a>
		<a id="triDate" href="#" class="btn-large hoverable btnTri" v-on:click="sortList('date',true)" v-bind:class="{ disabled: currentCriteria!='date' }">
			<i class="material-icons right">{{iconSortBy('date')}}</i>Date
		</a>
		<a id="triKarma" href="#" class="btn-large hoverable btnTri" v-on:click="sortList('karma',true)" v-bind:class="{ disabled: currentCriteria!='karma' }">
			<i class="material-icons right">{{iconSortBy('karma')}}</i>Karma
		</a>
	</div>
	<vs-sidebar parent="body" position-right default-index="1" color="primary" class="sidebarx" spacer v-model="menu">
		<div id="wrapSideBar">
			<span id="nbGifsSelected">{{textNbGifs()}}</span>
			<hr>
			<span v-for="filterCategory in filterCategories" :key="filterCategory.id">
				<i v-on:click="clearFilters(filterCategory.id)" v-show="filterCategory.selectedList.length!=0" class="material-icons right clearFilters">clear</i><br>
				<h3 class="categoryFilters">{{filterCategory.name}}</h3>
				<div class="wrapFilters">
					<div class="filter" v-for="(nb,filter) in filterCategory.list" :key="filter" v-on:click="selectFilter(filterCategory.selectedList,filter)" v-bind:class="{ filterActif: filterCategory.selectedList.indexOf(filter)!=-1 }">
						{{filter}} <span class="nbGifFilter">({{nb}})</span>
					</div>
				</div>
				<hr>
			</span>
			<br>
		</div>
	</vs-sidebar>
	<div class="container">
		<gif-cards :gifs="displayedGifs" v-on:setFramableUrlEmit="setFramableUrl($event)"/>
	</div>
	<div id="wrapFramable" v-on:click="framableVisible=false" v-if="framableVisible">
		<div id="wrapCloseFramable">
			<i class="material-icons right clearFilters" id="closeFramable">clear</i>
		</div>
		<embed v-bind:src="currentFramableLink" id="framableObj">
	</div>
	<div class="loader" v-if="loading"></div>
</div>
</template>

<script>
import GifCards from '@/components/GifCards.vue'
import axios from "axios";

export default {
	name: 'app',
	components: {
		GifCards,
	},
	data() {
		return {
			gifs: [],
			gifsToDisplay : [],
			displayedGifs : [],
			gifsChunkLength : 16,
			currentPage : 1,
			sortDirection:{
				"karma":1,
				"date":1,
				"comments":1
			},
			currentCriteria:"date",
			authors : {},
			selectedAuthors:[],
			tags:{},
			selectedTags:[],
			themes:{},
			selectedThemes:[],
			sources:{},
			selectedSources:[],
			currentFramableLink:"",
			framableVisible : false,
			loading:true,
			scrolling:false,
			menu:false
		}
	}, 
	computed: {
		filterCategories(){
			return [
				{"selectedList":this.selectedThemes,"list":this.themes,"name":"Thèmes",id:"themes"},
				{"selectedList":this.selectedSources,"list":this.sources,"name":"Source",id:"sources"},
				//{"selectedList":this.selectedTags,"list":this.tags,"name":"Mots-clés",id:"tags"},
				{"selectedList":this.selectedAuthors,"list":this.authors,"name":"Auteurs",id:"authors"}
			]
		}
	},
	methods: {
		sortList: function (criteria,swapOrder) {
			if(criteria==this.currentCriteria&&swapOrder)this.sortDirection[criteria] = -this.sortDirection[criteria]
			this.currentCriteria = criteria
			var direction = this.sortDirection[this.currentCriteria]
			this.gifsToDisplay = this.gifsToDisplay.sort(function(a, b) {
				return direction*(b[criteria] - a[criteria]);
			})
			this.currentPage = 1
			this.displayedGifs = []
			var firstIndex = Math.min(this.gifsToDisplay.length,this.gifsChunkLength)
			for(var i=0;i<firstIndex;i++){
				this.displayedGifs.push(this.gifsToDisplay[i])
			}
			this.$nextTick(() => this.$redrawVueMasonry());
		},
		filterList: function () {
			var filteredGifs = this.gifs.slice()
			var authors = this.selectedAuthors
			var tags = this.selectedTags
			var themes = this.selectedThemes
			var sources = this.selectedSources
			filteredGifs = filteredGifs.filter(function(a){
				var authorMatch = authors.indexOf(a['author'])!=-1||authors.length==0
				var tagMatch = tags.length==0
				for(var itag = 0;itag<tags.length;itag++){
					tagMatch = tagMatch||a['tags'].indexOf(tags[itag])!=-1
				}
				var themeMatch = themes.length==0
				for(var itheme = 0;itheme<themes.length;itheme++){
					themeMatch = themeMatch||a['themes'].indexOf(themes[itheme])!=-1
				}
				var sourceMatch = sources.length==0
				for(var isource = 0;isource<sources.length;isource++){
					sourceMatch = sourceMatch||a['sources'].indexOf(sources[isource])!=-1
				}
				return authorMatch&&tagMatch&&themeMatch&&sourceMatch
			})
			this.gifsToDisplay = filteredGifs
			this.currentPage = 1
			this.displayedGifs = []
			var firstIndex = Math.min(this.gifsToDisplay.length,this.gifsChunkLength)
			for(var i=0;i<firstIndex;i++){
				this.displayedGifs.push(this.gifsToDisplay[i])
			}
			this.sortList(this.currentCriteria,false)
		},
		selectFilter:function(list,value){
			if(list.indexOf(value)==-1){
				list.push(value)
			}else{
				list.splice(list.indexOf(value),1)
			}
			this.filterList()
		},
		clearFilters(type){
			if(type=="tags")this.selectedTags = []
			if(type=="themes")this.selectedThemes = []
			if(type=="sources")this.selectedSources = []
			if(type=="authors")this.selectedAuthors = []
			this.filterList()
		},
		iconSortBy(btn){
			if(btn!=this.currentCriteria){
				return ""
			}else{
				return (this.sortDirection[btn]==1 ? "expand_more" : "expand_less")
			}
		},
		setFramableUrl(url){
			if(url!==""&&url!==undefined){
				this.currentFramableLink = url
				this.framableVisible = true
			}
		},
		textNbGifs(){
			var nb = this.gifsToDisplay.length;
			if(nb==0){
				return "Aucun gif trouvé"
			}else if(nb==1){
				return nb+" gif trouvé"
			}else{
				return nb+" gifs trouvés"
			}
		},
		getGifsChunk(){
			var currentIndex = this.displayedGifs.length
			var nextIndex = Math.min(this.gifsToDisplay.length,currentIndex+this.gifsChunkLength)
			for(var i=currentIndex; i<nextIndex;i++){
				this.displayedGifs.push(this.gifsToDisplay[i])
			}
		},
		handleScroll() {
			var scrollHeight = window.scrollY
			var maxHeight = window.document.body.scrollHeight - window.document.documentElement.clientHeight

			if (scrollHeight >= maxHeight - 200) {
				this.getGifsChunk()
			}
			if (scrollHeight < 200) {
				this.scrolling = false
				this.currentPage = 1
				this.displayedGifs = []
				var firstIndex = Math.min(this.gifsToDisplay.length,this.gifsChunkLength)
				for(var i=0;i<firstIndex;i++){
					this.displayedGifs.push(this.gifsToDisplay[i])
				}
			}else{
				this.scrolling = true
			}
		},
		toTop(){
			window.scrollTo(0,0)
			this.displayedGifs = []
			var firstIndex = Math.min(this.gifsToDisplay.length,this.gifsChunkLength)
			for(var i=0;i<firstIndex;i++){
				this.displayedGifs.push(this.gifsToDisplay[i])
			}
			this.$nextTick(() => this.$redrawVueMasonry());
		},
		prepareList(gif,list){
			if(gif[list]==undefined)gif[list] = []
			for(var i=0;i<gif[list].length;i++){
				if(this[list][gif[list][i]]===undefined){
					this[list][gif[list][i]] = 1
				}else{
					this[list][gif[list][i]]++
				}
			}
		}
	},
	beforeMount() {
	},
	mounted: function(){
		axios({ method: "GET", "url": "http://134.209.226.72:5000/api/gifs" }).then(result => {
			this.gifs = result.data;
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
				this.prepareList(this.gifs[i],"tags")
				this.prepareList(this.gifs[i],"themes")
				this.prepareList(this.gifs[i],"sources")
			}
			this.gifsToDisplay = this.gifs.slice()
			this.filterList()
			this.loading = false
		});
	},
	created() {
		window.addEventListener('scroll', this.handleScroll);
	}
}

</script>
<style>
@media screen and (max-width: 793px) {
	#slogan {
		font-size: 10px;
	}
}
@media screen and (min-width: 1200px) {
	#slogan {
		font-size: 17px;
	}
}
@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
body{
	background:rgb(0, 0, 0);
	color:#ddd;
	font-family: 'Barlow Condensed', sans-serif;
	font-size:20px;
	overflow-y:scroll;
}
#nbGifsSelected{
	margin-left:30px;
	color:#dc5116;
}
#toTop{
	color:#ba3c07;
	cursor:pointer;
	z-index:1;
	position:fixed;
	top:20px;
	right:20px
}
#toTop:hover{
	color:#dc5116;
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
.vs-sidebar{
	position:fixed!important;
	right:0px!important;
	top:0px!important;
	color:black!important;
	text-align:left!important;
	background:#111!important;
	color:#eee!important;
	width:500px!important;
	max-width:80vw!important;
}
.vs-sidebar--items{
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
}
#wrapSideBar{
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: -17px;
	overflow-y: scroll;
}
.categoryFilters,.categoryTags{
	color:#dc5116;
	margin:5px;
	margin-bottom:15px;
	text-align:center;
	font-size:1.8em;
}
.clearFilters{
	color:#dc5116;
	cursor:pointer;
	margin-left:10px;
}
.clearFilters:hover{
	color:#ba3c07;
}
.filter,.tag,.theme,.source{
	display:inline-block;
	margin:0.03em 0.2em;
	border-radius:0.2em;
	cursor:pointer;
	padding:0.05em 0.4em;
	font-size:1em;
	background:#222;
	border:solid grey 2px;
	color:#dddddd;
}
.filterActif,.tagActif,.themeActif,.sourceActif{
	border:solid grey 2px;
	background:#ba3c07;
}
.nbGifFilter,.nbGifTag,.nbGifSource,.nbGifSource{
	color:#999
}
.tagActif>.nbGifTag,.themeActif>.nbGifTheme,.themeActif>.nbGifTheme{
	color:#bbb
}
#containerBoutons{
	margin-bottom:10px;
}
.btn.disabled{
	cursor:pointer;
}
.btnTri{
	background:#ba3c07;
	width:150px
}
.btnTri:hover{
	background:#dc5116
}
#menuBtn{
	vertical-align:middle;
	background-color:#ba3c07;
	float:right;
	width:160px;
}
#menuBtn:hover{
	background-color:#dc5116;
}
.selectableList{
	text-align:center;
}
.wrapFilters,#wrapTags,#wrapThemes,#wrapSources,#wrapAuteurs,#wrapTrier{
	text-align:center;
	margin-bottom:1.1em;
}
@media screen and (max-width: 993px) {
	.btnTri{
		font-size:17px;
		line-height:36px;
		height:36px;
	}
	#slide-out{
		font-size:13px;
	}
	#toTop{
		right:0px
	}
}
i.left{
	margin-right:5px;
	font-size:1.2em;
}
#wrapTri{
	text-align:right;
}
.loader {
	border: 16px solid #f3f3f3; /* Light grey */
	border-top: 16px solid #3498db; /* Blue */
	border-radius: 50%;
	width: 120px;
	height: 120px;
	animation: spin 2s linear infinite;
	position:fixed;
	top:calc(50% - 60px);
	left:calc(50% - 60px);
	z-index:1;
}


</style>