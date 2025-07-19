
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import ApprovalsPage from './ApprovalsPage';
import { Permission } from '../types';
import type { Approval, TimeOffRequest, User } from '../types';

interface PageProps {
  approvals: Approval[];
  setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>;
  timeOffRequests: TimeOffRequest[];
  setTimeOffRequests: React.Dispatch<React.SetStateAction<TimeOffRequest[]>>;
  users: User[];
}

const ApprovalsRoute: NextPage<PageProps> = (props) => {
  return <ApprovalsPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_APPROVALS)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default ApprovalsRoute;
