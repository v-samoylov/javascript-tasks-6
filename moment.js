'use strict';

module.exports = function () {
    return {
        date: null,

        timezone: null,

        format: function (pattern) {
        	var dates = {1: 'ПН', 2: 'ВТ', 3: 'СР'};
            var day = dates[this.date.getDate()];
            pattern = pattern.replace('%DD', day);
            pattern = pattern.replace('%HH', this.date.getHours() + this.timezone);
            pattern = pattern.replace('%MM', this.date.getMinutes());
            return pattern;
        },

        fromMoment: function (moment) {
            var pattern = '«До ограбления остался %DD день %HH час %MM минута»';
            var time = (this.date - moment.date) / 1000 / 60 ;
            var days = Math.floor(time / 60 / 24);
            var hours = Math.floor(time / 60 % 24);
            var minutes = Math.floor(time - days*1440 - hours*60);
            pattern = pattern.replace('%DD', days);
            pattern = pattern.replace('%HH', hours);
            pattern = pattern.replace('%MM', minutes);
            return pattern;
        }
    };
};
