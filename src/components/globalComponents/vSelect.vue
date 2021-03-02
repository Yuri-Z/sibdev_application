<template>
  <select class="select input select__dropdown" name="select" v-model="currentValue">
    <option v-for="item in list"
            :key="item.id"
            :value="item"
            class="select__dropdown-item"
    >
      {{item}}
    </option>
  </select>
</template>

<script>
import getKeyByValue from '@/src/assets/js/functions/getKeyByValue'

export default {
  name: 'vSelect',
  props: {
    list: Object,
    placeholder: String,
    defaultItem: String,
  },
  data() {
    return {
      currentValue: this.defaultItem ? this.list[this.defaultItem] : this.placeholder,
    }
  },
  mounted() {

  },
  methods: {
    emitValue(eventName, value) {
      this.$emit(eventName, value)
    },
  },
  watch: {
    currentValue(newValue) {
      this.emitValue('select', { value: newValue, index: getKeyByValue(this.list, newValue) })
    },
  },
}
</script>

<style lang="scss">
.select {
  position: relative;
  width: 100%;
  height: 48px;
  background: #FAFAFA;
  border: 1px solid rgba(23, 23, 25, 0.1);
  border-radius: 5px;
}
.select__current-item {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;

  &_placeholder {
    color: rgba(0,0,0,0.6);
  }
}
.select__dropdown {
  //position: absolute;
  top: calc(100% + 5px);
  right: 0;
  z-index: 10;
  //display: none;
  width: 100%;
  background-color: #FAFAFA;
  border: 1px solid rgba(23, 23, 25, 0.1);
  border-radius: 5px;
  &_active {
    display: block;
  }
}
.select__dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 0 16px;
  overflow: hidden;
  font-size: 16px;
  text-align: right;
  cursor: pointer;
  justify-content: flex-end;

  &:hover {
    background-color: #E5E5E5;
  }
}
</style>
