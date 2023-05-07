#import utils/observer;
#import utils/query;

const VIEW_INTRODUCTION = "introduction";
const VIEW_SETTINGS = "settings";
const VIEW_INVITATION = "invitation";
const VIEW_DESK = "desk";
const VIEW_SCORE = "score";

const snake = Reactive({
    get name() {
        return GAME_SNAKE;
    },
    get disabled() {
        return true;
    },
    init() {
    },
    dispose() {
    }
});

const game = utils.observer(snake, {
});

#export game@games.snake;
