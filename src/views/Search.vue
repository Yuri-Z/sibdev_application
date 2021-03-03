<template>
  <div class="search" :class="response.length > 0 ? 'search_not-empty' : 'search_empty'">
    <h1 class="search__header">
      Поиск видео
    </h1>
    <div class="search__field">
      <input
        class="search__field-input"
        placeholder="Что хотите посмотреть?"
        v-model="textModel"
        @keydown.enter="runSearch()"
      >
      <svg class="search__field-icon" width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" @click="addToFavorites('edit', index)" v-if="index !== -1">
        <path d="M20.8401 3.60999C20.3294 3.099 19.7229 2.69364 19.0555 2.41708C18.388 2.14052 17.6726 1.99817 16.9501 1.99817C16.2276 1.99817 15.5122 2.14052 14.8448 2.41708C14.1773 2.69364 13.5709 3.099 13.0601 3.60999L12.0001 4.66999L10.9401 3.60999C9.90843 2.5783 8.50915 1.9987 7.05012 1.9987C5.59109 1.9987 4.19181 2.5783 3.16012 3.60999C2.12843 4.64169 1.54883 6.04096 1.54883 7.49999C1.54883 8.95903 2.12843 10.3583 3.16012 11.39L4.22012 12.45L12.0001 20.23L19.7801 12.45L20.8401 11.39C21.3511 10.8792 21.7565 10.2728 22.033 9.60535C22.3096 8.93789 22.4519 8.22248 22.4519 7.49999C22.4519 6.77751 22.3096 6.0621 22.033 5.39464C21.7565 4.72718 21.3511 4.12075 20.8401 3.60999V3.60999Z" fill="#C5E4F9" stroke="#1390E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <i class="search__field-icon icon-heart" @click="addToFavorites('save')" v-else-if="requestText"/>
      <v-button class="search__field-button" button-type="filled" @click.native="runSearch()">Найти</v-button>
    </div>
    <div class="search__panel" v-if="response.length > 0">
      <div class="search__panel-current-request">
        Видео по запросу&nbsp;&nbsp;«{{requestText}}»
      </div>
      <div class="search__panel-response-counter">
        {{1000000 > totalResults ? totalResults : '1000000+'}}
      </div>
      <div class="search__panel-view-switcher">
        <i class="search__panel-icon icon-list" :class="{'search__panel-icon_active':  currentView}" @click="changeView"/>
        <i class="search__panel-icon icon-grid" :class="{'search__panel-icon_active': !currentView}" @click="changeView"/>
      </div>
    </div>
    <v-search-results
      :currentView="currentView"
      :videos="response"
      :ids="ids"
      v-if="response.length > 0"
    />
  </div>
</template>

<script>
import vSearchResults from '@/src/components/vSearchResults'
import vButton from '@/src/components/globalComponents/vButton'

import {mapState} from 'vuex'

const API_KEY = 'AIzaSyDxJr90cU0JIKr-lOziW0hfV8NGWaV9dwc'
// const API_KEY = 'AIzaSyACDbnvwjKF0A-xWxDHKShZeUjgDxAM_rg'

export default {
  name: 'Search',
  components: {vSearchResults, vButton},
  data() {
    return {
      textModel: '',
      requestText: '',
      request: {
        searchUrl: 'https://www.googleapis.com/youtube/v3/search',
        videosUrl: 'https://www.googleapis.com/youtube/v3/videos',
        searchParams: {
          part: 'snippet',
          key: API_KEY,
          maxResults: 12,
          type: 'video',
          q: '',
        },
        viewCountParams: {
          part: 'statistics',
          key: API_KEY,
        },
      },
      response: [],
      ids: [],
      totalResults: 0,
      currentView: false,
    }
  },
  computed: {
    ...mapState({
      favorites: state => state.favorites
    }),
    modalData() {
      return {
        name: '',
        text: this.textModel,
        maxResults: 12,
        order: '',
      }
    },
    index() {
      return this.favorites.findIndex(item => item.text === this.requestText)
    }
  },
  mounted() {
    if (typeof this.$route.query.q === 'string') {
      this.requestText = this.$route.query.q
      this.runSearch(true)
    }
  },
  methods: {
    changeView() {
      this.currentView = !this.currentView
    },
    runSearch(queryFromUrl = false) {
      if (queryFromUrl) this.textModel = this.requestText
      else this.requestText = this.textModel
      if (this.$route.query.q !== this.textModel) this.$router.push({ query: { q: this.textModel } })
      
      if (this.requestText !== '') {
        this.request.searchParams.q = this.requestText
        this.response = []
        this.ids = []
        Object.keys(this.$route.query).forEach(i => {
          if (this.$route.query[i] !== undefined) {
            this.request.searchParams[i] = this.$route.query[i]
          }
        })
        this.axios.get(this.request.searchUrl, { params: this.request.searchParams})
          .then((response) => {
            this.totalResults = response.data.pageInfo.totalResults
            response.data.items.forEach(item => {
              this.response.push(item.snippet)
              this.ids.push(item.id.videoId)
            })
          })
          .then(() => {
            this.getViewsCount()
          })
          .catch((error) => {
            console.log('error', error)
          })
      }
    },
    getViewsCount() {
      this.axios.get(this.request.videosUrl, { params: { ...this.request.viewCountParams, id: this.ids.join(',') } })
        .then((response) => {
          response.data.items.forEach((item, index) => this.$set(this.response[index], 'statistics', item.statistics))
        })
    },
    addToFavorites(type, index) {
      if (this.textModel !== '') {
        if (index && this.favorites[index].name) {
          this.modalData.name = this.favorites[index].name
        }
        this.$eventBus.$emit('showModal', {request: this.modalData, type, index})
      }
    },
  },
}
</script>

<style lang="scss">
.search {
  &__field {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 52px;
    background-color: #fff;
    border: 1px solid rgba(23, 23, 25, 0.2);
    border-radius: 5px;

    &:focus-within {
      border: 1px solid #1390E5;
      background: rgba(197, 228, 249, 0.3);
    }
    &-input {
      padding: 14px 50px 14px 14px;
      color: #272727;
      background-color: transparent;
      flex-grow: 1;
      font-size: 20px;
      line-height: 24px;
    }
    &-icon {
      position: absolute;
      right: 165px;
      font-size: 24px;
      color: #1390E5;
      cursor: pointer;
    }
    &-button {
      width: 150px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-right: -1px;
    }
  }
  &__panel {
    display: flex;
    margin-top: 40px;
    font-size: 16px;
    line-height: 24px;
    &-icon {
      color: black;
      cursor: pointer;
      opacity: 0.3;

      &_active {
        opacity: 1;
      }
    }
    &-response-counter {
      margin-left: 15px;
      color: rgba(23, 23, 25, 0.3);
    }
    &-view-switcher {
      margin-left: auto;
      font-size: 24px;
      cursor: default;

      & > * + * {
        margin-left: 10px;
      }
    }
  }
  &_empty {
    display: flex;
    align-items: center;
    width: 686px;
    margin: 180px auto 0;
    flex-flow: column;

    .search__header {
      margin-bottom: 40px;
      font-size: 36px;
      line-height: 52px;
    }
  }
  &_not-empty {

    .search__header {
      margin-bottom: 12px;
      font-size: 28px;
      line-height: 40px;
    }
  }
}
</style>
