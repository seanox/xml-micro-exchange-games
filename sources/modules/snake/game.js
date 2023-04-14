const game = Reactive({
    get name() {
        return GAME_SNAKE;
    },
    get disabled() {
        return true;
    }
});

#export game@snake;
