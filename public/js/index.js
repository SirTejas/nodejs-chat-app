const socket = io();

socket.on('connect',()=>{
    console.log('connected to server');

    let li = jQuery('<li></li>');
    li.text('Connected To Server');
    jQuery('#messages').append(`<h4>${li.text()}</h4>`);
})

socket.on('newMessage',(data)=>{
    console.log('Clients newMessage event listener :');
    console.log(data);

    let li = jQuery('<li></li>');
    li.text(`${data.from} : ${data.text}`);
    jQuery('#messages').append(li);

});

socket.on('userConnected',(data) =>{
    let li = jQuery('<li></li>');
    li.text(`${data.text}`);
    jQuery('#messages').append(li);
});

socket.on('userDisconnected',(data)=>{
    let li = jQuery('<li></li>');

    li.text(`${data.text}`);
    jQuery('#messages').append(li);
})



jQuery('#message-form').on('submit',function(e){
    e.preventDefault();

    socket.emit('newMessage',{
        from : 'User',
        text : jQuery('[name = message]').val()
    });
});