
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import UsersPage from './UsersPage';
import { Permission } from '../types';
import type { User, Role, Reseller } from '../types';

interface PageProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  roles: Role[];
  resellers: Reseller[];
}

const UsersRoute: NextPage<PageProps> = (props) => {
  return <UsersPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_USERS)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default UsersRoute;
