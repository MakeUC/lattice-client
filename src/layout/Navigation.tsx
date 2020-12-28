import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';

import { Badge } from '@material-ui/core';
import { useNotification } from '../providers/NotificationProvider';

import '../styles/Navigation.css';

const NavAction = ({ navigate, ...rest }: any) => {
  return <BottomNavigationAction {...rest} />;
}

const NotificationAction = () => {
  const { failedToLoad, notifications } = useNotification();
  const [ unreadCount, setUnreadCount ] = useState(0);
 
  useEffect(() => {
    const unreadCount = notifications.filter(({ notification: { read } }) => !read).length;
    setUnreadCount(unreadCount);
  }, [ notifications ]);
  
  return (
    <Badge
      badgeContent={failedToLoad ? `!` : unreadCount}
      color={failedToLoad ? `error` : `primary`}
    >
      <NotificationsIcon />
    </Badge>
  );
};

const Navigation = () => {
  return <>
    <BottomNavigation className="bottomNavigation" >
      <Link to="/notifications" className="notifications-link">
        <NavAction icon={<NotificationAction />} />
      </Link>
      <Link to="/" className="home-link">
        <NavAction icon={<HomeIcon />} />
      </Link>
      <Link to="/profile" className="profile-link">
        <NavAction icon={<PersonIcon />} />
      </Link>
    </BottomNavigation>
  </>;
};

export default Navigation;
