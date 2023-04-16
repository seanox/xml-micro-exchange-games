const VIEW_INTRODUCTION = "introduction";
const VIEW_SETTINGS     = "settings";
const VIEW_INVITATION   = "invitation";
const VIEW_DESK         = "desk";
const VIEW_SCORE        = "score";

const game = Reactive({
    get name() {
        return GAME_MEMORY;
    },
    get disabled() {
        return undefined;
    },
    init() {
        this.view = VIEW_INTRODUCTION;
    },
    dispose() {
        const node = document.getElementById("game@" + game.name);
        node.parentNode.removeChild(node);
    },
    undock() {
    },
    view: VIEW_INTRODUCTION,
    get markup() {
        const resource = `${Composite.MODULES}/${game.name}/views/${this.view}.html`;
        const markup = Composite.load(resource).trim();
        const template = document.createElement("template");
        template.innerHTML = markup;
        return template.content.firstChild;
    },
    introduction: {
        next: {
            onClick(event) {
                game.view = VIEW_SETTINGS;
            }
        }
    },
    settings: {
        next: {
            onClick(event) {
                game.view = VIEW_INVITATION;
            }
        }
    },
    invitation: {
        next: {
            onClick(event) {
                game.view = VIEW_DESK;
            }
        }
    },
    desk: {
        next: {
            onClick(event) {
                game.view = VIEW_SCORE;
            }
        }
    },
    score: {
        next: {
            onClick(event) {
                game.view = VIEW_INTRODUCTION;
            }
        }
    },
    abort: {
        onClick(event) {
            game.dispose();
        }
    }
});

#export game@memory;
