import React, { useState } from 'react'
import {BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill , BsJustify, BsChevronRight, BsChevronDown  }
 from 'react-icons/bs'
 import './SideBar.css'
import { menuItems } from '../../../config/menuConfig';
import SideBarMenuItem from '../SidebarMenuItem/SideBarMenuItem';
const SideBar = ({openSidebarToggle, OpenSidebar}) =>{
 
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <BsCart3  className='icon_header'/> <span>SHOP</span>
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>

            <ul className='sidebar-list'>
                {menuItems.map((item, index) => <SideBarMenuItem menu={item} index={index} key={index}/>)}
                 
                {/* <li className='sidebar-list-item'>
                    <a href="">
                        <BsGrid1X2Fill className='icon'/>  <span>Dashboard</span>
                    </a>
                </li>
                
                <li className='sidebar-list-item'>
                    <a href="">
                        <BsFillGrid3X3GapFill className='icon'/> <span>Categories</span>
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="">
                        <BsPeopleFill className='icon'/> <span>Customers</span>
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="">
                        <BsListCheck className='icon'/> <span>Inventory</span>
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="">
                        <BsMenuButtonWideFill className='icon'/> <span>Reports</span>
                    </a>
                </li>
                <li className='sidebar-list-item'>
                    <a href="">
                        <BsFillGearFill className='icon'/> <span>Setting</span>
                    </a>
                </li>

                <li className={`sidebar-list-item ${expandedMenus.products ? 'active' : ''}`}>
                    <div className="menu-header" onClick={() => toggleMenu('products')}>
                        <BsFillArchiveFill className='icon'/> <span>Products</span>
                        {expandedMenus.products ? <BsChevronDown className="menu-arrow" /> : <BsChevronRight className="menu-arrow" />}
                    </div>
                    {expandedMenus.products && (
                    <ul className="submenu">
                        <li><a href="">All Products</a></li>
                        <li><a href="">Add New</a></li>
                        <li><a href="">Categories</a></li>
                    </ul>
                    )}
                </li> */}
                
            </ul>
        </aside>
    )
}

export default SideBar