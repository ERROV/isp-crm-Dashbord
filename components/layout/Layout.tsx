import React from 'react';
// These will need to be refactored to not use react-router-dom and to fetch data
// from API endpoints. For now, we stub them.
// import Sidebar from './Sidebar';
// import Header from './Header';

const Sidebar = () => (
    <aside className="w-64 bg-slate-800 dark:bg-slate-900 text-white flex flex-col flex-shrink-0">
         <div className="h-20 flex items-center justify-center text-2xl font-bold border-b border-slate-700 dark:border-slate-800">
            <span className="text-white">Hala FTTH</span>
        </div>
        <nav className="p-4">
            {/* Nav links will be added back here, using Next.js <Link> */}
        </nav>
    </aside>
);

const Header = () => (
     <header className="bg-white dark:bg-slate-800 shadow-sm p-4 flex justify-end items-center border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        {/* Header content like theme toggler etc. will be added back here */}
    </header>
);


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
