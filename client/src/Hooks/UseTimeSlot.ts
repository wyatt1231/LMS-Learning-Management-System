import moment from "moment";

export interface TimeSlotInterface {
  start_time?: string;
  end_time?: string;
}

export const generateTimeSlot = (minutes: number): Array<TimeSlotInterface> => {
  const time_slots: Array<TimeSlotInterface> = [];

  if (!minutes) {
    return time_slots;
  }

  let initial_time = moment("07:00", "hh:mm A");

  do {
    const ts: TimeSlotInterface = {};
    ts.start_time = initial_time.format("hh:mm A");

    const end = initial_time.add(minutes, "minutes");
    ts.end_time = end.format("hh:mm A");
    initial_time = end;

    if (initial_time.isSameOrBefore(moment("20:00", "hh:mm A"))) {
      time_slots.push(ts);
    }
  } while (initial_time.isBefore(moment("20:00", "hh:mm A")));

  return time_slots;
};
