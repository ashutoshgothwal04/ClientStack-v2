// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import Icon from '../AppIcon';

// const Breadcrumb = ({ customItems = null }) => {
//   const location = useLocation();
  
//   const routeMap = {
//     '/dashboard': 'Dashboard',
//     '/project-management': 'Projects',
//     '/billing-invoices': 'Billing & Invoices',
//     '/clients': 'Clients',
//     '/contracts': 'Contracts',
//     '/reports': 'Reports',
//     '/settings': 'Settings',
//     '/help': 'Help & Support'
//   };

//   const generateBreadcrumbs = () => {
//     if (customItems) {
//       return customItems;
//     }

//     const pathSegments = location.pathname?.split('/')?.filter(segment => segment);
//     let breadcrumbs = [];
//     let currentPath = '';
//     if (!pathSegments.length || location.pathname === '/dashboard') {
//       breadcrumbs.push({ label: 'Home', path: '/dashboard' });
//     }
//     pathSegments?.forEach((segment, index) => {
//       currentPath += `/${segment}`;
//       // Prevent duplicate '/dashboard' crumb
//       if (currentPath === '/dashboard' && breadcrumbs.some(b => b.path === '/dashboard')) {
//         return;
//       }
//       const label = routeMap?.[currentPath] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1);
//       breadcrumbs?.push({
//         label,
//         path: currentPath,
//         isLast: index === pathSegments?.length - 1
//       });
//     });

//     return breadcrumbs;
//   };

//   const breadcrumbs = generateBreadcrumbs();

//   if (breadcrumbs?.length <= 1) {
//     return null;
//   }

//   return (
//     <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
//       {breadcrumbs?.map((crumb, index) => (
//         <div key={crumb?.path} className="flex items-center space-x-2">
//           {index > 0 && (
//             <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
//           )}
          
//           {crumb?.isLast ? (
//             <span className="text-card-foreground font-medium" aria-current="page">
//               {crumb?.label}
//             </span>
//           ) : (
//             <Link
//               to={crumb?.path}
//               className="hover:text-card-foreground transition-smooth"
//             >
//               {crumb?.label}
//             </Link>
//           )}
//         </div>
//       ))}
//     </nav>
//   );
// };

// export default Breadcrumb;

import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";

const routeMap = {
  "/dashboard": "Dashboard",
  "/project-management": "Projects",
  "/billing-invoices": "Billing & Invoices",
  "/clients": "Clients",
  "/contracts": "Contracts",
  "/reports": "Reports",
  "/settings": "Settings",
  "/help": "Help & Support",
};

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    if (customItems?.length) {
      return customItems.map((item, index) => ({
        ...item,
        isLast: index === customItems.length - 1,
        _key: `${item.path || item.label}-${index}`,
      }));
    }

    const segments = location.pathname.split("/").filter(Boolean);
    let currentPath = "";
    const crumbs = [];

    if (!segments.length || location.pathname === "/dashboard") {
      crumbs.push({
        label: "Dashboard",
        path: "/dashboard",
        isLast: true,
        _key: "dashboard",
      });
      return crumbs;
    }

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      if (currentPath === "/dashboard") return;

      const label =
        routeMap[currentPath] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);

      crumbs.push({
        label,
        path: currentPath,
        isLast: index === segments.length - 1,
        _key: `${currentPath}-${index}`,
      });
    });

    return crumbs;
  }, [location.pathname, customItems]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center text-sm text-muted-foreground"
    >
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb._key} className="flex items-center gap-2">
          {index > 0 && (
            <Icon
              name="ChevronRight"
              size={14}
              className="text-muted-foreground"
            />
          )}

          {crumb.isLast ? (
            <span
              aria-current="page"
              className="font-medium text-foreground"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
