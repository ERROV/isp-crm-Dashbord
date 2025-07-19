
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import DiscussPage from './DiscussPage';
import { Permission } from '../types';
import type { ChatMessage, User } from '../types';

interface PageProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  users: User[];
}

const DiscussRoute: NextPage<PageProps> = (props) => {
  return <DiscussPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_DISCUSS)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default DiscussRoute;
