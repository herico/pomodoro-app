<template>
    <div class="clock-container">
        <div class="base-timer">
            <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer__circle">
                    <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" />
                    <path ref="remainingTime" id="base-timer-path-remaining" :stroke-dasharray="FULL_DASH_ARRAY"
                        class="base-timer__path-remaining" d="
                        M 50, 50
                        m -45, 0
                        a 45,45 0 1,0 90,0
                        a 45,45 0 1,0 -90,0
                        "></path>
                </g>
            </svg>
            <div class="base-timer__texts" @click="handleTimer">
                <span class="base-timer__label">{{ formatTimeLeft }}</span>
                <span class="base-timer__action">{{ timerText }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import kitchenTimerMp3 from "../assets/audio/kichen-timer.mp3";
    export default {
        name: 'Timer',
        props: {
            limit: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                timeLeft: this.limit,
                timePassed: 0,
                timerInterval: null,
                FULL_DASH_ARRAY: 283,
                circleDasharray: '',
                TIMER_TEXTS: {
                    start: 'Start',
                    pause: 'Pause',
                    paused: 'Paused'
                },
                timerText: ''
            }
        },
        methods: {
            startTimer() {
                window.navigator.vibrate(200);
                this.timerInterval = setInterval(() => {
                    this.timePassed = this.timePassed += 1;
                    this.timeLeft = this.limit - this.timePassed;
                    this.timerText = this.TIMER_TEXTS.pause;
                    if (this.timeLeft === 0) {
                        this.$store.dispatch('endTimer');
                    }
                    this.setCircleDasharray();
                }, 1000);
            },
            // Divides time left by the defined time limit.
            calculateTimeFraction() {
                const rawTimeFraction = this.timeLeft / this.limit;
                return rawTimeFraction - (1 / this.limit) * (1 - rawTimeFraction);
            },

            // Update the dasharray value as time passes, starting with 283
            setCircleDasharray() {
                const circleDasharray = `${(
                this.calculateTimeFraction() * this.FULL_DASH_ARRAY
            ).toFixed(0)} ${this.FULL_DASH_ARRAY}`;
                this.circleDasharray = circleDasharray;
                this.$refs.remainingTime
                    .setAttribute("stroke-dasharray", circleDasharray);
            },
            pauseTimer() {
                window.navigator.vibrate(200);
                clearInterval(this.timerInterval);
                this.timerInterval = null;
                this.timerText = this.TIMER_TEXTS.paused;
            },
            stopTimer() {
                this.resetTimer();
            },
            resetTimer() {
                this.timeLeft = this.limit;
                this.timePassed = 0;
                clearInterval(this.timerInterval);
                this.timerInterval = null;
                this.timerText = this.TIMER_TEXTS.start;
                this.setCircleDasharray();
            },
            handleTimer() {
                if (!this.timerInterval) {
                   this.$store.dispatch('startTimer');
                } else if (this.timerInterval && this.timePassed) {
                    this.$store.dispatch('pauseTimer');
                }
            },
            playAudio() {
                const audio = new Audio(kitchenTimerMp3);
                audio.play();
            }
        },
        computed: {
            formatTimeLeft() {
                const minutes = Math.floor(this.timeLeft / 60);
                let seconds = this.timeLeft % 60;
                if (seconds < 10) {
                    seconds = `0${seconds}`;
                }
                return `${minutes}:${seconds}`;
            },
            isTimerRunning() {
                return this.$store.state.timerStatus.running;
            },
            isTimerPaused() {
                return this.$store.state.timerStatus.paused;
            },
            hasTimerEnded() {
                return this.$store.state.timerStatus.ended;
            },
            isTimerStopped() {
                return this.$store.state.timerStatus.stopped;
            }
        },
        watch: {
            limit(newValue) {
                this.timeLeft = newValue;
            },
            isTimerRunning(flag) {
                if (flag) {
                    this.startTimer();
                }
            },
            isTimerPaused(flag) {
                if (flag) this.pauseTimer();
            },
            hasTimerEnded(flag) {
                if (flag) {
                    this.playAudio();
                    this.resetTimer();
                }
            },
            isTimerStopped(flag) {
                if (flag) this.stopTimer();
            }
        },
        mounted() {
            this.timerText = this.TIMER_TEXTS.start;
        },
        unmounted() {
            clearInterval(this.timerInterval);
        }
    }
</script>

<style scoped>
    .clock-container {
        width: var(--timer-dimension, 260px);
        height: var(--timer-dimension, 260px);
        margin: 80px auto;
        border-radius: 50%;
        background: var(--dark-color);
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--text-color);
        font-size: var(--timer-font-size, 3.2rem);
        font-weight: 700;
        text-align: center;
        letter-spacing: 0.1rem;
        cursor: pointer;
        position: relative;
    }

    .clock-container::before {
        position: absolute;
        content: "";
        width: 100%;
        border-radius: 50%;
        height: 100%;
        border: 1.2rem solid transparent;
        border-top-color: var(--light-color);
        border-right-color: var(--light-color);
        border-left-color: var(--light-color);
        border-bottom-color: var(--dark-color);
        box-shadow: -3px 5px 20px 11px rgba(36, 41, 81, 0.83);
        -webkit-box-shadow: -3px 5px 20px 11px rgba(36, 41, 81, 0.83);
        -moz-box-shadow: -3px 5px 20px 11px rgba(36, 41, 81, 0.83);
        transform: rotate(165deg);
    }

    /* Sets the containers height and width */
    .base-timer {
        position: relative;
        height: 100%;
        width: 100%;
    }

    /* Removes SVG styling that would hide the time label */
    .base-timer__circle {
        fill: none;
        stroke: none;
    }

    /* The SVG path that displays the timer's progress */
    .base-timer__path-elapsed {
        stroke-width: 3px;
        stroke: transparent;
    }

    .base-timer__texts {
        position: absolute;

        /* Size should match the parent container */
        width: 100%;
        height: 100%;

        /* Keep the label aligned to the top */
        top: 0;

        /* Create a flexible box that centers content vertically and horizontally */
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .base-timer__label {
        font-size: var(--timer-font-size, 3.2rem);
    }

    .base-timer__action {
        font-size: 1.2rem;
    }

    .base-timer__path-remaining {
        /* Just as thick as the original ring */
        stroke-width: 3px;

        /* Rounds the line endings to create a seamless circle */
        stroke-linecap: round;

        /* Makes sure the animation starts at the top of the circle */
        transform: rotate(90deg);
        transform-origin: center;

        /* One second aligns with the speed of the countdown timer */
        transition: 1s linear all;

        /* Allows the ring to change color when the color value updates */
        stroke: var(--active-color);
    }

    .base-timer__svg {
        /* Flips the svg and makes the animation to move left-to-right */
        transform: scaleX(-1);
    }
</style>