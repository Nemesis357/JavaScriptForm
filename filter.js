$(document).ready(() => {
    if($(".outputContainer .message"))
        setTimeout(() => {$("#filter").slideDown();}, 2000)

    $(document).on('click', '#filterBtn', filter);
    $(document).keypress(e => { if(e.which == 13) filter();});

    function filter () {
        let input = $("#filterInput")[0].value.toLowerCase();
        let list = $(".outputContainer .message #messageName");
        if(input === '' || input === undefined) return $(".message").show();
        list.each((i, val) => {
            if($(val).text().toLowerCase() !== input)
                $(val).closest(".message").fadeOut();
        })
    }
})