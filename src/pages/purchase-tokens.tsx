import * as React from 'react';
import { Layout } from '../components/layout/Layout';
import SEO from '../components/layout/SEO';
import { PurchaseTokens } from '../components/pages/purchase-tokens/PurchaseTokens';

export default function PurchaseTokensPage() {
  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo: Purchase Tokens" />
      <PurchaseTokens/>
    </Layout>
  );
} 