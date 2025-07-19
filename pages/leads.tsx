
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import LeadsPage from './LeadsPage';
import { Permission } from '../types';
import type { Lead, User } from '../types';

interface PageProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  users: User[];
}

const LeadsRoute: NextPage<PageProps> = (props) => {
  return <LeadsPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_LEADS)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default LeadsRoute;
