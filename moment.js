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
            var pattern = '«До ограбления остал{0} %DD д{1} %HH час{2} %MM минут{3}»';
            var time = (this.date - moment.date) / 1000 / 60;
            var days = Math.floor(time / 60 / 24);
            var hours = Math.floor(time / 60 % 24);
            var minutes = Math.floor(time - days * 1440 - hours * 60);
            days = days < 10 ? '0' + days.toString() : days;
            hours = hours < 10 ? '0' + hours.toString() : hours;
            minutes = minutes < 10 ? '0' + minutes.toString() : minutes;
            var ending = days === '01' ? 'ся' : 'ось';
            pattern = pattern.replace('{0}', ending);
            ending = parseInt(days[1]) < 5 ? (parseInt(days[1]) === 1 ? 'ень' : 'ня') : 'ней';
            pattern = pattern.replace('{1}', ending);
            ending = parseInt(hours[1]) < 5 && hours !== '11' ? (parseInt(hours[1]) === 1 ? '' : 'а') : 'ов';
            pattern = pattern.replace('{2}', ending);
            ending = parseInt(minutes[1]) < 5 && minutes !== '11' ? (parseInt(minutes[1]) === 1 ? 'а' : 'ы') : '';
            pattern = pattern.replace('{3}', ending);
            pattern = pattern.replace('%DD', days);
            pattern = pattern.replace('%HH', hours);
            pattern = pattern.replace('%MM', minutes);
            pattern = pattern.replace(/ 00 [А-я]+/g, '');
            return pattern;
        }
    };
};
