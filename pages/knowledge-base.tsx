
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import KnowledgeBasePage from './KnowledgeBasePage';
import { Permission } from '../types';
import type { KnowledgeBaseArticle, User } from '../types';

interface PageProps {
  articles: KnowledgeBaseArticle[];
  setArticles: React.Dispatch<React.SetStateAction<KnowledgeBaseArticle[]>>;
  users: User[];
}

const KnowledgeBaseRoute: NextPage<PageProps> = (props) => {
  return <KnowledgeBasePage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: '/auth/login', permanent: false },
    };
  }

  if (!(session.user as any).permissions.includes(Permission.VIEW_KNOWLEDGEBASE)) {
    return {
      redirect: { destination: '/', permanent: false },
      props: {},
    };
  }
  
  return {
    props: { session },
  };
};

export default KnowledgeBaseRoute;
