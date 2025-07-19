
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import ContactsPage from './ContactsPage';
import { Permission } from '../types';
import type { Contact } from '../types';

interface PageProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

const ContactsRoute: NextPage<PageProps> = (props) => {
  return <ContactsPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_CONTACTS)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default ContactsRoute;
