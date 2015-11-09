'use strict';

var moment = require('./moment');

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    var parseTime = string => {
        var time = new Date();
        var hours = /(\d\d):/.exec(string)[1];
        var minutes = /:(\d\d)/.exec(string)[1];
        var zone = /((\+|\-)\d+)/.exec(string)[1];
        time.setHours(hours - zone);
        time.setMinutes(minutes);
        return time;
    };
    json = JSON.parse(json);
    var dayStart = new Date();
    var dayEnd = new Date();
    dayStart.setHours(0);
    dayStart.setMinutes(0);
    dayEnd.setHours(23);
    dayEnd.setMinutes(59);
    workingHours.from = parseTime(workingHours.from);
    workingHours.to = parseTime(workingHours.to);
    var gangReady = {
        'ПН': {from: dayStart, to: dayEnd},
        'ВТ': {from: dayStart, to: dayEnd},
        'СР': {from: dayStart, to: dayEnd}
    };
    
    Object.keys(json).forEach(name => {
        json[name].forEach(entry => {
            var weekday = entry['from'].substring(0, 2);
            if (gangReady[weekday].from < parseTime(entry['from'])) {
                gangReady[weekday].from = parseTime(entry['from']);
            }
        });
        json[name].forEach(entry => {
            var weekday = entry['from'].substring(0, 2);
            if (gangReady[weekday].to > parseTime(entry['to'])) {
                gangReady[weekday].to = parseTime(entry['to']);
            }
        });
    });
    var weekDays = Object.keys(gangReady);
    for (var i = 0; i < weekDays.length; i++){
        var weekDay = weekDays[i];
        var dayStart = gangReady[weekDay].from < workingHours.from ? workingHours.from : gangReady[weekDay].from;
        var dayEnd = gangReady[weekDay].to < workingHours.to ? workingHours.to : gangReady[weekDay].to;
        if (((dayEnd - dayStart)/1000/60 >= minDuration) && dayStart < dayEnd) {
            var weekday = weekDay;
            var time = dayStart;
            appropriateMoment.date = {weekday, time};
            console.log(time.getHours(), time.getMinutes());
            break;
        }
    }
    
    return appropriateMoment;
};

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};
