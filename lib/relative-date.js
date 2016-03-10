var relativeDate = (function(undefined){
  var intervals = {SECOND: 1000};
  intervals.MINUTE = 60 * intervals.SECOND;
  intervals.HOUR = 60 * intervals.MINUTE;
  intervals.DAY = 24 * intervals.HOUR;
  intervals.WEEK = 7 * intervals.DAY;
  intervals.YEAR = intervals.DAY * 365;
  intervals.MONTH = intervals.YEAR / 12;

  var formats = [
    [0.7 * intervals.MINUTE, 'just now', 'in a moment' ],
    [1.5 * intervals.MINUTE, 'a minute'],
    [60 * intervals.MINUTE,  '$MINUTE minutes'],
    [1.5 * intervals.HOUR,   'an hour'],
    [intervals.DAY,          '$HOUR hours'],
    [2 * intervals.DAY,      'yesterday', 'tomorrow'],
    [7 * intervals.DAY,      '$DAY days'],
    [1.5 * intervals.WEEK,   'a week'],
    [intervals.MONTH,        '$WEEK weeks'],
    [1.5 * intervals.MONTH,  'a month' ],
    [intervals.YEAR,         '$MONTH months'],
    [1.5 * intervals.YEAR,   'a year' ],
    [Number.MAX_VALUE,       '$YEAR years']
  ];

  var suffixes = [' ago', ' from now'];

  function replaceInterval(delta, format){
    return format.replace(/\$(MINUTE|HOUR|DAY|WEEK|MONTH|YEAR)/, function(m, i){
      return Math.round(delta / intervals[i]);
    });
  }

  function relativeDate(input,reference){
    !reference && ( reference = (new Date).getTime() );
    reference instanceof Date && ( reference = reference.getTime() );
    input instanceof Date && ( input = input.getTime() );

    var delta = reference - input,
        dir = delta > 0 ? 0 : 1,
        format, i, len;

    delta = Math.abs(delta);

    for(i = -1, len = formats.length; ++i < len;){
      format = formats[i];

      if(delta < format[0]){
        if(format.length == 2){
          return replaceInterval(delta, format[1]) + suffixes[dir];
        }else{
          return format[1 + dir];
        }
      }
    };
  }

  return relativeDate;

})();

if(typeof module != 'undefined' && module.exports){
  module.exports = relativeDate;
}
