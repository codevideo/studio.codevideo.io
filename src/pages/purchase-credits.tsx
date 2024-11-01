import * as React from 'react';
import { Layout } from '../components/layout/Layout';
import { PurchaseCreditsPage } from '../components/pages/purchase-credits/PurchaseCreditsPage';

export default function PurchaseCredits() {
  return (
    <Layout withHeader={true}>
      <PurchaseCreditsPage/>
    </Layout>
  );
} 