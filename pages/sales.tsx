
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import SalesPage from './SalesPage';
import { Permission } from '../types';
import type { SaleOrder, Contact } from '../types';

interface PageProps {
  sales: SaleOrder[];
  setSales: React.Dispatch<React.SetStateAction<SaleOrder[]>>;
  contacts: Contact[];
}

const SalesRoute: NextPage<PageProps> = (props) => {
  return <SalesPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_SALES)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default SalesRoute;
