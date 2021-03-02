<template>
    <a :href="`https://www.youtube.com/watch?v=${video.id}`"
       target="_blank"
       class="search-result"
    >
      <div class="search-result__thumbnail"
           :style="`background-image: url('${video.image}')`"
      />
      <div class="search-result__text">
        <div class="search-result__title">
          <h4 class="search-result__title-inner">{{video.title}}</h4>
        </div>
        <div class="search-result__info">
          <div class="search-result__description">{{video.description}}</div>
          <div class="search-result__views" v-if="video.viewCount !== undefined">
            {{viewCount}}
          </div>
        </div>
      </div>
    </a>
</template>

<script>
const COUNT_DIVIDERS = [
  {num: 1e9, text: 'млрд. просмотров'},
  {num: 1e6, text: 'млн. просмотров'},
  {num: 1e4, text: 'тыс. просмотров'}
]

export default {
  name: 'SearchResultItem',
  props: {
    video: {
      type: Object,
      required: true,
    },
  },
  computed: {
    viewCount() {
      const {viewCount: VC} = this.video
      const divide = COUNT_DIVIDERS.find(divide => VC >= divide.num)
      return divide ? `${Math.floor(VC / (divide.num/10)) / 10} ${divide.text}` : `${VC} просмотров`
    },
  },
}
</script>

<style lang="scss">

.search-result {
  &__thumbnail {
    display: block;
    background-position: center;
    background-size: cover;
  }
  &__title {
    overflow: hidden;
    font-weight: bold;
  }
  &__info {
    color: rgba(23, 23, 25, 0.3);
  }
  &__description {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__views {
  }
}
.search-results {
  &_grid {
    .search-result {
      width: 245px;
      display: grid;

      grid-template-rows: max-content max-content max-content;
      row-gap: 8px;

      &__thumbnail {
        width: 245px;
        height: 138px;
      }
      &__text {
        display: contents;
        width: 245px;
        font-size: 14px;
        line-height: 16px;
      }
      &__title {
        width: 100%;
        height: max-content;
        max-height: 31px;
        overflow: hidden;
        font-weight: bold;
      }
      &__info {
        width: 245px;
        color: rgba(23, 23, 25, 0.3);
      }
      &__description {

      }
      &__views {

      }
    }
  }
  &_list {
    .search-result {
      display: flex;
      width: 100%;

      &__thumbnail {
        width: 157px;
        height: 88px;
        flex: none;
      }
      &__text {
        width: 510px;
        margin-left: 20px;
        font-size: 16px;
        line-height: 20px;

        & > * + * {
          margin-top: 8px;
        }
      }
      &__title {
        height: 40px;
      }
      &__description {

      }
    }
  }
}
</style>
