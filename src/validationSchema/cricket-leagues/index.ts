import * as yup from 'yup';

export const cricketLeagueValidationSchema = yup.object().shape({
  name: yup.string().required(),
  stats: yup.string().required(),
  user_id: yup.string().nullable(),
});
