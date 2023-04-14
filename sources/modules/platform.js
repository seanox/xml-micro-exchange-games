// I have not yet found a way to determine the modules dynamically.
// The directory index would be a possibility, but that can be disabled and then
// it doesn't work.

const GAME_MEMORY = "memory";
const GAME_RUMMY = "rummy";
const GAME_SNAKE = "snake";

#export GAME_MEMORY GAME_RUMMY GAME_SNAKE;

// which should not be public,
// is used as a variable in the private scope
// TODO:

const platform = Reactive({
    get games() {
        // resources of the games are preloaded
        // e.g. the texts are necessary for the use in the selection
        const games = [GAME_MEMORY, GAME_RUMMY, GAME_SNAKE];
        games.forEach(game =>
            Composite.include(...[game, "game"]));
        return games.map(game => window[game]["game"]);
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

#export platform;
