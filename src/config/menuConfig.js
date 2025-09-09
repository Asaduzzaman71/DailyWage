import {
  BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, 
  BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';

export const menuItems = [
  {
    title: "Dashboard",
    icon: BsGrid1X2Fill,
    path: "/dashboard"
  },
  {
    title: "Users",
    icon: BsPeopleFill,
    path: "/users"
  },
  // {
  //   title: "Products",
  //   icon: BsFillArchiveFill,
  //   submenu: [
  //     {
  //       title: "All Products",
  //       path: "/products"
  //     },
  //     {
  //       title: "Add New",
  //       path: "/products/new"
  //     },
  //     {
  //       title: "Categories",
  //       path: "/products/categories"
  //     }
  //   ]
  // },
  {
    title: "Categories",
    icon: BsFillGrid3X3GapFill,
    path: "/categories"
  },
  // {
  //   title: "Customers",
  //   icon: BsPeopleFill,
  //   submenu: [
  //     {
  //       title: "All Customers",
  //       path: "/customers"
  //     },
  //     {
  //       title: "Add New",
  //       path: "/customers/new"
  //     }
  //   ]
  // },
  {
    title: "Inventory",
    icon: BsListCheck,
    path: "/inventory"
  },
  {
    title: "Reports",
    icon: BsMenuButtonWideFill,
    path: "/reports"
  },
  {
    title: "Settings",
    icon: BsFillGearFill,
    path: "/settings"
  }
];