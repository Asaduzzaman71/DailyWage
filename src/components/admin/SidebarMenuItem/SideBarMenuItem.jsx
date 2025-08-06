import React, { useState, useRef, useEffect } from 'react';
import { BsChevronRight, BsChevronDown } from 'react-icons/bs';
import './SideBarMenuItem.css';

const SideBarMenuItem = ({ menu, index }) => {
    const [expandedMenus, setExpandedMenus] = useState({});
    const [isAnimating, setIsAnimating] = useState(false);
    const submenuRef = useRef(null);
    
    const toggleMenu = (menuName) => {
        const wasOpen = expandedMenus[menuName];
        
        if (wasOpen) {
            setExpandedMenus(prev => ({ ...prev, [menuName]: false }));
        } else {
            // Open immediately
            setExpandedMenus(prev => ({ ...prev, [menuName]: true }));
        }
    };

    const IconComponent = menu.icon;
    const hasSubmenu = menu.submenu && menu.submenu.length > 0;
    const isOpen = expandedMenus[menu.title];

    return (
        <li key={`${menu.title}-${index}`} className={`sidebar-list-item ${isOpen ? 'active' : ''}`}>
            {hasSubmenu ? (
                <> 
                    <div className="menu-header" onClick={() => toggleMenu(menu.title)}>
                        <IconComponent className='icon' />  
                        <span>{menu.title}</span>
                        {isOpen ? <BsChevronDown className="menu-arrow" /> : <BsChevronRight className="menu-arrow" />}
                    </div>
                    
                    {/* Always render submenu but control visibility with CSS */}
                    <ul 
                        className={`submenu ${isOpen ? 'show' : ''}`}
                        ref={submenuRef}
                    >
                        {menu.submenu.map((subItem, subIndex) => (
                            <li key={`${subItem.title}-${subIndex}`}>
                                <a href={subItem.path}>{subItem.title}</a>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <a href={menu.path}>
                    <IconComponent className='icon' />
                    <span>{menu.title}</span>
                </a>
            )}
        </li>
    );
};

export default SideBarMenuItem;