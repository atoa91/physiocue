var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    clientId:{
    type:String,
    unique: true
    },
    password:String,
    email : String,
    age : Number,
    sex : Boolean,
    weight : Number,
    height : Number,
    arm : Number,
    medication : String
});

clientSchema.pre("save", function(next){
  var client=this;
  bcrypt.hash(this.password, 10, function(error, hash){
    if(error) return next(error);
    
    var newPassword = hash;
    client.password = newPassword;
    
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

clientSchema.statics.pwdCheck =function(username, password, callback) {

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
         
          Client.update({clientId:username},{
            password : newPassword
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

        if(email.length==0) email = user.email;
        if(weight.length==0) weight = user.weight;
        if(height.length==0) height = user.height;
        if(arm.length==0) arm = user.arm;
        if(medication.length==0) medication = user.medication;
        
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