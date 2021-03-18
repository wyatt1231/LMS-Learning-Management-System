export default (stream): Promise<string> => {
  const concat = require("concat-stream");
  const { Base64Encode } = require("base64-stream");

  return new Promise((resolve, reject) => {
    const base64 = new Base64Encode();

    const cbConcat = (base64) => {
      resolve(base64);
    };

    stream
      .pipe(base64)
      .pipe(concat(cbConcat))
      .on("error", (error) => {
        reject(error);
      });
  });
};
