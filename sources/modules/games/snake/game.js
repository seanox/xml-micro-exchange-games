#import utils/observer;

const VIEW_INTRODUCTION = "introduction";
const VIEW_SETTINGS = "settings";
const VIEW_INVITATION = "invitation";
const VIEW_DESK = "desk";
const VIEW_SCORE = "score";

let game = {
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
};

game = Reactive(game);
game = Observer(game);

#export game@games.snake;
