'use strict';
module.exports = function dateFormat(date){
    let day = date.getDate();
    if (day.toString().length == 1)
      day = "0"+day;

    let month = date.getMonth()+1;
    if (month.toString().length == 1)
      month = "0"+month;

    let year = date.getFullYear();
    return day+"/"+month+"/"+year;
}
