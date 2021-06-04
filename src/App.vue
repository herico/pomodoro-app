<template>
  <div class="container">
    <h1 class="title">{{ title }}</h1>
    <Nav :tabs="tabs" @change-tab="changeTab"/>
    <keep-alive>
      <component 
        :is="currentTabComponent"
        :pomodoro-limit="pomodoroLimit"
        :long-break-limit="longBreakLimit"
        :short-break-limit="shortBreakLimit"
      ></component>
    </keep-alive>
    <Settings
      :fonts="fonts"
      :colors="colors"
      :timeLimits="timeLimits"
      :hide-modal="hideModal"
      @save-changes="saveChanges"
      @font-changed="fontChanged"
      @color-changed="colorChanged"
      @open-modal="hideModal = false" 
      @close-modal="hideModal = true"/>
  </div>
</template>

<script>
  import Pomodoro from "./components/pomodoro/pomodoro";
  import LongBreak from "./components/pomodoro/longBreak";
  import ShortBreak from "./components/pomodoro/shortBreak";
  import Nav from "./components/shared/Nav";
  import Settings from "./components/shared/Settings";
  import { getInitialState } from "./config/settings";
  import Storage from "./utils/storage";

  const { timeLimits, colors, fonts } = getInitialState();
  export default {
    name: 'App',
    data() {
      return {
        title: 'Hack your productivity',
        hideModal: true,
        root: null,
        body: null,
        tabs: [{
            isActive: true,
            text: 'pomodoro',
            component: 'Pomodoro'
          },
          {
            isActive: false,
            text: 'short break',
            component: 'ShortBreak'
          },
          {
            isActive: false,
            text: 'long break',
            component: 'LongBreak'
          }
        ],
        colors: [ ...colors ],
        fonts: [ ...fonts ],
        timeLimits: [ ...timeLimits ],
        storage: new Storage('localStorage')
      }
    },
    computed: {
      currentTabComponent() {
        const currentComponent = this.tabs.find(n => n.isActive).component;
        return currentComponent;
      },
      pomodoroLimit() {
        return this.timeLimits.find(timeLimit => timeLimit.name === 'pomodoro').value * 60;
      },
      shortBreakLimit() {
        return this.timeLimits.find(timeLimit => timeLimit.name === 'shortBreak').value * 60;
      },
      longBreakLimit() {
        return this.timeLimits.find(timeLimit => timeLimit.name === 'longBreak').value * 60;
      },
      currentColor() {
        return this.colors.find(color => color.isActive);
      },
      currentFont() {
        return this.fonts.find(font => font.isActive);
      }
    },
    methods: {
      changeTab(tab) {
        if (tab.isActive) return;
        this.tabs = this.tabs.map(tabItem => {
          if (tab.text === tabItem.text) {
            tabItem.isActive = true
          } else {
            tabItem.isActive = false
          }
          return tabItem;
        })
      },
      colorChanged(selectedColor) {
        this.colors = this.colors.map(color => {
          if (selectedColor.name === color.name) {
            color.isActive = true;
          } else {
            color.isActive = false;
          }
          return color;
        });
        this.storage.setItem('colors', this.colors);
      },
      setColor(color) {
        this.root.style.setProperty('--active-color', color.hexCode);
      },
      fontChanged(selectedFont) {
        this.fonts = this.fonts.map(font => {
          if (selectedFont.name === font.name) {
            font.isActive = true;
          } else {
            font.isActive = false;
          }
          return font;
        });
        this.storage.setItem('fonts', this.fonts);
      },
      setFont(font) {
        this.body.className = font.className;
      },
      applyNewTimeLimits(newTimeLimits = []) {
        this.timeLimits = this.timeLimits.map(timeLimit => {
          const index = newTimeLimits.findIndex(newTimeLimit => newTimeLimit.name === timeLimit.name);
          if (index >= 0 && +newTimeLimits[index].value !== timeLimit.value) {
            timeLimit.value = +newTimeLimits[index].value;
          }
          return timeLimit;
        });
        this.storage.setItem('timeLimits', this.timeLimits);
      },
      saveChanges({ color, font, timeLimits }) {
        if (color) this.setColor(color);
        if (font) this.setFont(font);
        if (timeLimits) this.applyNewTimeLimits(timeLimits)
        this.hideModal = true;
      }
    },
    components: {
      Pomodoro,
      ShortBreak,
      LongBreak,
      Settings,
      Nav
    },
    mounted() {
      this.root = document.querySelector(':root');
      this.body = document.querySelector('body');
      this.setColor(this.currentColor);
      this.setFont(this.currentFont);
    }
  }
</script>

<style>
  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    --main-color: #1e2140;
    --main-title-color: white;
    --text-color: #a2a4b2;
    --text-dark-color: #49494b;
    --dark-color: #151932;
    --light-color: #242951;
    --active-color: #da7ffc;
    --white-background: #eef1fa;
    --modal-overlay-bg-color: #1e2140cf;
    --disabled-color: #64656e;
    --error-color: rgb(246, 109, 109);
    --timer-dimension: 240px;
    --timer-font-size: 3.2rem;
    font-size: 16px;
  }

  @media (min-width: 1024px) {
    html {
      --timer-dimension: 300px;
      --timer-font-size: 3.8rem;
    }
  }

  body {
    font-family: 'Poppins', sans-serif;
  }

  body.monserrat {
    font-family: 'Montserrat', sans-serif;
  }

  body.fira-sans {
    font-family: 'Montserrat', sans-serif;
  }

  .container {
    background: var(--main-color);
    min-width: 100%;
    min-height: 100vh;
    overflow-y: auto;
    position: relative;
  }

  .title {
    color: var(--main-title-color);
    padding: 30px 0;
    text-align: center;
    font-size: 1.6rem;
    font-weight: 500;
    letter-spacing: 0.01rem;
  }
</style>