<template>
  <router-view />
</template>


<script>
import decodeB64 from '@/src/assets/js/functions/decodeB64'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions(['authorize'])
  },
  mounted() {
    if (localStorage.getItem('token') !== null) {
      this.authorize(JSON.parse(decodeB64(localStorage.getItem('token'))))
    }
  }
}
</script>
