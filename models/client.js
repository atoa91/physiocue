var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;
var hat = require('hat');

var FCM = require("fcm-node");
var serverKey='AIzaSyAlyWtNvd9xtarOkl8U53P1IMLb-dqhM1g';

var clientSchema = new Schema({
    clientId:{
    type:String,
    unique: true
    },
    password:String,
    email : {
      type:String,
      unique: true
    },
    age : Number,
    sex : Boolean,
    weight : Number,
    height : Number,
    arm : Number,
    medication : String,
    token:String,
    pushToken:String
});

clientSchema.pre("save", function(next){
  var client=this;
  var id=hat();
  bcrypt.hash(this.password, 10, function(error, hash){
    if(error) return next(error);
    
    var newPassword = hash;
    client.password = newPassword;
    client.token =id.substring(0,6);
    
    return next();
  });
});



// client.authenticate using avaliable
// next => function(error, client){...}
clientSchema.statics.authenticate = function() {
  return function(username, password, callback) {
    Client.findOne({clientId: username})
      .exec(function(error, user) {
        if (error) return callback(error);
        if (!user) {
          var error = new Error("User not found.");
          error.status = 401;
          return callback(error);
        }

        bcrypt.compare(password, user.password, function(error, result) {
          if (error) return callback(error);

          if (result) {
            return callback(null, user);
          } else {
            var error = new Error("username, password does not match.");
            error.status = 401;
            return callback(error);
          }
        });
      });
  };
};

clientSchema.statics.pwdCheck=function(username, password, callback) {
    Client.findOne({clientId: username})
      .exec(function(error, user) {
        if (error) return callback(error);
        if (!user) {
          var error = new Error("User not found.");
          error.status = 401;
          return callback(error);
        }

        bcrypt.compare(password, user.password, function(error, result) {
          if (error) return callback(error);
          if (result)return callback(null,"same password");
          bcrypt.hash(password, 10, function(error, hash){
          if(error) return callback(error);
  
          var newPassword = hash;
          var id2=hat();
         
          Client.update({clientId:username},{
            password : newPassword,
            token:id2.substring(0,6)
          },function(err, numAffected){
            if(err) return callback(error);

            return callback(null,"success");
             
          });
        });
          
        });
      });
  };


clientSchema.statics.infoChange =function(username, email, weight,height,arm,medication, callback) {
    Client.findOne({clientId: username})
      .exec(function(error, user) {
        if (error) return callback(error);
        if (!user) {
          var error = new Error("User not found.");
          error.status = 401;
          return callback(error);
        }

        if(!email) email = user.email;
        if(!weight) weight = user.weight;
        if(!height) height = user.height;
        if(!arm) arm = user.arm;
        if(!medication) medication = user.medication;
        
        Client.update({clientId:username},{
          email:email,
          weight:weight,
          height:height,
          arm:arm,
          medication:medication
        },function(err, numAffected){
        if(err) return callback(error);

    return callback(null,"success");
});
        
  });
};  


clientSchema.statics.updateToken = function(id, token, callback){
  //find client one
  if(!token)return callback('token missing');
  Client.update({clientId: id},{$set:{pushToken:token}},function(err, numAffected){
            if(err) return callback(err);
            return callback(null,numAffected);
  });
};



clientSchema.statics.pushAlert = function(id, callback){
  Client.findOne({clientId:id})
  .exec(function(error, user){
    if (error) return callback(error);
    if (!user) {
          var error = new Error("User not found.");
          error.status = 401;
          return callback(error);
        }
        
        var fcm = new FCM(serverKey);
        var message = {
            to: user.pushToken,
            collapse_key:'physiocue-push',
            
            notification:{
                title:'Time to check your blood pressure',
                body: 'Time to check your blood pressure'
            },
            
            data:{
                my_key: 'value',
                my_another_key: 'my another value'
            }
        };

        fcm.send(message, function(err, response){
            if(err){
                return callback(err);
            } else{
                return callback(null,"Successfully sent with response: "+ response);
            }
        });
    
  });
}


clientSchema.statics.serialize = function() {
  return function(user, callback) {
    return callback(null, user._id);
  }
}


clientSchema.statics.deserialize = function() {
  return function(id, callback) {
    Client.findOne({_id: id}, function(error, user) {
      return callback(error, user);
    });
  };
};

var Client = mongoose.model("Client", clientSchema);


module.exports = Client;