<template>
    <Timer @timer-paused="timerPaused" :limit="shortBreakLimit"/>
</template>
<script>
import Timer from "../Timer";
export default {
    name: 'ShortBreak',
    props: ['shortBreakLimit'],
    components: {
        Timer
    },
    methods: {
        timerPaused(newValue) {
            console.log(newValue);
        }
    }
}
</script>