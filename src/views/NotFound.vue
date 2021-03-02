<template>
  <div class="not-found" @click="goBack">
    <img class="not-found__image" src="~@/src/assets/404.jpg" alt="">
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-width: 450px;
  height: 100vh;
  min-height: 450px;
  background-color: #0195bd;
  cursor: pointer;

  &__image {
    border-radius: 37%;
    box-shadow: 15px 0 10px #059abf, -15px 0 10px #059abf, 0 15px 10px #059abf, 0 -15px 10px #059abf;
  }
}
</style>
