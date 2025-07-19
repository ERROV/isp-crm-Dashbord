
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import TimesheetsPage from './TimesheetsPage';
import { Permission } from '../types';
import type { TimesheetEntry } from '../types';

interface PageProps {
  timesheets: TimesheetEntry[];
  setTimesheets: React.Dispatch<React.SetStateAction<TimesheetEntry[]>>;
}

const TimesheetsRoute: NextPage<PageProps> = (props) => {
  return <TimesheetsPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_TIMESHEETS)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default TimesheetsRoute;
