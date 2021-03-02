<template>
  <div class="favorites">
    <h1 class="favorites__header">
      Избранное
    </h1>
    <div class="favorites__list">
      <div class="favorites__item" v-for="(item, index) in favorites" :key="item.id">
        <router-link :to="hrefs[index]" class="favorites__item-title">
          {{item.name}}
        </router-link>
        <div class="favorites__item-panel">
          <div class="favorites__item-button favorites__item-button_change" @click="editFavorite(item, index)">Изменить</div>
          <div class="favorites__item-button favorites__item-button_delete" @click="deleteFavorite(index)">Удалить</div>
        </div>
      </div>
      <div class="favorites__empty" v-if="Object.keys(favorites).length === 0">Вы пока ничего не добавили в избранное</div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'vFavorites',
  computed: {
    ...mapState({
      favorites: state => state.favorites,
      login: state => state.user.login
    }),
    hrefs() {
      const result = []
      this.favorites.forEach(item => {
        result.push({
          name: 'search',
          params: { id: this.login, search: item.text },
          query: {
            req: item.text,
            maxResults: item.maxResults !== 12 ? item.maxResults : undefined,
            order: item.order && item.order !== 'nothing' ? item.order : undefined,
          },
        })
      })
      return result
    },
  },
  methods: {
    ...mapActions([]),
    editFavorite(request, index) {
      this.$eventBus.$emit('showModal', { request, index, type: 'edit' })
    },
    deleteFavorite(index) {
      this.$store.commit('deleteFromFavorites', index)
    },
  },
}
</script>

<style lang="scss">
.favorites {

}
.favorites__header {
  margin: 40px 0;
  font-size: 28px;
  line-height: 40px;
}
.favorites__list {}
.favorites__item {
  display: flex;
  align-items: center;
  height: 47px;
  padding: 0 20px;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #F1F1F1;
  transition: background-color 200ms;

  &:hover {
    background-color: #E5E5E5;

    .favorites__item-panel {
      opacity: 1;
    }
  }
}
.favorites__item-title {
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
}
.favorites__item-panel {
  display: flex;
  height: 100%;
  font-size: 14px;

  line-height: 20px;
  opacity: 0;
  transition: opacity 100ms;

  & > * + * {
    margin-left: 30px;
  }
}
.favorites__item-button {
  display: flex;
  align-items: center;
  height: 100%;

  &_change {
    color: #1390E5;
  }
  &_delete {
    color: #FF0000;
  }
}
</style>
