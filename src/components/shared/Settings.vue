<template>
    <button class="settings" :disabled="!hideModal" @click="openModal">
      <i class="material-icons">settings</i>
    </button>
    <modal :hide-modal="hideModal" @closeModal="closeModal">
        <article class="settings-section time divider">
          <h4 class="settings-title">time (minutes)</h4>
          <div class="time-settings">
            <div class="time-setting" v-for="timeLimit in timeLimits" :key="timeLimit.name">
              <label :for="timeLimit.name">{{ timeLimit.title }}</label>
              <input :ref="timeLimit.name" type="number" :id="timeLimit.name" :value="timeLimit.value">
            </div>
          </div>
        </article>
        <article class="settings-section divider">
          <h4 class="settings-title">FONT</h4>
          <div class="font-settings">
            <button v-for="font in fonts"
              :key="font.name" 
              :style="{fontFamily: font.name + ', sans-serif'}"
              :class="['font-setting', font.isActive ? 'active': '']" 
              @click="() => fontChange(font)">Aa</button>
          </div>
        </article>
        <article class="modal-section">
          <h4 class="settings-title">COLOR</h4>
          <div class="font-settings">
            <button :class="['font-setting', color.isActive ? 'active': '']" 
              v-for="color in colors" :key="color.name"
              :style="{backgroundColor: color.hexCode}"
              @click="() => colorChange(color)"
              >
              <i :data-color="JSON.stringify(color)" class="material-icons" v-show="color.isActive">check</i>
            </button>
          </div>
        </article>
        <button class="apply" @click="saveChanges">Apply</button>
    </modal>
</template>
<script>
import Modal from "./Modal";
export default {
    emits: ['close-modal', 'open-modal', 'color-changed', 'font-changed', 'save-changes'],
    props: ['hideModal', 'colors', 'fonts', 'timeLimits'],
    name: 'Settings',
    data() {
      return {
        selectedColor: null,
        selectedFont: null
      }
    },
    components: {
      Modal
    },
    methods: {
        openModal() {
          this.$emit('open-modal');
        },
        closeModal() {
            this.$emit('close-modal');
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
            this.$emit('color-changed', color);
          }
        },
        fontChange(font) {
          if (!this.isCurrentFont(font)) {
            this.selectedFont = font;
            this.$emit('font-changed', font);
          }
        },
        formatTimeLimits() {
          const timeLimits = [];
          for (const property in this.$refs) {
            timeLimits.push({
              name: property,
              value: this.$refs[property].value
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
        }
    }
}
</script>
<style>
.settings {
    background: none;
    border: none;
    text-align: center;
    width: 60px;
    height: 60px;
    display: block;
    position: absolute;
    bottom: 3rem;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    outline-color: var(--active-color);
  }

  @media (min-width: 601px) {
    .settings {
      left: unset;
      right: 2rem;
      top: 2rem;
      bottom: unset;
      transform: unset;
    }
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

  .time-setting {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.6rem;
  }

  .time-setting label {
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--text-dark-color);
  }

  .time-setting input {
    border: 1px solid rgba(0,0,0,.1);
    padding: 0.5rem;
    border-radius: 5px;
    background: var(--white-background);
    color: black;
    font-weight: 600;
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
    font-size: 1rem;
    border-radius: 50%;
    background: var(--white-background);
    border: none;
    color: #a2a4b2;
    font-weight: 600;
    transition: all 0.3s ease-in-out;
    text-align: center;
  }

  .font-setting.active, .font-setting:focus, .font-setting:hover {
    background: var(--dark-color);
    color: white;
  }

  .font-setting:focus {
    outline: 2px dashed var(--text-color);
  }

  .font-setting i {
    color: var(--main-color);
    font-weight: 300;
  }

  .font-setting:not(:last-child) {
    margin-right: 1rem;
  }

  .apply {
    background: var(--active-color);
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 23px;
    font-size: 1.2rem;
    position: absolute;
    bottom: -1.4rem;
    cursor: pointer;
    font-weight: 500;
    transition: color 233ms ease-in-out;
  }

  .apply:hover {
    color: var(--dark-color);
  }
</style>