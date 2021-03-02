<template>
  <div class="application">
    <v-header />
    <main class="main">
      <router-view />
    </main>
    <v-modal />
  </div>
</template>

<script>
import vHeader from '@/src/components/vHeader.vue'
import vModal from '@/src/components/vModal.vue'

import { mapActions, mapState } from 'vuex'
import decodeB64 from '@/src/assets/js/functions/decodeB64'

export default {
  name: 'vUser',
  components: {
    vHeader,
    vModal
  },
  computed: {
    ...mapState({
      login: state => state.user.login
    })
  },
  methods: {
    ...mapActions(['authorize']),
    tokenCheck() {
      if (this.login) {
        if (!this.$route.params.id || this.$route.params.id !== this.login) {
          this.$router.push({
            name: this.$route.name,
            params: {
              id: this.login
            }
          })
        }
      } else {
        this.$router.push({name: 'auth'})
      }
    }
  },
  mounted() {
    if (localStorage.getItem('token') !== null) {
      this.authorize(JSON.parse(decodeB64(localStorage.getItem('token'))))
    }
    this.tokenCheck()
  },
}
</script>

<style lang="scss">
.application {
  width: 100%;
  min-width: 1040px;
  //height: 100vh;
  min-height: 800px;
  margin: 0 auto;
  background-color: #fafafa;
}

.main {
  width: 1040px;
  padding: 40px 0;
  margin: 0 auto;
}
</style>
