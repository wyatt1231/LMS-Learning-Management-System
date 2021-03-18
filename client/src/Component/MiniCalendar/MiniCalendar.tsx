import React, { FC, memo } from "react";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./mini-calendar-styles.css";

export const MiniCalendar: FC<ReactDatePickerProps> = memo((props) => {
  return <DatePicker {...props} />;
});

export default MiniCalendar;
