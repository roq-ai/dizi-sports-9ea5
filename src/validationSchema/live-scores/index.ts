import * as yup from 'yup';

export const liveScoreValidationSchema = yup.object().shape({
  match_id: yup.string().required(),
  score: yup.string().required(),
  user_id: yup.string().nullable(),
});
