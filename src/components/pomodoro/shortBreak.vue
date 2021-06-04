<template>
    <Timer :limit="shortBreakLimit"/>
</template>
<script>
import Timer from "../Timer";
export default {
    name: 'ShortBreak',
    props: ['shortBreakLimit'],
    components: {
        Timer
    }
}
</script>