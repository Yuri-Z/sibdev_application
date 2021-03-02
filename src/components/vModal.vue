<template>
  <div class="modal" v-if="modalType !== ''">
    <div class="modal__content">
      <h3 class="modal__title">{{ `${modalAppearance[modalType]}нить запрос` }}</h3>
      <div class="modal__inputs">
        <div class="modal__row modal__row_text">
          <label class="modal__label label">Запрос</label>
          <input class="modal__input input" placeholder="чем кормить кота" v-model="request.text">
        </div>
        <div class="modal__row modal__row_text">
          <label class="modal__label label"><span class="red">* </span>Название</label>
          <input class="modal__input input" placeholder="Укажите название" v-model="request.name" @keydown.enter="saveRequest">
          <div class="modal__error" v-if="error">{{ error }}</div>
        </div>
        <div class="modal__row">
          <label class="modal__label label">Сортировать по</label>
          <v-select :list="orderTemplate" :placeholder="placeholder" :default-item="request.order" @select="receiveSelect" />
        </div>
        <div class="modal__row modal__row_range">
          <div class="modal__label label">Максимальное количество</div>
          <div class="modal__range">
            <v-range class="modal__range-input" :min="1" :max="50" :default="12" @range="receiveRange" />
            <div class="modal__range-value input">{{ request.maxResults }}</div>
          </div>
        </div>
      </div>
      <div class="modal__buttons">
        <v-button class="modal__button" button-type="hollow" @click.native="closeModal">{{ `не ${modalAppearance[modalType]}нять` }}</v-button>
        <v-button class="modal__button" button-type="filled" @click.native="saveRequest">{{ `${modalAppearance[modalType]}нить` }}</v-button>
      </div>
    </div>
    <div class="modal__shadow"></div>
  </div>
</template>

<script>
import vButton from '@/src/components/globalComponents/vButton'
import vRange from '@/src/components/globalComponents/vRange'
import vSelect from '@/src/components/globalComponents/vSelect'

export default {
  name: 'vModal',
  components: { vButton, vRange, vSelect },
  data() {
    return {
      index: undefined,
      modalType: '',
      placeholder: 'Без сортировки',
      modalAppearance: {
        save: 'сохра',
        edit: 'изме'
      },
      oldName: '',
      request: {
        name: '',
        text: '',
        maxResults: 12,
        order: ''
      },
      error: ''
    }
  },
  computed: {
    favorites() {
      return this.$store.state.favorites
    }
  },
  methods: {
    closeModal() {
      this.modalType = ''
    },
    receiveSelect(select) {
      this.request.order = select.index
    },
    saveRequest() {
      if (this.request.name !== '') {
        if (this.modalType === 'edit' && this.request.name !== this.oldName) {
          if (this.favorites.find(fav => fav.name === this.request.name)) {
            return this.error = 'Это имя уже занято'
          }
        }
        this.$store.commit('addToFavorites', { request: this.request, index: this.index })
        this.closeModal()
      } else {
        this.error = 'Это поле обязательно для заполнения'
      }
    },
    receiveRange(range) {
      this.request.maxResults = range
    }
  },
  mounted() {
    this.$eventBus.$on('showModal', ({ type, request, index }) => {
      this.modalType = type
      this.request = { ...request }
      this.index = index

      this.oldName = this.request.name
    })
  },
  watch: {
    'request.name': function() {
      if (this.error.length > 0) {
        this.error = ''
      }
    }
  }
}
</script>

<style lang="scss">
.modal {
  &__content {
    position: fixed;
    top: calc(50% - 287px);
    left: calc(50% - 260px);
    z-index: 10;
    width: 510px;
    min-height: 574px;
    padding: 36px 40px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 50px rgba(19, 144, 229, 0.8);
  }

  &__title {
    font-size: 18px;
    font-weight: bold;
    line-height: 28px;
    text-align: center;

    &:first-letter {
      text-transform: uppercase;
    }
  }

  &__inputs {
    margin: 36px 0;

    & > * + * {
      margin-top: 24px;
    }
  }

  &__row {
    position: relative;
  }

  &__error {
    position: absolute;
    top: 4px;
    right: 0;
    font-size: 12px;
    color: #ff0000;
  }

  &__input {
    width: 100%;
  }

  &__range {
    display: flex;

    &-input {
      width: 100%;
    }

    &-value {
      width: 100px;
      margin-left: 20px;
      flex: none;
      justify-content: center;
    }
  }

  &__buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
  }

  &__button {
    &:first-letter {
      text-transform: uppercase;
    }
  }

  &__shadow {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #75C7FF;
    opacity: 0.8;
  }
}
</style>
