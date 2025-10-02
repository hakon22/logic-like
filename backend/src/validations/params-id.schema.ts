import * as yup from 'yup';

export const paramsIdSchema = yup.object().shape({
  id: yup
    .number()
    .transform((value) => +value)
    .required(),
});