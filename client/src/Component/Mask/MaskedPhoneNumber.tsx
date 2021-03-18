import React, { memo } from "react";
import MaskedInput from "react-text-mask";

const MaskedPhoneNumber = memo((props: any) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      placeholder={"+639"}
      mask={[
        "+",
        "6",
        "3",
        "9",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      showMask
      guide={false}
    />
  );
});

export default MaskedPhoneNumber;
