const security = {
    get clipboardAccess() {
        try {return !!navigator.clipboard.writeText(null);
        } catch (error) {
            return false;
        }
    }
}

#export security@utils;
