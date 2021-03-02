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
      <i class="search__field-icon icon-heart" @click="addToFavorites()" v-if="requestText"></i>
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
    modalData() {
      return {
        type: 'save',
        request: {
          name: '',
          text: this.textModel,
          maxResults: 12,
          order: '',
        },
      }
    },
  },
  mounted() {
    if (typeof this.$route.query.req === 'string') {
      this.requestText = this.$route.query.req
      this.runSearch(true)
    }
  },
  methods: {
    changeView() {
      this.currentView = !this.currentView
    },
    runSearch(queryFromUrl = false) {
      if (queryFromUrl) {
        this.textModel = this.requestText
      } else {
        this.requestText = this.textModel
      }
      if (this.$route.query.req !== this.textModel) {
        this.$router.push({ query: { req: this.textModel } })
      }
      if (this.requestText !== '') {
        this.request.searchParams.q = this.requestText
        this.response = []
        this.ids = []
        this.axios.get(this.request.searchUrl, { params: this.request.searchParams })
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
    addToFavorites() {
      if (this.textModel !== '') {
        this.$eventBus.$emit('showModal', this.modalData)
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
