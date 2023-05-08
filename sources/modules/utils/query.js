const LOCATION = window.location.href
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "");

const _parse = (query) => {
};

const _create = (meta) => {

    const parameters = [];

    const collect = (name, value, manipulate) => {
        value = String(value || "");
        if (typeof manipulate === "function")
            value = manipulate.call(value);
        value = value.trim();
        if (value)
            parameters.push(window.encodeURIComponent(name)
                + "=" + window.encodeURIComponent(value));
    }

    collect("game", meta.game, String.prototype.toLowerCase());
    collect("options", meta.options);
    Array.from(meta.players || [])
        .filter(player =>
            player.trim().length > 0)
        .forEach((player) =>
            collect("players", player));
    return parameters.join("&");
};

const query = {
    create(meta) {
        const query = _create(meta);
        return LOCATION + (query ? "?" + query : "");
    },
    read() {
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
