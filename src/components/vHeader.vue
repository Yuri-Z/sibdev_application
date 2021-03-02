<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo"/>
      <nav class="header__navigation">
        <router-link v-for="item in navMenu" :to="item.href" :key="item.id">
          <div class="header__navigation-item" :class="{'header__navigation-item_active': activeItem(item.href)}">{{ item.name }}</div>
        </router-link>
        <div class="header__navigation-item align-right" @click="logout">Выйти</div>
      </nav>
    </div>
  </header>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'vHeader',
  data() {
    return {
      navMenu: [
        { name: 'Поиск', href: { name: 'search', params: { id: this.login } } },
        { name: 'Избранное', href: { name: 'favorites', params: { id: this.login } } }
      ]
    }
  },
  computed: {
    ...mapState({
      login: state => state.user.login
    })
  },
  methods: {
    activeItem(href) {
      return this.$route.path === href
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push({ name: 'auth' })
    }
  }
}
</script>

<style lang="scss">
.header {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #F1F1F1;
}

.header__container {
  display: flex;
  align-items: center;
  width: 1040px;
  height: 80px;
  margin: 0 auto;

  & > * + * {
    margin-left: 20px;
  }
}

.header__logo {
  width: 48px;
  height: 48px;
  background-size: contain;
  background-image: url('~@/src/assets/logo.png');
  background-position: center;
  background-repeat: no-repeat;
}

.header__navigation {
  display: flex;
  font-size: 18px;
  line-height: 28px;
  flex-grow: 1;
}

.header__navigation-item {
  position: relative;
  min-width: 100px;
  padding: 26px 20px;
  color: #1390E5;
  text-align: center;
  cursor: pointer;

  &:after {
    position: absolute;
    bottom: 0;
    left: 20px;
    width: calc(100% - 40px);
    height: 2px;
    background-color: #1390E5;
    content: '';
    opacity: 0;
    transition: opacity 300ms;
  }

  &_active:after {
    opacity: 1;
  }
}
</style>
