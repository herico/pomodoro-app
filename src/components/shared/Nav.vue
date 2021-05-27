<template>
    <ul class="tabs">
      <li v-for="tab in tabs" @click="changeTab(tab)" :key="tab.text" :class="['tab', tab.isActive ? 'active': '']">
        <a class="tab-link" href="#">{{ tab.text }}</a>
      </li>
    </ul>
</template>
<script>
export default {
    emits: ['change-tab'],
    props: {
        tabs: {
            type: Array,
            required: true
        }
    },
    methods: {
        changeTab(tab) {
            this.$emit('change-tab', tab);
        }
    }
}
</script>
<style scoped>
  .tabs {
    background: var(--dark-color);
    display: flex;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    list-style: none;
    width: 90%;
    max-width: 320px;
    margin: 0 auto 40px;
    border-radius: 60px;
    height: 60px;
  }

  .tab {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 85%;
    width: 30%;
    margin: auto;
  }

  .tab.active {
    border-radius: 100px;
    background: var(--active-color);
  }

  .tab.active .tab-link {
    color: var(--dark-color);
    font-weight: 700;
  }

  .tab-link {
    color: var(--text-color);
    font-size: 0.8rem;
    text-decoration: none;
  }
</style>