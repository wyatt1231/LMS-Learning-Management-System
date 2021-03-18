import React, { memo } from "react";
import MaskedInput from "react-text-mask";

const MaskedVitalSign = memo((props: any) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      // placeholder={""}
      mask={[/\d/, /\d/, /\d/, "/", /\d/, /\d/, /\d/]}
      // mask={(value: string) => {
      //   console.log(`value`, value);
      //   console.log(value.length - 1);

      //   if (value.length - 1 <= 5) {
      //     return [/\d/, /\d/, "/", /\d/, /\d/, /\d?/];
      //   } else {
      //     return ;
      //   }
      // }}

      showMask
      guide={true}
      keepCharPositions={true}
    />
  );
});

export default MaskedVitalSign;
