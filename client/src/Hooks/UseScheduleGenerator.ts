import * as Moment from "moment";
import { extendMoment } from "moment-range";
import { TutorFutureSessionModel } from "../Services/Models/ClassSessionModel";

const moment = extendMoment(Moment);

export interface IScheduleGeneratorPayload {
  start_date: Date | null;
  end_date: Date | null;
  start_time: Date | null;
  end_time: Date | null;
  freq: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  range_type: "d" | "s";
  tilldate: Date | null;
  tillsession: number;
  daysofweek: Array<number>;
}

export interface IGeneratedDates {
  included?: boolean;
  start_date: Date;
  end_date?: Date;
  start_time: Date | null;
  end_time: Date | null;
}

export const genDailyDates = (
  schedulePayload: IScheduleGeneratorPayload
): Array<IGeneratedDates> => {
  const {
    start_date,
    end_date,
    start_time,
    end_time,
    interval,
    tilldate,
    tillsession,
  } = schedulePayload;

  let counter: number = 0;
  const dates: Array<IGeneratedDates> = [];

  if (start_date === null) {
    return [];
  }

  let tempStartDate = start_date;
  let tempEndDate = end_date;

  if (schedulePayload.range_type === "d") {
    if (tilldate === null) {
      return [];
    }

    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
    } while (
      moment(moment(tempStartDate).format("LL")).isSameOrBefore(
        moment(moment(tilldate).format("LL"))
      )
    );
  } else if (schedulePayload.range_type === "s") {
    if (tillsession === null) {
      return [];
    }

    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
      counter++;
    } while (counter < tillsession);
  }

  return dates;
};

export const genWeeklyDates = (
  schedulePayload: IScheduleGeneratorPayload
): Array<IGeneratedDates> => {
  const {
    start_date,
    interval,
    tilldate,
    tillsession,
    daysofweek,
    end_date,
    start_time,
    end_time,
  } = schedulePayload;

  let counter: number = 0;
  const dates: Array<IGeneratedDates> = [];

  if (start_date === null) {
    return [];
  }

  let tempStartDate = start_date;
  let tempEndDate = end_date;

  if (schedulePayload.range_type === "d") {
    if (tilldate === null) {
      return [];
    }
    do {
      let found: boolean = false;
      for (let i: number = 0; i < daysofweek.length; i++) {
        const dayOfWeekStartDate: number = moment(tempStartDate).day();
        if (dayOfWeekStartDate === daysofweek[i]) {
          found = true;
        }
      }

      if (found) {
        dates.push({
          included: true,
          start_date: tempStartDate,
          end_date: tempEndDate,
          start_time: start_time,
          end_time: end_time,
        });
      }
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();

      if (tempEndDate instanceof Date) {
        tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
          .add(interval, "days")
          .toDate();
      }
    } while (
      moment(moment(tempStartDate).format("LL")).isSameOrBefore(
        moment(moment(tilldate).format("LL"))
      )
    );
  } else if (schedulePayload.range_type === "s") {
    if (tillsession === null) {
      return [];
    }
    do {
      let found: boolean = false;

      for (let i: number = 0; i < daysofweek.length; i++) {
        const dayOfWeekStartDate: number = moment(tempStartDate).day();
        if (dayOfWeekStartDate === daysofweek[i]) {
          found = true;
        }
      }

      if (found) {
        dates.push({
          included: true,
          start_date: tempStartDate,
          end_date: tempEndDate,
          start_time: start_time,
          end_time: end_time,
        });
        counter++;
      }
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
      if (tempEndDate instanceof Date) {
        tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
          .add(interval, "days")
          .toDate();
      }
    } while (counter < tillsession);
  }

  return dates;
};

export const genMonthlyDates = (
  schedulePayload: IScheduleGeneratorPayload
): Array<IGeneratedDates> => {
  const {
    start_date,
    interval,
    tilldate,
    tillsession,
    end_date,
    start_time,
    end_time,
  } = schedulePayload;

  let counter: number = 0;
  const dates: Array<IGeneratedDates> = [];

  if (start_date === null) {
    return [];
  }

  let tempStartDate = start_date;
  let tempEndDate = end_date;

  if (schedulePayload.range_type === "d") {
    if (tilldate === null) {
      return [];
    }

    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "months")
        .toDate();

      if (tempEndDate instanceof Date) {
        tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
          .add(interval, "months")
          .toDate();
      }
    } while (
      moment(moment(tempStartDate).format("LL")).isSameOrBefore(
        moment(moment(tilldate).format("LL"))
      )
    );
  } else if (schedulePayload.range_type === "s") {
    if (tillsession === null) {
      return [];
    }
    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "months")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "months")
        .toDate();
      counter++;
    } while (counter < tillsession);
  }

  return dates;
};

export const genYearlyDates = (
  schedulePayload: IScheduleGeneratorPayload
): Array<IGeneratedDates> => {
  const {
    start_date,
    interval,
    tilldate,
    tillsession,
    end_date,
    start_time,
    end_time,
  } = schedulePayload;

  let counter: number = 0;
  const dates: Array<IGeneratedDates> = [];

  if (
    start_date === null ||
    end_date === null ||
    start_time === null ||
    end_time === null
  ) {
    return [];
  }

  let tempStartDate = start_date;
  let tempEndDate = end_date;

  if (schedulePayload.range_type === "d") {
    if (tilldate === null) {
      return [];
    }

    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "years")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "years")
        .toDate();
    } while (
      moment(moment(tempStartDate).format("LL")).isSameOrBefore(
        moment(moment(tilldate).format("LL"))
      )
    );
  } else if (schedulePayload.range_type === "s") {
    if (tillsession === null) {
      return [];
    }
    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "years")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "years")
        .toDate();
      counter++;
    } while (counter < tillsession);
  }

  return dates;
};

interface GenerateDailyWeekDaysDatesInterface {
  start_date: Date;
  start_time: string;
  end_time: string;
  session_count: number;
  blocked_dates: Array<TutorFutureSessionModel>;
}

interface DailyWeekDaysDatesResultInterface {
  include: boolean;
  session_date: Date;
}

export const generateDailyWeekDaysDates = (
  schedulePayload: GenerateDailyWeekDaysDatesInterface
): Array<Date> => {
  let {
    start_date,
    session_count,
    start_time,
    end_time,
    blocked_dates,
  } = schedulePayload;

  let counter: number = 0;
  const dates: Array<Date> = [];

  if (start_date === null) {
    return [];
  }

  let temp_start_date = start_date;

  if (session_count === null || session_count <= 0 || session_count > 10) {
    return [];
  }

  do {
    if (
      moment(temp_start_date).isoWeekday() !== 6 &&
      moment(temp_start_date).isoWeekday() !== 7
    ) {
      let conflict = false;

      for (const bd of blocked_dates) {
        const new_date_range = moment.range(
          moment(
            moment(temp_start_date).format("MM/DD/YYYY") +
              " " +
              moment(start_time, "hh:mm A").format("HH:mm:ss")
          ),
          moment(
            moment(temp_start_date).format("MM/DD/YYYY") +
              " " +
              moment(end_time, "hh:mm A").format("HH:mm:ss")
          )
        );

        const blocked_date_range = moment.range(
          moment(
            moment(new Date(bd.start_date)).format("MM/DD/YYYY") +
              " " +
              bd.start_time
          ).add(1, "minutes"),
          moment(
            moment(new Date(bd.start_date)).format("MM/DD/YYYY") +
              " " +
              bd.end_time
          ).subtract(1, "minutes")
        );

        if (new_date_range.overlaps(blocked_date_range)) {
          // console.log(`conflict`);
          // session_count++;
          conflict = true;
          break;
        }

        console.log(conflict, new_date_range, blocked_date_range);
      }

      if (!conflict) {
        dates.push(moment(temp_start_date).toDate());
        counter++;
      }
    }

    temp_start_date = moment(new Date(temp_start_date), "DD/MM/YYYY")
      .add(1, "days")
      .toDate();
  } while (counter < session_count);

  console.log(`dates`, dates);

  return dates;
};
