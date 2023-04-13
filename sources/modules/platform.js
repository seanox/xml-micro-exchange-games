// I have not yet found a way to determine the modules dynamically.
// The directory index would be a possibility, but that can be disabled and then
// it doesn't work.

const GAME_MEMORY = "memory";
const GAME_RUMMY = "rummy";
const GAME_SNAKE = "snake";

const platform = Reactive({
    get games() {
        // resources of the games are preloaded
        // e.g. the texts are necessary for the use in the selection
        const games = [GAME_MEMORY, GAME_RUMMY, GAME_SNAKE];
        games.forEach(game => {
            Composite.include(...[game, "game"]);
            Object.defineProperty(window[game]["game"], "name", {
                value: game
            });
        });
        return games.map(game => window[game]["game"]);
    }
});

#export platform;
