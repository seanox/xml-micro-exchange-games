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
    dock() {
        game.view = VIEW_INTRODUCTION;
        game.settings.players = ["", "", "", ""];
    },
    dispose() {
        const node = document.getElementById("game@" + game.name);
        node.parentNode.removeChild(node);
    },
    undock() {
    },
    view: null,
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
        players: null,
        get playersCount() {
            return this.players.filter(player =>
                new RegExp(game.settings.playersPattern).test(player)).length;
        },
        get playersPattern() {
            return "^[\\w\\xC4\\xE4\\xD6\\xF6\\xDC\\xFC-]{1,8}$";
        },
        get organizer() {
            return this.players.find(player =>
                new RegExp(game.settings.playersPattern).test(player));
        },
        back: {
            onClick(event) {
                game.view = VIEW_INTRODUCTION;
            }
        },
        next: {
            onClick(event) {
                game.view = VIEW_INVITATION;
            }
        }
    },
    invitation: {
        back: {
            onClick(event) {
                game.view = VIEW_SETTINGS;
            }
        },
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
