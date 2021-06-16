<template>
    <div class="call-to-actions-container">
      <button class="settings" v-if="$store.state.timerStatus.active" @click="$store.dispatch('stopTimer')">
        <i class="material-icons">stop</i>
      </button>
      <button class="settings" v-if="$store.state.timerStatus.running" @click="$store.dispatch('pauseTimer')">
        <i class="material-icons">pause_circle_outline</i>
      </button>
      <button class="settings" v-else-if="$store.state.timerStatus.paused" @click="$store.dispatch('startTimer')">
        <i class="material-icons">play_circle_outline</i>
      </button>
      <button v-else class="settings" :disabled="!$store.state.hideModal || $store.state.timerStatus.active" @click="openModal">
        <i class="material-icons">settings</i>
      </button>
    </div>
    <br>
    <modal :hide-modal="hideModal" @closeModal="closeModal">
      <Form @submit="saveChanges" v-slot="{ meta }">
        <article class="settings-section time divider">
          <h4 class="settings-title">time (minutes)</h4>
          <div class="time-settings">
            <div class="time-setting" v-for="timeLimit in timeLimits" :key="timeLimit.name">
              <label :for="timeLimit.name">{{ timeLimit.title }}</label>
              <Field :name="timeLimit.name"
                v-model="form.time[timeLimit.name]"
                v-slot="{ field, errorMessage }"
                :rules="timeRules" :id="timeLimit.name"  :value="timeLimit.value">
                <input v-bind="field" type="number"/>
                <span v-if="errorMessage" role="alert">{{ errorMessage }}</span>
              </Field>
            </div>
          </div>
        </article>
        <article class="settings-section font divider">
          <h4 class="settings-title">FONT</h4>
          <div class="font-settings">
            <div v-for="font in fonts"
                :key="font.name" 
                :style="{ fontFamily: font.name + ', sans-serif' }"
                :class="['font-setting', font.isActive ? 'active': '']">
              <Field type="radio" hidden name="font-type" :value="font.name" v-model="form.font" />  
              <label @click="() => fontChange(font)">Aa</label>
            </div>
          </div>
        </article>
        <article class="settings-section color">
          <h4 class="settings-title">COLOR</h4>
          <div class="font-settings">
            <div :class="['font-setting', color.isActive ? 'active': '']" v-for="color in colors" :key="color.name">
                <input type="radio" hidden name="color-type" :value="color.hexCode" v-model="form.color">
                <label 
                  :style="{backgroundColor: color.hexCode}"
                  @click="() => colorChange(color)"
                >
                  <i :data-color="JSON.stringify(color)" class="material-icons" v-show="color.isActive">check</i>
                </label>
            </div>
          </div>
        </article>
        <button :disabled="!meta.valid" class="apply" type="submit">Apply</button>
      </Form>
    </modal>
</template>
<script>
import { Field, Form  } from 'vee-validate';
import * as yup from 'yup';
import Modal from "../shared/Modal";
export default {
    emits: ['color-changed', 'font-changed', 'save-changes'],
    props: ['colors', 'fonts', 'timeLimits'],
    name: 'Settings',
    data() {
      return {
        selectedColor: null,
        selectedFont: null,
        MAX_VALUES_TIMER: {
          pomodoro: 50,
          shortBreak: 10,
          longBreak: 20
        },
        form: {
          time: {
            pomodoro: 0,
            shortBreak: 0,
            longBreak: 0
          },
          font: '',
          color: ''
        },
        timeRules: yup
          .number().positive().integer().typeError('Please provider a positive integer value')
          .required().typeError('Please provider a positive integer value')
          .min(1, 'You must provide at least one positive integer value')
          .max(50, 'Is not recomended to do a task iteration longer than 50 minutes')
      }
    },
    components: {
      Modal,
      Field,
      Form
    },
    methods: {
        openModal() {
          this.$store.dispatch('openModal');
        },
        closeModal() {
          this.$store.dispatch('closeModal');
        },
        isCurrentColor(color) {
          return this.colors.find(n => n.isActive && n.name === color.name);
        },
        isCurrentFont(font) {
          return this.fonts.find(n => n.isActive && n.name === font.name);
        },
        colorChange(color) {
          if (!this.isCurrentColor(color)) {
            this.selectedColor = color;
            this.form.font = color.hex;
            this.$emit('color-changed', color);
          }
        },
        fontChange(font) {
          if (!this.isCurrentFont(font)) {
            this.selectedFont = font;
            this.form.font = font.name;
            this.$emit('font-changed', font);
          }
        },
        formatTimeLimits() {
          const timeLimits = [];
          for (const property in this.form.time) {
            timeLimits.push({
              name: property,
              value: this.form.time[property]
            });
          }
          return timeLimits;
        },
        saveChanges() {
          this.$emit('save-changes', {
            color: this.selectedColor,
            font: this.selectedFont,
            timeLimits: this.formatTimeLimits()
          });
          this.$store.dispatch('closeModal')
        }
    },
    computed: {
      hideModal() {
        return this.$store.state.hideModal;
      }
    },
    mounted() {
      this.timeLimits.forEach(time => {
        if(this.form.time[time.name] !== undefined) {
          this.form.time[time.name] = time.value;
        }
      })
      this.form.font = this.fonts.find(n => n.isActive).name;
      this.form.color = this.colors.find(n => n.isActive).hexCode;
    }
}
</script>
<style>
.call-to-actions-container {
    display: block;
    position: absolute;
    top: calc(var(--timer-dimension) * 2 + 50px);
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
}
.settings {
    background: none;
    border: none;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
    outline-color: var(--active-color);
  }

  .settings:disabled {
    opacity: 0.1;
    pointer-events: none;
  }

  .settings:hover,
  .settings:focus {
    border: 0.2rem solid var(--active-color);
    border-radius: 60px;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
  }

  .settings i {
    color: var(--text-color);
    font-size: 2.3rem;
  }

  .settings-section {
    width: 100%;
    position: relative;
    margin-bottom: 2rem;
  }

  .settings-section.divider::after {
    position: absolute;
    bottom: -10px;
    background: rgba(0,0,0,.1);
    width: 100%;
    height: 1px;
    content: "";
    display: block;
  }

  .settings-title {
    text-transform: uppercase;
    font-size: 1.2rem;
    line-height: 3rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--text-dark-color);
    text-align: center;
  }

  .time-settings {
    width: 100%;
  }

  .time-setting {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.6rem;
    flex-wrap: wrap;
  }

  .time-setting input.invalid {
    border: 2px solid var(--error-color);
  }

  span[role="alert"] {
    color: var(--error-color);
    width: 100%;
  }

  .time-setting label {
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--text-dark-color);
    max-width: 50%;
  }

  .time-setting input {
    border: 1px solid rgba(0,0,0,.1);
    padding: 0.5rem;
    border-radius: 5px;
    background: var(--white-background);
    color: black;
    font-weight: 600;
    max-width: 120px;
  }

  .font-settings {
    max-width: 200px;
    width: 100%;
    margin: 0 auto 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }

  .font-setting {
    width: 50px;
    height: 50px;
  }

  .font-setting label {
    width: 100%;
    height: 100%;
    font-size: 1rem;
    border-radius: 50%;
    display: inline-block;
    line-height: 50px;
    background: var(--white-background);
    border: none;
    color: #a2a4b2;
    font-weight: 600;
    transition: all 0.3s ease-in-out;
    text-align: center;
    cursor: pointer;
  }
  .font-setting input:checked + label,
  .font-setting.active > label {
    background: var(--dark-color);
    color: white;
  }

  .font-setting input:focus {
    outline: 2px dashed var(--text-color);
  }

  .font-setting i {
    color: var(--main-color);
    font-weight: 400;
    line-height: 50px;
  }

  .font-setting:not(:last-child) {
    margin-right: 1rem;
  }

  .apply {
    background: var(--active-color);
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    max-width: 220px;
    border-radius: 23px;
    font-size: 1.2rem;
    position: absolute;
    bottom: -1.4rem;
    cursor: pointer;
    font-weight: 500;
    transition: 
      color 233ms ease-in-out,
      background 265ms ease-in-out;
  }

  .apply:disabled {
    background: var(--disabled-color);
    pointer-events: none;
  }

  .apply:hover {
    color: var(--dark-color);
  }
</style>