
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import TimeOffPage from './TimeOffPage';
import { Permission } from '../types';
import type { TimeOffRequest, Approval } from '../types';

interface PageProps {
  timeOffRequests: TimeOffRequest[];
  setTimeOffRequests: React.Dispatch<React.SetStateAction<TimeOffRequest[]>>;
  setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>;
}

const TimeOffRoute: NextPage<PageProps> = (props) => {
  return <TimeOffPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_TIME_OFF)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default TimeOffRoute;
