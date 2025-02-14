// import of runtime extensions
#import utils/query;

const VIEW_INTRODUCTION = "introduction";
const VIEW_SETTINGS = "settings";
const VIEW_INVITATION = "invitation";
const VIEW_DESK = "desk";
const VIEW_SCORE = "score";

const game = Reactive({
    get name() {
        return GAME_SNAKE;
    },
    get disabled() {
        return true;
    },
    init() {
    },
    dispose() {
    },
    undock() {
    }
});

#export game@games.snake;
