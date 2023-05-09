const LOCATION = window.location.href
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "");

const _create = (data) => {
    if (!Array.isArray(data))
        data = [];
    if (data.length <= 0)
        return "";
    const meta = [];
    data.forEach(data => {
        if (!Array.isArray(data)) {
            if (data === null
                    || data === undefined)
                data = "";
            meta.push(encodeURIComponent(String(data)));
        } else meta.push(_create(data).substring(1));
    })
    return "/" + meta.join("/");
};

const query = {
    create(data) {
        const query = _create(data) || "";
        if (!query)
            return LOCATION;
        return LOCATION + "/" + (query ? "#" + query : "");
    },
    read() {
        const hash = document.location.hash.substring(1);
        if (!hash.startsWith("/"))
            return;
        return hash.split("/").slice(1);
    },
    update(data) {
        const url = this.create(data);
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
