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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getLiveScoreById, updateLiveScoreById } from 'apiSdk/live-scores';
import { Error } from 'components/error';
import { liveScoreValidationSchema } from 'validationSchema/live-scores';
import { LiveScoreInterface } from 'interfaces/live-score';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function LiveScoreEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<LiveScoreInterface>(
    () => (id ? `/live-scores/${id}` : null),
    () => getLiveScoreById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: LiveScoreInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateLiveScoreById(id, values);
      mutate(updated);
      resetForm();
      router.push('/live-scores');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<LiveScoreInterface>({
    initialValues: data,
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
            Edit Live Score
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'live_score',
  operation: AccessOperationEnum.UPDATE,
})(LiveScoreEditPage);
