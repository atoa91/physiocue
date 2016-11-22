var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var express = require('express');



var historySchema = new Schema({
    clientId:String,
    SYS : Number,
    DIA : Number,
    pulse :Number,
    status : Number,
    date : Date
    // email : String,
    // age : Number,
    // sex : Boolean,
    // weight : Number,
    // height : Number,
    // arm : Number,
    // medication : String
});

historySchema.pre("save", function(next){
  var numbering=this;
//     this.created_at = this.created_at || new Date();
//   this.updated_at = new Date();
    this.date = +new Date() + 9*60*60*1000;
  // make numbering for checking number of recent one
    return next();
});

historySchema.statics.weekly = function (id,next){
    History.find({clientId: id})
    .exec(function(error, weekly){
      if (error) return next(error);
        if (weekly.length ==0) {
          var error = new Error("no data.");
          error.status = 401;
          return next(error);
        }
        //var index[] = ;
        function weeklyBig(value){
          return value < gtew && value >= ltew;
        }
        var weekList=[];
        var indexList = [];
        for(var i=0; i<weekly.length; i++){
          weekList.push(weekly[i].date);
        }
        i = 0;
        while(1)
        {
          var gtew =new Date() - i*7*24*60*60*1000;
          var ltew =new Date() - 7*24*60*60*1000 - i*7*24*60*60*1000;
          indexList.push(weekList.findIndex(weeklyBig));
          
          if( indexList[i]==-1){
            indexList[i]= weekList.length-1;
            indexList.push(-1);
            break;
          }
          i++;
        }


        
      
        i =0;
        console.log(indexList);
        var result =[];
    
        // average
        function average(array) {
        var sum = 0;
        for (var i = 0; i < array.length; i++)
        sum += array[i];
        
        return Math.round(sum / array.length);
        }
        
        var j=0;
        while(1){
          var sumSYS =[];
          var sumDIA =[];
          var sumPluse =[];
          
          for(0; j<indexList[i]; j++){
            sumSYS.push(weekly[j].SYS);
            sumDIA.push(weekly[j].DIA);
            sumPluse.push(weekly[j].pulse);
          }
          if(indexList[i]!=0){
          result.push(
            {_id:weekly[indexList[i]-1]._id,
            date:weekly[indexList[i]-1].date,
            clientId:weekly[indexList[i]-1].clientId,
            SYS:average(sumSYS),
            DIA:average(sumDIA),
            pulse:average(sumPluse),
            status:weekly[indexList[i]-1].status
            }
            );
          }

            i++;
            if(indexList[i]==-1)
              break;

        }

      return next(null,result);
    });
};

 // weekly

historySchema.statics.monthly = function(id,next){
    History.find({clientId: id})
    .exec(function(error, monthly){
      if (error) return next(error);
        if (monthly.length ==0) {
          var error = new Error("no data.");
          error.status = 401;
          return next(error);
        }

        var monthList = [];
        var indexListM = [];
       
        for(var i=0; i<monthly.length; i++){
          monthList.push(monthly[i].date);
        }
        console.log(monthList);
        i = 0;
        
        function monthlyBig(value){
          return value < gtewM && value >= ltewM;
        }
        
        while(1)
        {
          var gtewM =new Date() - i*30*24*60*60*1000;
          var ltewM =new Date() - 30*24*60*60*1000 - i*30*24*60*60*1000;
          indexListM.push(monthList.findIndex(monthlyBig));
          console.log("hi");
          console.log(Date(gtewM));
          console.log(Date(ltewM));
          if( indexListM[i]==-1){
            indexListM[i]= monthList.length-1;
            indexListM.push(-1);
            break;
          }
          i++;
        }
         console.log(indexListM);
      
        i =0;
        
        var result =[];
    
        // average
        function average(array) {
        var sum = 0;
        for (var i = 0; i < array.length; i++)
        sum += array[i];
        
        return Math.round(Math.round(sum / array.length));
        }
        // console.log(indexListM);
        // console.log(Date(gtewM));
        // console.log(Date(ltewM));
        var j=0;
        while(1){
          var sumSYS =[];
          var sumDIA =[];
          var sumPluse =[];
          
          for(0; j<indexListM[i]; j++){
            sumSYS.push(monthly[j].SYS);
            sumDIA.push(monthly[j].DIA);
            sumPluse.push(monthly[j].pulse);
          }
          if(indexListM[i]!=0){
          result.push(
            {_id:monthly[indexListM[i]-1]._id,
            date:monthly[indexListM[i]-1].date,
            clientId:monthly[indexListM[i]-1].clientId,
            SYS:average(sumSYS),
            DIA:average(sumDIA),
            pulse:average(sumPluse),
            status:monthly[indexListM[i]-1].status
            }
            );
          }

            i++;
            if(indexListM[i]==-1)
              break;

        }

      return next(null,result);
    });
};
//monthly

historySchema.statics.threeMonthly = function(id,next){
    History.find({clientId: id})
    .exec(function(error, threeMonthly){
      if (error) return next(error);
        if (threeMonthly.length ==0) {
          var error = new Error("no data.");
          error.status = 401;
          return next(error);
        }
        //var index[] = ;
        function weeklyBig(value){
          return value < gtew && value >= ltew;
        }
        var threeMonthList=[];
        var indexListT = [];
        for(var i=0; i<threeMonthly.length; i++){
          threeMonthList.push(threeMonthly[i].date);
        }
        i = 0;
        while(1)
        {
          var gtew =new Date() - i*90*24*60*60*1000;
          var ltew =new Date() - 90*24*60*60*1000 - i*90*24*60*60*1000;
          indexListT.push(threeMonthList.findIndex(weeklyBig));
          
          if( indexListT[i]==-1){
            indexListT[i]= threeMonthList.length-1;
            indexListT.push(-1);
            break;
          }
          i++;
        }
      
        i =0;
        
        var result =[];
    
        // average
        function average(array) {
        var sum = 0;
        for (var i = 0; i < array.length; i++)
        sum += array[i];
        
        return Math.round(sum / array.length);
        }
        console.log(indexListT);
        console.log(threeMonthList);
        var j=0;
        while(1){
          var sumSYS =[];
          var sumDIA =[];
          var sumPluse =[];
          
          for(0; j<indexListT[i]; j++){
            sumSYS.push(threeMonthly[j].SYS);
            sumDIA.push(threeMonthly[j].DIA);
            sumPluse.push(threeMonthly[j].pulse);
          }
          if(indexListT[i]!=0){
          result.push(
            {_id:threeMonthly[indexListT[i]-1]._id,
            date:threeMonthly[indexListT[i]-1].date,
            clientId:threeMonthly[indexListT[i]-1].clientId,
            SYS:average(sumSYS),
            DIA:average(sumDIA),
            pulse:average(sumPluse),
            status:threeMonthly[indexListT[i]-1].status
            }
            );
          }

            i++;
            if(indexListT[i]==-1)
              break;

        }

      return next(null,result);
    });
};
//3monthly


// historySchema.statics.weekly =
// function(id) {
//     console.log("inside"+id);
//     var flag = 0;
//     for (var i=1; i<2; i++){
//       console.log(i);
//     History.find({clientId: id, date:{"$gt":new Date()+i*7*60*60*1000, "$lte": new Date()}})
//       .exec(function(error, weekly) {
//         if (error) return callback(error);
//         if (!weekly) {
//           flag = 1;
//           var error = new Error("no data.");
//           error.status = 401;
//           return callback(error);
//         }
//         console.log(weekly);
//         return callback(null,weekly);
//   })
//   }
// }
// }


var History = mongoose.model("History", historySchema);


module.exports = History;