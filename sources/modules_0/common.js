const error = Reactive({
    message: null,
    exists() {
        return !!(this.message || "").trim();
    }
});

Composite.listen(Composite.EVENT_ERROR, (event, cause) => {
    error.message = cause.message;
});

#export error;