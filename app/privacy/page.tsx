import type { Metadata } from 'next';
import PrivacyContent from './privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Policy & KVKK | Fatoş Yılmaz Casting',
  description: 'Privacy policy and KVKK disclosure for fatosyilmazcasting.com',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
