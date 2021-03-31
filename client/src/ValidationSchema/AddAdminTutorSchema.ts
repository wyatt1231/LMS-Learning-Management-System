import * as yup from "yup";
import { validateEmail } from "../Helpers/helpGetRegexValidators";

export default yup.object({
  position: yup.string().required().max(150).label("Position"),
  firstname: yup.string().required().max(150).label("First Name"),
  lastname: yup.string().required().max(150).label("Last Name"),
  birth_date: yup.date().nullable().label("Birth Date"),
  email: yup.string().required().matches(validateEmail),
  gender: yup.string().nullable().required().max(1).label("Gender"),
  complete_address: yup.string().required().max(255).label("Complete Address"),
  mob_no: yup
    .string()
    .required()
    .matches(
      /^(09|\+639)\d{9}$/,
      "Mobile number must be a valid philippine mobile number."
    ),
});
