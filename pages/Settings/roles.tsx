
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import RolesPage from './RolesPage';
import SettingsLayout from './SettingsLayout';
import { Permission } from '../../types';
import type { Role } from '../../types';

interface PageProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const RolesRoute: NextPage<PageProps> = (props) => {
  return (
    <SettingsLayout>
      <RolesPage {...props} />
    </SettingsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.MANAGE_ROLES)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default RolesRoute;
