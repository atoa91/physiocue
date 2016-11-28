var FCM = require("fcm-node");

var serverKey='AIzaSyAlyWtNvd9xtarOkl8U53P1IMLb-dqhM1g';
var fcm = new FCM(serverKey);

var message = {
    to:'to user',
    collapse_key:'physiocue-push',
    
    notification:{
        title:'ggggggggggg',
        body: 'gggggggggggg'
    },
    
    data:{
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};

fcm.send(message, function(err, response){
    if(err){
        console.log(err);
    } else{
        console.log("Successfully sent with response: ", response);
    }
});