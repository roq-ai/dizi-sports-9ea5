import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createLiveScore } from 'apiSdk/live-scores';
import { Error } from 'components/error';
import { liveScoreValidationSchema } from 'validationSchema/live-scores';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { LiveScoreInterface } from 'interfaces/live-score';

function LiveScoreCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: LiveScoreInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createLiveScore(values);
      resetForm();
      router.push('/live-scores');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<LiveScoreInterface>({
    initialValues: {
      match_id: '',
      score: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: liveScoreValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Live Score
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="match_id" mb="4" isInvalid={!!formik.errors?.match_id}>
            <FormLabel>Match Id</FormLabel>
            <Input type="text" name="match_id" value={formik.values?.match_id} onChange={formik.handleChange} />
            {formik.errors.match_id && <FormErrorMessage>{formik.errors?.match_id}</FormErrorMessage>}
          </FormControl>
          <FormControl id="score" mb="4" isInvalid={!!formik.errors?.score}>
            <FormLabel>Score</FormLabel>
            <Input type="text" name="score" value={formik.values?.score} onChange={formik.handleChange} />
            {formik.errors.score && <FormErrorMessage>{formik.errors?.score}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'live_score',
  operation: AccessOperationEnum.CREATE,
})(LiveScoreCreatePage);
