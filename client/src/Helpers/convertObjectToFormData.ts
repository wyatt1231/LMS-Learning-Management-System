export default (payload: any): FormData => {
  const form_data = new FormData();

  for (var key in payload) {
    form_data.append(key, payload[key]);
  }

  return form_data;
};
