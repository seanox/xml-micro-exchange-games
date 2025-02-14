// import of runtime extensions
#import utils/query;

const VIEW_INTRODUCTION = "introduction";
const VIEW_SETTINGS = "settings";
const VIEW_INVITATION = "invitation";
const VIEW_DESK = "desk";
const VIEW_SCORE = "score";

const DECK_ABSTRACT = "abstract";
const DECK_MEMORY = "memory";
const DECK_INVERSE = "inverse";

const DECKS = [DECK_ABSTRACT, DECK_MEMORY, DECK_INVERSE];

const UNIQUE = Math.serial();

const _create_invitation_text = () => {
    const title = String(messages.games.memory.deck[game.settings.deck].title)
        .replace(/\s+/g, " ");
    const text = String(messages.games.memory.deck[game.settings.deck].text)
        .replace(/\s+/g, " ");
    const description = String(messages.games.memory.introduction.text)
        .replace(/\s+/g, " ");
    const privacy = String(messages.platform.privacy.text)
        .replace(/\s+/g, " ");
    let invitation = "";
    game.invitation.links.forEach(link => {
        invitation += `${link.player} ${link.url}\r\n`
    });
    const mail = Messages.customize("games.memory.invitation.mail",
        title, text, description, invitation.trim(), privacy);
    return mail.replace(/([\r\n])( +)/g, "$1");
};

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
        game.settings.deck = null;

        const meta = utils.query.read();
        if (meta && meta.length > 0 && meta[0] === GAME_MEMORY) {
            if (meta.length > 1) {
                game.view = VIEW_SETTINGS;
                if (meta.length > 1
                        && DECKS.includes(meta[1]))
                    game.settings.deck = meta[1];
                for (let index = 0; index < game.settings.players.length; index++)
                    if (meta.length > 2 +index)
                        game.settings.players[index] = meta[2 +index];
                if (meta.length > 7 && meta[6] && meta[7]) {
                    game.view = VIEW_DESK;
                    window.setTimeout(() => game.join(), 0);
                }
            }
        }

        if (game.view !== VIEW_DESK)
            utils.query.update([
                game.name,
                game.settings.deck,
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
                game.settings.deck = event.currentTarget.id.match(Composite.PATTERN_ELEMENT_ID)[3];
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
                    links.push({player, url: `${link}/${index +1}/${UNIQUE}`}));
            return links;
        },
        back: {
            onClick(event) {
                game.view = VIEW_SETTINGS;
            }
        },
        copy: {
            onClick(event) {
                const unique = event.currentTarget.id.match(Composite.PATTERN_ELEMENT_ID)[3];
                const text = unique ? game.invitation.links[unique -1].url
                        : _create_invitation_text();
                navigator.clipboard.writeText(text);
            }
        },
        send: {
            onClick(event) {
                const subject = encodeURIComponent(Messages.customize("platform.mail.title",
                    messages.games.memory.title, messages.games.memory.invitation.title));
                const body = encodeURIComponent(_create_invitation_text());
                window.location.href = "mailto:?subject=" + subject + "&body=" + body;
            },
        },
        play: {
            onClick(event) {
                game.view = VIEW_DESK;
                const unique = event.currentTarget.id.match(Composite.PATTERN_ELEMENT_ID)[3];
                utils.query.update([
                    game.name,
                    game.settings.deck,
                    game.settings.players,
                    unique,
                    UNIQUE]);
                window.setTimeout(() => game.join(), 0);
            }
        }
    },
    join() {
    },
    wait() {
    },
    play() {
    },
    score() {
    }
});

#export game@games.memory;
