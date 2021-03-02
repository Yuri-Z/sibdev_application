<template>
  <div class="search-results" :class="`search-results_${currentView ? 'list' : 'grid'}`">
    <v-search-result-item v-for="(item, index) in videos"
                          :key="item.id"
                          :video="objectCompiler(item, index)"
    />
  </div>
</template>

<script>
import vSearchResultItem from '@/src/components/vSearchResultItem'

export default {
  name: 'SearchResults',
  components: {
    vSearchResultItem
  },
  props: {
    videos: {
      type: Array,
      required: true
    },
    ids: {
      type: Array,
      required: true
    },
    currentView: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    objectCompiler(item, index) {
      return {
        id: this.ids[index],
        title: item.title,
        description: item.description,
        image: item.thumbnails.medium.url,
        viewCount: item.statistics === undefined ? 0 : item.statistics.viewCount
      }
    }
  }
}
</script>

<style lang="scss">
.search-results {
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 28px;

  &_grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  &_list {
    grid-template-columns: 1fr;
  }
}
</style>
