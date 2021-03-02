<template>
  <div class="authorization">
    <div class="authorization__logo"></div>
    <div class="authorization__content">
      <h1 class="authorization__title">Вход</h1>
      <div class="authorization__row">
        <label class="authorization__label label">Логин</label>
        <input class="authorization__input input"
               placeholder="Введите логин"
               v-model="auth.login"
               @keypress.enter="$refs.password.focus()"
        >
      </div>
      <div class="authorization__row">
        <label class="authorization__label label">Пароль</label>
        <div class="authorization__input-wrapper">
          <input class="authorization__input authorization__input_password input"
                 :style="auth.password && passwordIsHidden ? 'font-family: icomoon, Roboto, sans-serif; font-size: 11px': ''"
                 :type="passwordIsHidden ? 'password' : 'text'"
                 ref="password"
                 placeholder="Введите пароль"
                 v-model="auth.password"
                 @keypress.enter="logIn(auth)"
          >
          <i class="authorization__icon"
             :class="passwordIsHidden ? 'icon-eye-slash' : 'icon-eye'"
             @click="togglePassword"
             tabindex="-1"
          />
        </div>
      </div>
      <div class="authorization__error" v-if="error">Неверный логин или пароль</div>
    </div>
    <v-button class="authorization__button"
              button-type="filled"
              @click.native="logIn(auth)"
    >Войти</v-button>
  </div>
</template>

<script>
import vButton from '@/src/components/globalComponents/vButton'
import encodeB64 from '@/src/assets/js/functions/encodeB64'
import authorization from '@/src/assets/js/functions/authorization'
import {mapState, mapActions} from 'vuex'

export default {
  name: 'Authorization',
  components: {
    vButton
  },
  data() {
    return {
      auth: {
        login: '',
        password: '',
      },
      passwordIsHidden: true,
      error: false,
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    ...mapActions(['authorize']),
    togglePassword() {
      this.passwordIsHidden = !this.passwordIsHidden
      this.$refs.password.focus()
    },
    async logIn(auth) {
      const token = encodeB64(JSON.stringify(auth))
      if (await authorization(token)) {
        localStorage.setItem('token', token)
        this.authorize(auth)
      } else this.error = true

      if (this.user.login) await this.$router.push({
        name: 'user',
        params: {
          id: this.user.login
        }})
    },
  },
  watch: {
    'auth.login': function () {
      if (this.error === true) {
        this.error = false
      }
    },
    'auth.password': function () {
      if (this.error === true) {
        this.error = false
      }
    },
  },
}
</script>

<style lang="scss">
.authorization {
  display: flex;
  align-items: center;
  width: 510px;
  height: 520px;
  padding: 47px 88px 60px;
  margin: 140px auto;
  background-color: #fff;
  border: 1px solid rgba(39, 39, 39, 0.1);
  border-radius: 5px;
  flex-flow: column;

  & > * + * {
    margin-top: 40px;
  }
  &__logo {
    width: 88px;
    height: 70px;
    background-image: url('~@/src/assets/logo.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  &__content {
    position: relative;
    width: 100%;
    & > * + * {
      margin-top: 20px;
    }
  }
  &__title {
    font-weight: bold;
    font-size: 18px;
    line-height: 28px;
    text-align: center;
  }
  &__row {
    width: 100%;

    &:focus-within {
      .authorization__icon {
        color: #1390E5;
      }
      .authorization__input { // Дублирую стили из .input, чтобы окошко не моргало при смене видимости пароля.
        border: 1px solid #1390E5;
        background: rgba(197, 228, 249, 0.3);
      }
    }
  }
  &__label {
    font-size: 16px;
    line-height: 22px;
    color: rgba(23, 23, 25, 0.3);
  }
  &__input {
    width: 100%;

    &_password {
      padding-right: 54px;
    }
    &-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
  }
  &__icon {
    position: absolute;
    right: 16px;
    display: flex;
    justify-content: center;
    width: 30px;
    font-size: 20px;
    color: #d1d1d1;
    cursor: pointer;
    outline: none;
  }
  &__button {
    width: 176px;
  }
  &__error {
    position: absolute;
    bottom: -30px;
    color: #FF0000;
    margin-left: calc(50% - 108px);
  }
}
</style>
