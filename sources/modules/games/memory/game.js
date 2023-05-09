// import of runtime extensions
#import utils/query;

const VIEW_INTRODUCTION = "introduction";
const VIEW_SETTINGS = "settings";
const VIEW_INVITATION = "invitation";
const VIEW_DESK = "desk";
const VIEW_SCORE = "score";

const DESK_ABSTRACT = "abstract";
const DESK_MEMORY = "memory";
const DESK_INVERSE = "inverse";

const DESKS = [DESK_ABSTRACT, DESK_MEMORY, DESK_INVERSE];

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

        const meta = utils.query.read();
        if (meta && meta.length > 0 && meta[0] === GAME_MEMORY) {
            if (meta.length > 1) {
                game.view = VIEW_SETTINGS;
                if (meta.length > 1
                        && DESKS.includes(meta[1]))
                    game.settings.deck = meta[1];
                for (let index = 0; index < game.settings.players.length; index++)
                    if (meta.length > 2 +index)
                        game.settings.players[index] = meta[2 +index];
            }
        }

        utils.query.update([
            game.name,
            game.settings.desk,
            game.settings.players]);
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
            const link = utils.query.create([
                game.name,
                game.settings.deck,
                game.settings.players]);
            const links = [];
            game.settings.players
                .filter(player => player.length > 0)
                .forEach((player, index) =>
                    links.push({player, url: link + "&player=" + (index + 1)}));
            return links;
        },
        back: {
            onClick(event) {
                game.view = VIEW_SETTINGS;
            }
        },
        copy: {
            onClick(event) {
            }
        },
        send: {
            onClick(event) {
                const title = String(messages.games.memory.deck[game.settings.deck].title)
                    .replace(/\s+/g, " ");
                const text = String(messages.games.memory.deck[game.settings.deck].text)
                    .replace(/\s+/g, " ");
                const description = String(messages.games.memory.introduction.text)
                    .replace(/\s+/g, " ");
                const privacy = String(messages.platform.privacy.text)
                    .replace(/\s+/g, " ");
                const mail = Messages.customize("games.memory.invitation.mail",
                    title, text, description, links, privacy);
                alert(mail.replace(/([\r\n])( +)/g, "$1"));
            },
        },
        play: {
            onClick(event) {
            }
        }
    },
    validate() {
        // abuse to change the query with changes of the settings
        // it was easier than implementing additional proxies and observers
        // because the data is synchronized after validation (view -> model),
        // this must be done with the next process step
        window.setTimeout(() =>
            utils.query.update([
                game.name,
                game.settings.deck,
                game.settings.players]), 0);
        return true;
    },
    abort: {
        onClick(event) {
            game.dispose();
        }
    }
});

#export game@games.memory;
