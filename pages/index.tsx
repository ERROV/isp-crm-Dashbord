
import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import DashboardPage from './DashboardPage';
import { initialTickets, initialTasks } from '../lib/mockData';
import type { Ticket, Task } from '../types';

interface PageProps {
  tickets: Ticket[];
  tasks: Task[];
}

const HomePage: NextPage<PageProps> = ({ tickets, tasks }) => {
  return <DashboardPage tickets={tickets} tasks={tasks} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  
  // In a real app, you would fetch this data from your database
  // based on the session.user.id and their permissions.
  const tickets = initialTickets;
  const tasks = initialTasks;
  
  return {
    props: {
      session,
      tickets: JSON.parse(JSON.stringify(tickets)),
      tasks: JSON.parse(JSON.stringify(tasks)),
    },
  };
};

export default HomePage;
