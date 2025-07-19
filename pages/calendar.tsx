
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import CalendarPage from './CalendarPage';
import { Permission } from '../types';
import type { CalendarEvent } from '../types';

interface PageProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const CalendarRoute: NextPage<PageProps> = (props) => {
  return <CalendarPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_CALENDAR)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default CalendarRoute;
