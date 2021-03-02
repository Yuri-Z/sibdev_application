<template>
  <div class="range">
    <input :max="max" :min="min" class="range__input" type="range" v-model="current">
    <div :style="`left: ${rangeWidth}%`" class="range__thumb"></div>
    <div :style="`width: ${rangeWidth}%`" class="range__filled"></div>
    <div :style="`width: calc(100% - ${rangeWidth}%)`" class="range__empty"></div>
  </div>
</template>

<script>
export default {
  name: 'vRange',
  props: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    default: { type: Number, default: 0 },
  },
  data() {
    return {
      current: this.default,
    }
  },
  methods: {
    emitValue(value) {
      this.$emit('range', value)
    },
  },
  computed: {
    rangeWidth() {
      if (this.current === 0) {
        return 0
      }
      return (this.current / this.max) * 100
    },
  },
  watch: {
    current(newValue) {
      this.emitValue(newValue)
    },
  },
}
</script>

<style lang="scss">
.range {
  position: relative;
  display: flex;
  align-items: center;
}
.range__input {
  width: 100%;
  opacity: 0;
  cursor: pointer;
}
.range__thumb {
  position: absolute;
  z-index: 1;
  width: 18px;
  height: 18px;
  margin-left: -9px;
  pointer-events: none;
  background-color: #fff;
  border: 2px solid #1390E5;
  border-radius: 50%;
}
.range__filled {
  position: absolute;
  left: 0;
  height: 6px;
  pointer-events: none;
  background-color: #1390E5;
  border-radius: 3px;
}
.range__empty {
  position: absolute;
  right: 0;
  height: 6px;
  pointer-events: none;
  background-color: #b9b9ba;
  border-radius: 3px;
}
</style>
