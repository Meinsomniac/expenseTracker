import {Button, Text, View} from 'native-base';
import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {RHFTextField} from '../../components/form/RHFTextField';
import {FormProvider, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {validations} from '../../utils/commonValidations';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSignUpMutation} from '../../redux/auth/authActions';
import {Link, useNavigation} from '@react-navigation/native';
import {paths} from '../../routes/paths';
import {useDispatch} from 'react-redux';

const SignUpSchema = Yup.object().shape({
  firstName: validations.firstName(),
  lastName: validations.lastName(),
  email: validations.email(),
  password: validations.password(),
});
export default function SignUp() {
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  //Hooks
  const methods = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: yupResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  //Apis
  const [signUp] = useSignUpMutation();

  const {handleSubmit} = methods;

  const onSubmit = useCallback(
    async values => {
      const res = await signUp(values);
      if (res?.data?.accessToken) {
        await setStorage('token', res?.data?.accessToken);
        dispatch(setUserDetails(res?.data?.profile));
        navigate(paths.home);
      }
    },
    [signUp],
  );

  return (
    <FormProvider {...methods}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.flexStyle}
        style={styles.body()}
        extraScrollHeight={120}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <RHFTextField name={'firstName'} placeholder={'First Name'} />
          <RHFTextField name={'lastName'} placeholder={'Last Name'} />
          <RHFTextField name={'email'} placeholder={'Email'} />
          <RHFTextField name={'password'} placeholder={'Password'} />
          <Button onPress={handleSubmit(onSubmit)} style={styles.continueBtn}>
            <Text color={'white'}>Submit</Text>
          </Button>
        </View>
        <Text>
          Didn't have a account?{' '}
          <Link to={{screen: paths.signIn}} style={styles.linkStyle}>
            Sign In
          </Link>
        </Text>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  body: () => ({
    flex: 1,
    backgroundColor: '#E5E5E5',
  }),
  continueBtn: {
    borderRadius: 10,
    backgroundColor: '#7F3DFF',
  },
  content: {
    width: '80%',
    elevation: 2,
    padding: 20,
    backgroundColor: '#fff',
    rowGap: 15,
  },
  flexStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },
  linkStyle: {
    textDecorationLine: 'underline',
    textDecorationColor: '#7F3DFF',
  },
});
