'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const sidebarOptions = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Analytics', path: '/dashboard/analytics' },
  {
    name: 'Content Management',
    path: '/dashboard/content-management',
    subOptions: [
      { name: 'Medicinal Plants', path: '/dashboard/content-management/medicinal-plants' },
      { name: 'Diseases', path: '/dashboard/content-management/diseases' },
      { name: 'Drugs', path: '/dashboard/content-management/drugs' },
      { name: 'Lifestyle Modifications', path: '/dashboard/content-management/lifestyle-modifications' },
      {name:'Marriage and sex Matters', path :'/dashboard/content-management/marriage-and-sex-matters'},
      {name:"Courses", path:'/dashboard/content-management/courses'},
      { name: 'Exercise', path: '/dashboard/content-management/exercise' },
      { name: 'Health / Book Store', path: '/dashboard/content-management/health-book-store' },
      { name: 'Image Upload', path: '/dashboard/content-management/image-upload' },
      { name: 'Video Upload', path: '/dashboard/content-management/video-upload' },
      { name: 'Pregnancy Tips', path: '/dashboard/content-management/pregnancy-and-child-care' },
    ],
  },
  { name: 'Send Notification', path: '/dashboard/send-notification' },
  { name: 'Forum', path: '/dashboard/forum' },
  {name:"Clapp Coins", path:'/dashboard/clapp-coins'},
 
  {
    name: 'User Management',
    path: '/dashboard/user-management',
    subOptions: [
      { name: 'View Users', path: '/dashboard/user-management/view-users' },
      // { name: 'Add User', path: '/dashboard/user-management/add-user' },
    ],
  },
  {
    name: 'Admin Management',
    path: '/dashboard/admin-management',
    subOptions: [
      { name: 'Me', path: '/dashboard/admin-management/me' },

      { name: 'View Admins', path: '/dashboard/admin-management/view-admins' },
    ],
  },
  { name: 'Settings', path: '/dashboard/settings' },
  { name: 'Text Preview', path: '/dashboard/text-preview' },

];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSubOptions = (optionName: string) => {
    setExpanded((prev) => (prev === optionName ? null : optionName));
  };

  const isActive = (path: string) => pathname === path;
  const isPartiallyActive = (path: string) => pathname.startsWith(path) && pathname !== path;

  const handleLinkClick = (name: string, path: string) => {
    console.log(`Navigating to ${name} (${path})`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white flex flex-col overflow-y-auto">
        <h1 className="text-xl font-bold p-4">CONTENT STRATEGIES FOR CLAPP</h1>
        <nav className="flex flex-col space-y-2 mt-4">
          {sidebarOptions.map((option) => (
            <div key={option.name}>
              <div
                className={`px-4 py-2 text-lg hover:bg-green-600 w-11/12 mx-auto rounded cursor-pointer transition duration-200 ease-in-out ${
                  isActive(option.path) || isPartiallyActive(option.path) ? 'bg-green-600 text-xl font-semibold' : ''
                }`}
              >
                {option.subOptions ? (
                  <div
                    onClick={() => toggleSubOptions(option.name)}
                    className="flex justify-between items-center"
                  >
                    <span>{option.name}</span>
                    <span>{expanded === option.name ? '-' : '+'}</span>
                  </div>
                ) : (
                  <Link
                    href={option.path}
                    onClick={() => handleLinkClick(option.name, option.path)}
                    className="block w-full h-full"
                  >
                    {option.name}
                  </Link>
                )}
              </div>
              {option.subOptions && expanded === option.name && (
                <div className="ml-6 space-y-1">
                  {option.subOptions.map((subOption) => (
                    <Link
                      key={subOption.path}
                      href={subOption.path}
                      className={`block px-4 py-1 text-sm hover:bg-green-600 rounded transition duration-200 ease-in-out ${
                        isActive(subOption.path) ? 'bg-green-600 font-semibold' : ''
                      }`}
                      onClick={() => handleLinkClick(subOption.name, subOption.path)}
                    >
                      {subOption.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        {sidebarOptions.map((option) => {
          if (pathname.startsWith(option.path) && option.subOptions) {
            const subOption = option.subOptions.find((sub) => pathname === sub.path);
            return (
              <div key={option.name} className="mb-4">
                <h1 className="text-3xl font-bold text-green-800">{option.name}</h1>
                {subOption && <p className="text-xl text-gray-600 mt-2">{subOption.name}</p>}
              </div>
            );
          }
          return null;
        })}
        {children}
      </main>
    </div>
  );
}
