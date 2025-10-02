import * as yup from 'yup';

export const paginationSchema = yup.object().shape({
  limit: yup
    .number()
    .integer()
    .transform((value) => +value)
    .min(1)
    .notRequired(),
  offset: yup
    .number()
    .integer()
    .transform((value) => +value)
    .min(0)
    .notRequired(),
});