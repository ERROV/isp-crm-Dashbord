
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import TicketsPage from './TicketsPage';
import { Permission } from '../types';
import type { Ticket, User, Subscriber, Reseller, Notification } from '../types';

interface PageProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  users: User[];
  subscribers: Subscriber[];
  resellers: Reseller[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const TicketsRoute: NextPage<PageProps> = (props) => {
  return <TicketsPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_TICKETS_OWN)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default TicketsRoute;
