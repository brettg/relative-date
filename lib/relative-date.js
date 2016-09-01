var relativeDate = (function(undefined){
  var intervals = {SECOND: 1000};
  intervals.MINUTE = 60 * intervals.SECOND;
  intervals.HOUR = 60 * intervals.MINUTE;
  intervals.DAY = 24 * intervals.HOUR;
  intervals.WEEK = 7 * intervals.DAY;
  intervals.YEAR = intervals.DAY * 365;
  intervals.MONTH = intervals.YEAR / 12;

  var defaultLocale = {
    now: 'just now',
    moment: 'in a moment',
    oneMinute: 'a minute',
    minutes: 'minutes',
    oneHour: 'an hour',
    hours: 'hours',
    yesterday: 'yesterday',
    tomorrow: 'tomorrow',
    days: 'days',
    oneWeek: 'a week',
    weeks: 'weeks',
    oneMonth: 'a month',
    months: 'months',
    oneYear: 'a year',
    years: 'years',

    pastPrefix: null,
    pastSuffix: 'ago',
    futurePrefix: null,
    futureSuffix: 'from now'
  }

  function formatsForLocale(l){
    return [[0.7 * intervals.MINUTE, l.now, l.moment],
            [1.5 * intervals.MINUTE, l.oneMinute],
            [60 * intervals.MINUTE,  '$MINUTE ' + l.minutes],
            [1.5 * intervals.HOUR,   l.oneHour],
            [intervals.DAY,          '$HOUR ' + l.hours],
            [2 * intervals.DAY,      l.yesterday, l.tomorrow],
            [7 * intervals.DAY,      '$DAY ' + l.days],
            [1.5 * intervals.WEEK,   l.oneWeek],
            [intervals.MONTH,        '$WEEK ' + l.weeks],
            [1.5 * intervals.MONTH,  l.oneMonth],
            [intervals.YEAR,         '$MONTH ' + l.months],
            [1.5 * intervals.YEAR,   l.oneYear],
            [Number.MAX_VALUE,       '$YEAR ' + l.years]];
  }

  function computeDelta(input, reference){
    !reference && ( reference = (new Date).getTime() );
    reference instanceof Date && ( reference = reference.getTime() );
    input instanceof Date && ( input = input.getTime() );
    return reference - input;
  }

  function replaceInterval(delta, format){
    return format.replace(/\$(MINUTE|HOUR|DAY|WEEK|MONTH|YEAR)/, function(m, i){
      return Math.round(delta / intervals[i]);
    });
  }
  function prefixAndSuffix(interval, prefix, suffix){
    if(prefix) { interval = prefix + ' ' + interval; }
    if(suffix) { interval = interval + ' ' + suffix; }
    return interval;
  }

  function localize(locale) {
    var formats = formatsForLocale(locale),
        prefixes = [locale.pastPrefix, locale.futurePrefix],
        suffixes = [locale.pastSuffix, locale.futureSuffix];

    return function relativeDate(input, reference){
      var delta = computeDelta(input, reference),
          dir = delta > 0 ? 0 : 1,
          format, i, len;

      delta = Math.abs(delta);

      for(i = -1, len = formats.length; ++i < len;){
        format = formats[i];

        if(delta < format[0]){
          if(format.length == 2){
            return prefixAndSuffix(replaceInterval(delta, format[1]), prefixes[dir], suffixes[dir]);
          }else{
            return format[1 + dir];
          }
        }
      };
    }
  };

  var defaultRelativeDate = localize(defaultLocale);
  defaultRelativeDate.localize = localize;

  return defaultRelativeDate;
})();

if(typeof module != 'undefined' && module.exports){
  module.exports = relativeDate;
}
