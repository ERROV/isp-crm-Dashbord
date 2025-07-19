
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import SurveysPage from './SurveysPage';
import { Permission } from '../types';
import type { Survey } from '../types';

interface PageProps {
  surveys: Survey[];
  setSurveys: React.Dispatch<React.SetStateAction<Survey[]>>;
}

const SurveysRoute: NextPage<PageProps> = (props) => {
  return <SurveysPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_SURVEYS)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default SurveysRoute;
