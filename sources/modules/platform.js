// import of runtime extensions
#import utils/query;

// I have not yet found a way to determine the modules dynamically.
// The directory index would be a possibility, but that can be disabled and then
// it doesn't work.
const GAME_MEMORY = "memory";
const GAME_RUMMY = "rummy";
const GAME_SNAKE = "snake";

#export GAME_MEMORY GAME_RUMMY GAME_SNAKE;

// Patterns are strings so that they can also be used in markup.
const PATTERN_PLAYER_ALIAS = "^[0-9a-zA-Z\\xC4\\xE4\\xD6\\xF6\\xDC\\xFC]{1,8}$";

#export PATTERN_PLAYER_ALIAS;

const GAMES = [GAME_MEMORY, GAME_RUMMY, GAME_SNAKE];

const platform = Reactive({
    dock() {
        const meta = utils.query.read();
        if (meta && meta.length > 0 && GAMES.includes(meta[0]))
            platform.selection = meta[0];
    },
    get games() {
        // resources of the games are preloaded
        // e.g. the texts are necessary for the use in the selection
        const games = Array.from(GAMES);
        games.forEach(game =>
            Composite.include(...["games", game, "game"]));
        return games.map(game => window["games"][game]["game"]);
    },
    selection: null,
    select: {
        onClick(event) {
            platform.selection = event.currentTarget.id.replace(/^.*#/, "");
        }
    }
});

// Modules delete themselves from the view at the end, which automatically
// resets the platform selection.
Composite.listen(Composite.EVENT_MODULE_UNDOCK, () => {
    platform.selection = null;
});

// in case of manual changes the page should be reloaded
// without SiteMap this is easier, because you don't have to care about the
// status of the view(s).
window.addEventListener("hashchange",
    () => window.location.reload(), false);

#export platform;
