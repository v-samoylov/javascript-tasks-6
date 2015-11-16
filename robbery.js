'use strict';

var moment = require('./moment');

var parseDate = string => {
    var dates = {'ПН': 1, 'ВТ': 2, 'СР': 3};
    var date = new Date();
    var hours = /(\d\d):/.exec(string)[1];
    var minutes = /:(\d\d)/.exec(string)[1];
    var zone = /((\+|\-)\d+)/.exec(string)[1];
    var weekDay = /([А-Я]+)/.exec(string) ? /([А-Я]+)/.exec(string)[1] : undefined;
    var day = dates[weekDay];
    hours -= zone;
    if (hours < 0) {
        day--;
        hours = 24 + hours;
    }
    if (hours > 24) {
        day++;
        hours = hours - 24;
    }
    date.setHours(hours);
    date.setMinutes(minutes);
    if (day) {
        date.setDate(day);
    }
    return date;
};

module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    json = JSON.parse(json);
    workingHours.from = parseDate(workingHours.from);
    workingHours.to = parseDate(workingHours.to);
    var gangReady = [];
    var DAYS_NUMBER = 3;
    for (var i = 1; i < DAYS_NUMBER + 1; i++) {
        var from = new Date();
        var to = new Date();
        from.setDate(i);
        from.setHours(workingHours.from.getHours());
        from.setMinutes(workingHours.from.getMinutes());
        to.setDate(i);
        to.setHours(workingHours.to.getHours());
        to.setMinutes(workingHours.to.getMinutes());
        gangReady.push({from, to});
    }
    Object.keys(json).forEach(name => {
        json[name] = json[name].map(entry => {
            return {from: parseDate(entry['from']), to: parseDate(entry['to'])};
        });
    });
    Object.keys(json).forEach(name => {
        var j = 0;
        json[name].forEach(entry => {
            for (var i = 0; i < gangReady.length; i++) {
                var _entry = gangReady[i];
                var isEntryPushed = false;
                if (!_entry) {
                    break;
                }
                if (entry.from > _entry.from && entry.from < _entry.to) {
                    gangReady.push({from: _entry.from, to: entry.from});
                    isEntryPushed = true;
                }
                if (entry.to < _entry.to && _entry.from < entry.to) {
                    gangReady.push({from: entry.to, to: _entry.to});
                    isEntryPushed = true;
                }
                if ((entry.from <= _entry.from && entry.to >= _entry.to) || isEntryPushed) {
                    delete gangReady[i];
                }
            }
            gangReady = gangReady.filter(entry => {
                return typeof entry !== 'undefined';
            });
        });
    });
    appropriateMoment.date = gangReady.reduce((prevEntry, currEntry) => {
        if (!prevEntry) {
            return currEntry;
        }
        var isTimeEnough = currEntry.to - currEntry.from >= minDuration;
        var isEarlier = currEntry.from.getDate() < prevEntry.from.getDate();
        if (isTimeEnough && isEarlier) {
            return currEntry;
        }
    }, undefined).from;
    return appropriateMoment;
};

module.exports.getStatus = function (moment, robberyMoment) {
    moment.date = parseDate(moment.date);
    if (moment.date < robberyMoment.date) {
        return robberyMoment.fromMoment(moment);
    }
    return 'Ограбление уже идёт!';
};
