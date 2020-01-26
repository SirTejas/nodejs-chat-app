const socket = io();

function scrollToBottom() {
    //selector
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');

    //heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect',()=>{
    console.log('connected to server')
   let params = jQuery.deparam(window.location.search);

   socket.emit('join', params, function (err) {
        if(err){
            alert(err);
            window.location.href = '/'
        }else{
            console.log('No err');
        }
   })
})

socket.on('serverMessage',(serverMessage) => {
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template,{
        from : serverMessage.from,
        text : serverMessage.text,
        createdAt : serverMessage.createdAt
    });

    jQuery('#messages').append(html);
    scrollToBottom();
})

socket.on('newMessage',(data)=>{

    let template = jQuery('#message-template').html();
    let html = Mustache.render(template,{
        from : data.from,
        text : data.text,
        createdAt : data.createdAt
    });

    jQuery('#messages').append(html);
    scrollToBottom();

    // console.log('Clients newMessage event listener :');
    // console.log(data);

    // let li = jQuery('<li></li>');
    // li.text(`${data.from} ${data.createdAt} : ${data.text}`);
    // jQuery('#messages').append(li);
});

socket.on('userConnected',(data) =>{
    let li = jQuery('<li></li>');
    li.text(`${data.from} ${data.createdAt} : ${data.text}`);
    jQuery('#messages').append(li);
    scrollToBottom();
});

socket.on('userDisconnected',(data)=>{
    let li = jQuery('<li></li>');

    li.text(`${data.from} ${data.createdAt} : ${data.text}`);
    jQuery('#messages').append(li);
    scrollToBottom();
})



jQuery('#message-form').on('submit',function(e){
    e.preventDefault();

    socket.emit('newMessage',{
        from : 'User',
        text : jQuery('[name = message]').val(),
        createdAt : moment().format('h:mm a  Do MMM YYYY')
    },function(){
        jQuery('[name = message]').val('');
    });
});