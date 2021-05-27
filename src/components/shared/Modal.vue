<template>
  <div class="overlay">
    <div :class="['modal', hideModal ? 'hide': '']">
      <div class="modal-header">
        <h3 class="modal-title">Settings</h3>
        <button class="modal-close" @click="closeModal">
          <i class="material-icons">close</i>
        </button>
      </div>
      <div class="modal-content">
        <slot>No Content</slot>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    emits: ['closeModal', 'openModal'],
    name: 'Modal',
    props: {
      hideModal: {
        required: true,
        type: Boolean
      }
    },
    methods: {
      closeModal() {
        this.$emit('close-modal');
      }
    }
  }
</script>
<style>
  .overlay {
    display: flex;
    justify-items: center;
    align-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: transparent;
    pointer-events: none;
  }

  .modal {
    max-width: 600px;
    width: 96%;
    min-height: 360px;
    background: white;
    border-radius: 13px;
    padding: 1.6rem;
    z-index: 6000;
    pointer-events: initial;
    margin: 0 auto;
    position: relative;
  }

  @media (min-width: 1024px) {
    .modal {
      min-height: 400px;
    }
  }

  .modal.hide {
    display: none;
    visibility: hidden;
    opacity: 0;
  }

  .modal-header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    position: relative;
    margin-bottom: 2rem;
  }

  .modal-header::after {
    position: absolute;
    bottom: -10px;
    content: "";
    height: 0.100rem;
    width: 100%;
    background: rgba(0, 0, 0, .1);
  }

  .modal-title {
    font-size: 1.287rem;
    font-weight: 500;
    color: var(--text-dark-color);
  }

  .modal-close {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .modal-close i {
    font-size: 1.987rem;
    font-weight: 400;
    color: var(--text-color);
    transition: color 0.6s ease-in-out;
  }

  .modal-close:hover>i,
  .modal-close:focus>i {
    color: var(--text-dark-color);
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }
</style>