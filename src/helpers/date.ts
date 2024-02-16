import * as dateFns from 'date-fns'

type DateLike = string | Date

export class DateHelper {
  static parse(date: DateLike) {
    if (typeof date === 'string') {
      return dateFns.parseISO(date)
    }

    return date
  }

  static formatDurationInSeconds(durationInSeconds: number) {
    const duration = dateFns.intervalToDuration({ start: 0, end: durationInSeconds * 1000 })
    const formatted = dateFns.formatDuration(duration, {
      format: ['hours', 'minutes', 'seconds'],
      zero: true,
      delimiter: ':',
      locale: {
        formatDistance: (_token, count) => String(count).padStart(2, '0'),
      },
    })

    return formatted
  }

  static durationInSeconds(left: DateLike, right: DateLike) {
    return dateFns.differenceInSeconds(this.parse(left), this.parse(right))
  }

  static isValidTime(time: string | Date) {
    const date = typeof time === 'string' ? dateFns.parse(time, 'HH:mm', new Date()) : time
    return dateFns.isValid(date)
  }

  static editDateTime(from: DateLike, time: string) {
    if (!this.isValidTime(time)) {
      throw new Error('Invalid time')
    }
    const date = dateFns.parse(time, 'HH:mm', this.parse(from))
    return date
  }

  static addSecondsToTime(time: string, seconds: number) {
    const date = dateFns.parse(time, 'HH:mm', new Date())
    return dateFns.addSeconds(date, seconds)
  }
}
