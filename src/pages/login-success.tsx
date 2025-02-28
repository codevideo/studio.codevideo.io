import * as React from 'react';
import {Layout} from '../components/layout/Layout';
import SEO from '../components/layout/SEO';
export interface ILoginSuccessProps {
}

export default function LoginSuccess (props: ILoginSuccessProps) {
  return (
    <Layout>
      <SEO title="CodeVideo: Login Success" />
      <h1>Login Success</h1>
    </Layout>
  );
}
