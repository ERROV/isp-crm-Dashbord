
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import SubscribersPage from './SubscribersPage';
import { Permission } from '../types';
import type { Subscriber, Reseller } from '../types';

interface PageProps {
  subscribers: Subscriber[];
  setSubscribers: React.Dispatch<React.SetStateAction<Subscriber[]>>;
  resellers: Reseller[];
}

const SubscribersRoute: NextPage<PageProps> = (props) => {
  return <SubscribersPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_SUBSCRIBERS)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default SubscribersRoute;
