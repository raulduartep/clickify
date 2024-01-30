import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(duration)

export class DateHelper {
  static formatDurationInSeconds(durationInSeconds: number, format = 'HH:mm:ss') {
    return dayjs.duration(durationInSeconds, 'seconds').format(format)
  }

  static durationInSeconds(start: string, end?: string) {
    const entryDate = dayjs.utc(start)
    const now = dayjs.utc(end)

    const diff = now.diff(entryDate, 'seconds')

    return diff
  }
}

export class DateUTCHelper {
  static formattedNowDateTime() {
    return dayjs.utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
  }

  static editTimeFromLocalAndFormatDateTime(from: string, newHour: number, newMinutes: number, newSeconds: number) {
    return dayjs
      .utc(from)
      .local()
      .set('hours', newHour)
      .set('minutes', newMinutes)
      .set('seconds', newSeconds)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss[Z]')
  }

  static toLocalFormattedDate(date: string | Date) {
    return dayjs.utc(date).toDate().toLocaleDateString()
  }

  static isBefore(date: string | Date, compare: string | Date) {
    return dayjs(date).isBefore(dayjs(compare))
  }
}
