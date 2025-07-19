
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import AppraisalsPage from './AppraisalsPage';
import { Permission } from '../types';
import type { Appraisal, User } from '../types';

interface PageProps {
  appraisals: Appraisal[];
  setAppraisals: React.Dispatch<React.SetStateAction<Appraisal[]>>;
  users: User[];
}

const AppraisalsRoute: NextPage<PageProps> = (props) => {
  return <AppraisalsPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_APPRAISALS)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default AppraisalsRoute;
