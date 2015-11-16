'use strict';

module.exports = function () {
    return {
        date: null,

        timezone: null,

        format: function (pattern) {
            if (!this.timezone) {
                this.timezone = 5;
            }
            var dates = {1: 'ПН', 2: 'ВТ', 3: 'СР'};
            var day = dates[this.date.getDate()];
            var minutes = this.date.getMinutes();
            minutes = minutes < 10 ? '0' + minutes.toString() : minutes;
            var hours = new Date(this.date.getTime() + this.timezone * 60 * 60 * 1000);
            pattern = pattern.replace('%DD', day);
            pattern = pattern.replace('%HH', hours.getHours());
            pattern = pattern.replace('%MM', minutes);
            return pattern;
        },

        fromMoment: function (moment) {
            if (!this.timezone) {
                this.timezone = 5;
            }
            var pattern = '«До ограбления остался %DD день %HH час %MM минута»';
            var time = (this.date - moment.date) / 1000 / 60;
            var days = Math.floor(time / 60 / 24);
            var hours = Math.floor(time / 60 % 24);
            var minutes = Math.floor(time - days * 1440 - hours * 60);
            minutes = minutes < 10 ? '0' + minutes.toString() : minutes;
            pattern = pattern.replace('%DD', days);
            pattern = pattern.replace('%HH', hours);
            pattern = pattern.replace('%MM', minutes);
            return pattern;
        }
    };
};
