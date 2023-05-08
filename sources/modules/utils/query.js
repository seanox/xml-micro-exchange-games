const LOCATION = window.location.href
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "");

const query = {
    create(meta) {
        const parameters = new URLSearchParams();
        const collect = (name, value, manipulate) => {
            value = String(value || "");
            if (typeof manipulate === "function")
                value = manipulate.call(value);
            value = value.trim();
            if (value)
                parameters.append(name, value);
        }
        collect("game", meta.game, String.prototype.toLowerCase());
        collect("options", meta.options);
        Array.from(meta.players || [])
            .filter(player =>
                player.trim().length > 0)
            .forEach((player) =>
                collect("players", player));
        const query = parameters.toString();
        return LOCATION + (query ? "?" + query : "");
    },
    read() {
        const searchParams = (new URL(document.location)).searchParams;
        if (!String(searchParams))
            return;
        const meta = {};
        if (searchParams.has("game"))
            meta.game = searchParams.get("game");
        if (searchParams.has("options"))
            meta.options = searchParams.get("options");
        if (searchParams.has("players"))
            meta.players = searchParams.getAll("players");
        if (searchParams.has("player"))
            meta.player = searchParams.get("player");
        return meta;
    },
    update(meta) {
        const url = this.create(meta);
        const object = {title: document.title, url:url};
        window.history.replaceState(object, object.title, object.url);
    },
    delete() {
        const url = LOCATION;
        const object = {title: document.title, url:url};
        window.history.replaceState(object, object.title, object.url);
    }
};

#export query@utils;
