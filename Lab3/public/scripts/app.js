import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js';

Vue.component('link-view',{
  props:['id','shortUrl','url'],
  methods :{
    onLinkChange: function(){
      const text = this.$refs.linkInput.value;
      if(text === "") {
        this.$refs.linkInput.value = this.url;
      } else {
        this.$emit('on-original-change',this.id,text);
      }
    }
  },
  template:
  `
  <div class="row">
            <div class="col">
                <input ref ="linkInput" input type="text" class="table-input-field" :value = url v-on:change = "onLinkChange">
            </div>
            <div class="col" style="padding-left: 0%;">
                <div class="url-list-group input-group" style="margin-left: 0%;">
                    <input input type="text" class="table-input-field" disabled :value=shortUrl>
                </div>
            </div>
            	<div class = "col-auto"><button class="btn btn-outline-light rounded-pill" type="button" v-on:click = "$emit('on-delete',id)"><img src="icons/history/trash.svg" alt=""></button></div>
    </div>
  `
})
Vue.component('virtual-link-view',{

  mounted : function() {
    const linkInputRef = this.$refs.linkInput;
    linkInputRef.focus();
  },
  methods:{
    onFocusChange : function() {
      this.$emit('on-edit-end',this.$refs.linkInput.value)
    }
  },
  template:
  `
  <div class="row">
            <div class="col">
                <input ref ="linkInput" input type="text" class="table-input-field" v-on:focusout = "onFocusChange">
            </div>
            <div class="col" style="padding-left: 0%;">
                <div class="url-list-group input-group" style="margin-left: 0%;">
                    <input input type="text" class="table-input-field" disabled>
                </div>
            </div>
  </div>
  `
})

let app = new Vue({
    el: '#app',
    
    data: {
      links : [],
      showVirtualLink : false,
    },
    methods: {
      onAdd : function() {
        this.showVirtualLink = true;
      },
      addItem : function(text) {
        if(text === "") {
          this.showVirtualLink = false;
          return;
        }
        if(this.links.find((val,index,obj) => val.original_link === text) === undefined) {
          let self = this;
          axios.post('/createShort',{
            link: text
          })
          .then((response)=>{
            console.log(response.data)
            self.links.push({
                id : response.data.id,
                original_link : text,
                short_link : window.location.host + '/' +response.data.short_link})
          })
        }
        this.showVirtualLink = false;
      },
      changeItem : function(id,newText) {
        let updateItemId = this.links[id].id;
        axios.patch('/updateLink',{
          id : updateItemId,
          newText : newText
        })
        console.log(id + " " + newText)
      },
      removeItem : function(id) {
        let removeItemId = this.links[id].id
        axios.delete('/deleteLink',{
          data : {
            id : removeItemId,
          }
        })
        this.links.splice(id,1)
      },
      validateUrl : function(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
      }
    },
    created: function () {
      let self = this;
      axios.get('/getAllLinksData',)
      .then((response) => {
        for (let index = 0; index < response.data.length; index++) {
          const element = response.data[index];
          self.links.push({
            id : element.id,
            original_link : element.original_link,
            short_link : window.location.host + '/' +element.short_link})
        }
      })
    }
  })