"use client";

import { useRouter } from 'next/navigation';

export default function ContentManagementEntry() {
  const router = useRouter();

  const contentSections = [
    { id: 1, name: 'Medicinal Plants', route: '/dashboard/content-management/medicinal-plants' },
    { id: 2, name: 'Drugs', route: '/dashboard/content-management/drugs' },
    { id: 3, name: 'Diseases', route: '/dashboard/content-management/diseases' },
    { id: 4, name: 'Lifestyle Modifications', route: '/dashboard/content-management/lifestyle-modifications' },
    { id: 5, name: 'Videos', route: '/content-management/video-upload' },
    { id: 6, name: 'Images', route: '/dashboard/content-management/image-upload' },
    { id: 7, name: 'Pregnancy Tips', route: '/content-management/pregnancy-tips' },
    { id: 10, name: 'Courses and Books', route: '/dashboard/content-management/courses' },
  ];

  return (
    <div className="p-8 bg-gray-100 h-screen flex flex-col items-center">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {contentSections.map((section) => (
          <div
            key={section.id}
            onClick={() => router.push(section.route)}
            className="cursor-pointer bg-white shadow-lg rounded-lg p-6 text-center hover:bg-green-50 transition"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{section.name}</h2>
            <p className="text-sm text-gray-500">Manage all {section.name.toLowerCase()} here.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
