const game = Reactive({
    get name() {
        return GAME_RUMMY;
    },
    get disabled() {
        return true;
    }
});

#export game@rummy;
