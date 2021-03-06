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
    date.setHours(hours);
    date.setMinutes(minutes);
    if (day) {
        date.setDate(day);
    }
    date = new Date(date.getTime() - zone * 60 * 60 * 1000);
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
        json[name].forEach(entry => {
            for (var i = 0; i < gangReady.length; i++) {
                var _entry = gangReady[i];
                var isEntryPushed = false;
                if (entry.from > _entry.from && entry.from < _entry.to) {
                    gangReady.push({from: _entry.from, to: entry.from});
                    isEntryPushed = true;
                }
                if (entry.to < _entry.to && entry.to > _entry.from) {
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
    var weekLimit = new Date();
    weekLimit.setDate(8);
    var dateFound = gangReady.reduce((prevEntry, currEntry) => {
        var isTimeEnough = currEntry.to - currEntry.from >= minDuration * 60 * 1000;
        var isEarlier = currEntry.from.getDate() < prevEntry.from.getDate();
        return isTimeEnough && isEarlier ? currEntry : prevEntry;
    }, {from: weekLimit}).from;
    if (dateFound !== weekLimit) {
        appropriateMoment.date = dateFound;
    }
    return appropriateMoment;
};

module.exports.getStatus = function (moment, robberyMoment) {
    moment.date = parseDate(moment.date);
    if (moment.date < robberyMoment.date) {
        return robberyMoment.fromMoment(moment);
    }
    return 'Ограбление уже идёт!';
};
