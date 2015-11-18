'use strict';

module.exports = function () {
    return {
        date: null,

        timezone: null,

        format: function (pattern) {
            if (this.timezone === null) {
                this.timezone = 5;
            }
            var dates = {1: 'ПН', 2: 'ВТ', 3: 'СР'};
            var day = dates[this.date.getDate()];
            var minutes = this.date.getMinutes();
            var hours = new Date(this.date.getTime() + this.timezone * 60 * 60 * 1000).getHours();
            minutes = minutes < 10 ? '0' + minutes.toString() : minutes;
            hours = hours < 10 ? '0' + hours.toString() : hours;
            pattern = pattern.replace('%DD', day);
            pattern = pattern.replace('%HH', hours);
            pattern = pattern.replace('%MM', minutes);
            return pattern;
        },

        fromMoment: function (moment) {
            if (this.timezone === null) {
                this.timezone = 5;
            }
            var pattern = 'До ограбления осталось\n«Дней: %DD Часов: %HH Минут: %MM »';
            var time = (this.date - moment.date) / 1000 / 60;
            var days = Math.floor(time / 60 / 24);
            var hours = Math.floor(time / 60 % 24);
            var minutes = Math.floor(time - days * 1440 - hours * 60);
            days = days < 10 ? '0' + days.toString() : days;
            hours = hours < 10 ? '0' + hours.toString() : hours;
            minutes = minutes < 10 ? '0' + minutes.toString() : minutes;
            pattern = pattern.replace('%DD', days);
            pattern = pattern.replace('%HH', hours);
            pattern = pattern.replace('%MM', minutes);
            pattern = pattern.replace(/ 00 [А-я]+/g, '');
            return pattern;
        }
    };
};
