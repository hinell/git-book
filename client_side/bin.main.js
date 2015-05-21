+function ($) {
    var collapsers  = $(".collapse")
        toggler     = $("#toggler")
        toggler.on("click", (function () {
            this.collapse("toggle")
        }).bind(collapsers))
}($,window)