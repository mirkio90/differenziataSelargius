const data = require('./values');
var moment = require('moment');
var mom = moment();
mom.locale('it');
var today = moment().locale('it');
var tomorrow = moment().locale('it').add(1, 'day');

var CalendarHelper = {
    getCurrentMonthName() {
        return today.format('MMMM');
      },
      getCurrentDayName() {
        return today.format('ddd');
      },
      getCurrentDay() {
        return today.toDate().getDate()
      },
      getTomorrowDayName() {
        return tomorrow.format('ddd');
      },
      getTomorrowDay() {
        return tomorrow.toDate().getDate()
      }
}

var DaysHelper = {
    
    getRubbishArray(monthName, dayName, dayNumber) {
      var month = data[monthName];
      console.log("current month: " + monthName);
      console.log("requested day: " + dayName + ", " + dayNumber);
      var day = month[dayName];
      console.log("current day rubbish: ");
      console.log(day);
  
      rubArray = [];
  
      for(var rub in day) {
        if(rub != undefined && day[rub].indexOf(dayNumber) != -1) { 
          rubArray.push(rub);
        }
      }
  
      return rubArray;
    },
    getTomorrowRubbish() {
      console.log("entering getTomorrowRubbish method");
  
      var monthName = CalendarHelper.getCurrentMonthName();
      var dayName = CalendarHelper.getTomorrowDayName();
      var dayNumber = CalendarHelper.getTomorrowDay();
  
      var rubArray = this.getRubbishArray(monthName, dayName, dayNumber);
  
      //TODO formattare il risultato
      var stringRub = this.formatResult(rubArray, tomorrow.format('dddd'))
  
      console.log(stringRub);
      return stringRub;
    },
    getSpecificDayRubbish(specificDay) {
      console.log("entering getSpecificDayRubbish method");
  
      if (mom.isoWeekday(specificDay).isoWeekday() <= today.isoWeekday() ) {
        console.log("adding one week to requested day");
        mom.add(1, 'week');
      }
      console.log("requested date: " + mom.toDate());
      
      var rubArray = this.getRubbishArray(mom.format('MMMM'), mom.format('ddd'), mom.toDate().getDate());
  
      var stringRub = this.formatResult(rubArray, mom.format('dddd'))
  
      return stringRub;
    },
    formatResult(rubArray, dayName) {
      stringRub = dayName;
      if(rubArray.length == 1) {
        stringRub += " passa";
  
        switch (rubArray[0]) {
          case 'plastica':
          case 'carta':
            stringRub += (" la " + rubArray[0]);
            break;
          case 'secco':
          case 'vetro':
            stringRub += (" il " + rubArray[0]);
            break;
          case 'umido':
            stringRub += " l'umido";
            break;
          default:
            break;
        }
      }
      else if(rubArray.length > 1) {
        stringRub += " passano";
  
        for(var i = 0; i<rubArray.length; i++) {
          if (i != 0) {
            stringRub += " e"
          }
          stringRub += " " + rubArray[i];
        }
      }
      else {
        stringRub += " non è previsto il ritiro dei rifiuti";
      }
  
      console.log(stringRub);
      return stringRub;
    }
  }

var RubbishHelper = {
    getNextDayRubbish(rubbishName){
        var nextDate = this.getDaysValue(rubbishName);
        return this.formatResult(nextDate);
    },
    getDaysValue(rubbishName){
        monthName = CalendarHelper.getCurrentMonthName();
        
        var found = false;

        var month = data[monthName];
        mom.add(1, 'day'); 

        console.log("current month: " + monthName);
        while (!found) {
            var dayNumber = mom.toDate().getDate();
            var dayName = mom.format('ddd');


            console.log("requested day: " + dayName + ", " + dayNumber);
            searchDay = month[dayName];
            
            if (searchDay[rubbishName] != null && searchDay[rubbishName].indexOf(dayNumber != -1)) {
                break;
            }

           mom.add(1, 'day'); 
        }

        console.log('next day found: ' + dayName + ", " + dayNumber);
        return mom;
    },
    formatResult(dayFound){
        var dayName = dayFound.format('dddd');
        var monthName = dayFound.format('MMMM');
        var dayNumber = dayFound.toDate().getDate();

        var stringDay = "il prossimo ritiro previsto sarà " 
        if (dayNumber == CalendarHelper.getTomorrowDay()) {
            stringDay += "domani, "
        }
        stringDay += dayName + " " + dayNumber + " " + monthName;

        return stringDay;
    }
}

console.log(RubbishHelper.getNextDayRubbish('vetro'))