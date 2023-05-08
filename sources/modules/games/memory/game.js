// import of runtime extensions
#import utils/query;

const VIEW_INTRODUCTION = "introduction";
const VIEW_SETTINGS = "settings";
const VIEW_INVITATION = "invitation";
const VIEW_DESK = "desk";
const VIEW_SCORE = "score";

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
        game.settings.desk = null;
        utils.query.update({
            game:game.name,
            options:game.settings.desk,
            players:game.settings.players});
    },
    dispose() {
        const node = document.getElementById("game@games:" + game.name);
        node.parentNode.removeChild(node);
    },
    undock() {
    },
    view: null,
    get markup() {
        const resource = `${Composite.MODULES}/games/${game.name}/views/${game.view}.html`;
        const template = document.createElement("template");
        template.innerHTML = Composite.load(resource).trim();
        return template.content.childNodes;
    },
    introduction: {
        next: {
            onClick(event) {
                game.view = VIEW_SETTINGS;
            }
        }
    },
    settings: {
        deck: null,
        players: null,
        get playersCount() {
            return game.settings.players.filter(player =>
                new RegExp(PATTERN_PLAYER_ALIAS).test(player)).length;
        },
        decks: {
            onClick(event) {
                game.settings.deck = event.currentTarget.id.replace(/^.*#/, "");
            }
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
        get disabled() {
            if (!game.settings.deck)
                return true;
            if (game.settings.playersCount < 2)
                return true;
            const pattern = new RegExp(PATTERN_PLAYER_ALIAS);
            for (let index = 0; index < game.settings.players.length; index++)
                if (!pattern.test(game.settings.players[index])
                        && game.settings.players[index].length)
                    return true;
            return undefined;
        },
        get links() {
            const link = utils.query.create({
                game:game.name,
                options:game.settings.deck,
                players:game.settings.players});
            const links = [];
            game.settings.players
                .filter(player => player.length > 0)
                .forEach((player, index) =>
                    links.push({player, url:link + "&player=" + (index +1)}));
            return links;
        }
    },
    validate() {
        // abuse to change the query with changes of the settings
        // it was easier than implementing additional proxies and observers
        // at the time the data are not yet synchronized (view -> model) this
        // must be done with the next process step
        window.setTimeout(() =>
            utils.query.update({
                game:game.name,
                options:game.settings.deck,
                players:game.settings.players}), 0);
        return true;
    },
    abort: {
        onClick(event) {
            game.dispose();
        }
    }
});

#export game@games.memory;
