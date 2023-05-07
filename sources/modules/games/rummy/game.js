#import utils/observer;
#import utils/query;

const VIEW_INTRODUCTION = "introduction";
const VIEW_SETTINGS = "settings";
const VIEW_INVITATION = "invitation";
const VIEW_DESK = "desk";
const VIEW_SCORE = "score";

const rummy = Reactive({
    get name() {
        return GAME_RUMMY;
    },
    get disabled() {
        return true;
    },
    dock() {
    },
    dispose() {
    },
    undock() {
    }
});

const game = utils.observer(rummy, {
});

#export game@games.rummy;
