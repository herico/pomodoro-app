<template>
    <Timer :limit="pomodoroLimit"/>
</template>
<script>
import Timer from "../Timer";
export default {
    name: 'Pomodoro',
    props: ['pomodoroLimit'], // Use a computed value from App.vue
    components: {
        Timer
    }
}
</script>