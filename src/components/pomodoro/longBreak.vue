<template>
    <Timer :limit="longBreakLimit"/>
</template>
<script>
import Timer from "../Timer";
export default {
    name: 'LongBreak',
    props: ['longBreakLimit'],
    components: {
        Timer
    }
}
</script>