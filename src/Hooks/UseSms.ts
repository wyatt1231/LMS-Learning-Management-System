import axios from "axios";
import qs from "qs";

const SendSms = async (to: string, message: string) => {
  if (/^(09|\+639)\d{9}$/.test(to)) {
    const sms_response = await axios({
      method: "post",
      url: `https://api-mapper.clicksend.com/http/v2/send.php`,
      data: qs.stringify({
        username: `m.suner.378131@umindanao.edu.ph`,
        key: `74FC7C63-182F-42CD-08B9-0D34D55F849E`,
        to: to,
        message: message,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic 4B6BBD4D-DBD1-D7FD-7BF1-F58A909008D1`,
      },
    });
  }
};

export default {
  SendSms,
};
