<template>
  <button class="button" :class="`button_${buttonType}`">
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'vButton',
  props: {
    buttonType: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.button {
  height: 52px;
  padding: 14px 20px;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;

  &_hollow {
    color: #1390E5;
    background-color: #fff;
    border: 1px solid #1390E5;
  }
  &_filled {
    color: #fff;
    background: #1390E5;
  }
}
</style>
