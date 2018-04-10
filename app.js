$(document).ready(() => {
    getMessages();

    $("#form").submit(e => false);

    //Form validation
    $(document).on('keyup', '.form-control', (e) => {
        let name = $("#nameInput")[0].value, email = $("#emailInput")[0].value, message = $("#messageInput")[0].value, btn = $("#submit");
        if(name !== '' && email !== '' && message !== '') btn.prop('disabled', false);
        else btn.prop('disabled', true);
    })

    //Submit the message
    $(document).on('click', '#submit', () => {
        let name = $("#nameInput")[0].value,
            email = $("#emailInput")[0].value,
            message = $("#messageInput")[0].value,
            date = new Date().toLocaleString(),
            url = 'http://localhost:8081/addMessage',
            payload = JSON.stringify({name: name, email: email, message: message, date: date});
        $.ajax({
            url: url,
            type: 'post',
            contentType: 'application/json',
            data: payload,
            success: function( payload ){
                renderMessages(payload.id, payload.name, payload.email, payload.message, payload.date);
                formCleanUp()
            },
            error: function( data ){
                console.log( data );
            }
        });
    })

    //Get all messages
    function getMessages() { 
        let url = 'http://localhost:8081/getMessages',
            results = $("#results");
        $.ajax({
            url: url,
            type: 'get',
            success: function( data ){
                data.forEach(e => {
                    renderMessages(e.id, e.name, e.email, e.message, e.date);
                });
            },
            error: function( data ){
                console.log( data.responseText );
            }
        });
    };

    // Delete a message
    $(document).on('click', '.btnDelete', (e) => {
        let id = e.target.getAttribute('data-id'),
            url = 'http://localhost:8081/delete/' + id,
            message = $(e.target).closest(".message");
        $.ajax({
            url: url,
            type: 'delete',
            success: function( data ){
                message.remove();
            },
            error: function( data ){
                console.log( data );
            }
        });
    })

    //Open popup
    $(document).on('click', '.btnUpdate', (e) => {
        let name = $(e.target).parent().siblings('#messageName')[0].textContent,
            email = $(e.target).parent().siblings('#messageEmail')[0].textContent,
            message = $(e.target).parent().parent().siblings()[0].textContent;
        $("#nameUpdate").eq(0).val(name);
        $("#emailUpdate").eq(0).val(email);
        $("#messageUpdate").eq(0).val(message);
        $("#popupUpdate").eq(0).attr("data-id", e.target.dataset.id);
        $("#update").addClass("popupActive");
    })

    //Update a message
    $(document).on('click', '#popupUpdate', (e) => {
        let name = $("#nameUpdate")[0].value,
            email = $("#emailUpdate")[0].value,
            message = $("#messageUpdate")[0].value,
            date = new Date().toLocaleString(),
            id = e.target.getAttribute('data-id');
            url = 'http://localhost:8081/update/' + id,
            payload = JSON.stringify({name: name, email: email, message: message, date: date});
        $.ajax({
            url: url,
            type: 'put',
            contentType: 'application/json',
            data: payload,
            success: function( payload ){
                $(".message[data-id='" + id + "']")[0].remove();
                renderMessages(payload.id, payload.name, payload.email, payload.message, payload.date);
                formCleanUp()
                $("#update").removeClass("popupActive");
            },
            error: function( data ){
                console.log( data );
            }
        });
    })

    // Popup cancel button
    $(document).on('click', '#popupCancel', () => {
        $("#update").removeClass("popupActive");
    })

    // Message template
    function renderMessages(id, name, email, message, date) {
        $("#results").append("<div class='message' data-id='" + id + "'><div class='header d-flex justify-content-between'<h4><span id='messageName'>" + name + "</span> <-><span id='messageEmail'>" + email + "</span><-></h4><div class='controls'><span class='pr-2' id='messageDate'>" + date + "</span><button data-id='" + id + "' class='btn btn-danger btnDelete mr-2'>Delete</button><button data-id='" + id + "' class='btn btn-primary btnUpdate'>Update</button></div></div><p id='messageMessage'>" + message + "</p></div>");
     }
 
     // Clear the form
     function formCleanUp() {
         $("#nameInput, #emailInput, #messageInput").val('');
     }
})
