import { Amplify } from 'aws-amplify';
import config from './aws-exports';

export const configureAmplify = () => {
  Amplify.configure(config);
};
