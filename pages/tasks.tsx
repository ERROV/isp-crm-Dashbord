
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import TasksPage from './TasksPage';
import { Permission } from '../types';
import type { Task, User, Notification } from '../types';

interface PageProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  users: User[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const TasksRoute: NextPage<PageProps> = (props) => {
  return <TasksPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_TASKS_OWN)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default TasksRoute;
