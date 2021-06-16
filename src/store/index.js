import { createStore } from 'vuex'
// Create a new store instance.
const store = createStore({
  state () {
    return {
      hideModal: true,
      timerStatus: {
        active: false,
        running: false,
        stopped: false,
        ended: false,
        paused: false,
        timerCounts: 0
      },
      currentActiveTab: 'pomodoro',
    }
  },
  mutations: {
    openModal(state) {
      state.hideModal = false;
    },
    closeModal(state) {
      state.hideModal = true;
    },
    startTimer(state) {
      state.timerStatus.stopped = false;
      state.timerStatus.ended = false;
      state.timerStatus.paused = false;
      state.timerStatus.active = true;
      state.timerStatus.running = true;
    },
    pauseTimer(state) {
      state.timerStatus.running = false;
      state.timerStatus.stopped = false;
      state.timerStatus.ended = false;
      state.timerStatus.paused = true;
    },
    endTimer(state) {
      state.timerStatus.active = false;
      state.timerStatus.running = false;
      state.timerStatus.paused = false;
      state.timerStatus.stopped = false;
      state.timerStatus.ended = true;
      state.timerStatus.timerCounts = state.timerStatus.timerCounts + 1;
    },
    stopTimer(state) {
      state.timerStatus.active = false;
      state.timerStatus.running = false;
      state.timerStatus.paused = false;
      state.timerStatus.ended = false;
      state.timerStatus.stopped = true;
    }
  },
  actions: {
    openModal({ commit }) {
      commit('openModal')
    },
    closeModal({ commit }) {
      commit('closeModal')
    },
    startTimer({ commit }) {
      commit('startTimer')
    },
    pauseTimer({ commit }) {
      commit('pauseTimer')
    },
    endTimer({ commit }) {
      commit('endTimer');
    },
    stopTimer({ commit }) {
      commit('stopTimer');
    }
  }
});

export default store;