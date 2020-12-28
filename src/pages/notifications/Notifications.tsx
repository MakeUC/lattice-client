import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import LaunchIcon from '@material-ui/icons/Launch';
import Container from "@material-ui/core/Container";

import { useNotification } from '../../providers/NotificationProvider';
import { useProfileList } from '../../providers/ProfileListProvider';
import useDialogControl from '../../components/DialogControl.hook';
import NotificationDetails from './dialogs/notification-details';
import CopiedAlert from './dialogs/copied-alert';
import Spinner from '../../components/Spinner';
import { NotificationDetails as INotificationDetails } from '../../interfaces/notification';
import { HydratedProfile } from '../../interfaces/profile';

const action = (
  <Button className="font-secondary-dark" size="small">
    <LaunchIcon className="font-secondary-dark" />
  </Button>
);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  snackbar: {
    backgroundColor: '#8174ff',
    fontFamily: 'Open Sans'
  }
}));

export default function() {
  const classes = useStyles();
  const { isLoading, failedToLoad, notifications, getNotifications, readNotifications } = useNotification();
  const notificationDetailsDialog = useDialogControl();
  const copiedAlertDialog = useDialogControl();
  const { skills } = useProfileList();
  
  const [ openNotification, setOpenNotification ] = useState<INotificationDetails & { hydratedProfile: HydratedProfile }>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { readNotifications() }, []);

  const openNotificationDetails = (notification: INotificationDetails) => {
    const profile = notification.to;
    const profileSkills = skills.filter(skill => profile.skills?.includes(skill.title));
    const profileLookingFor = skills.filter(skill => profile.lookingFor?.includes(skill.title));
    const hydratedProfile: HydratedProfile = { ...profile, skills: profileSkills, lookingFor: profileLookingFor };

    setOpenNotification({ ...notification, hydratedProfile });
    notificationDetailsDialog.open();
  };

  /* const openCopiedAlert = async ([ content, text ]) => {
    await navigator.clipboard.writeText(text);
    copiedAlertDialog.setState([ content, text ]);
    copiedAlertDialog.open();
  }; */

  return (
    <Container className={classes.root + " nav-bar-margin"}>
      {
        isLoading ?
          <TextBox>Fetching notifications... <br /> <Spinner /></TextBox> :

        failedToLoad ? 
          <TextBox>
            <p>Error fetching notifications</p>
            <Button variant="contained" color="primary" onClick={getNotifications}>Try again</Button>
          </TextBox> :

        notifications.length ?
          <div className="pa4">
            {notifications.map(notification =>
              <SnackbarContent
                key={notification.notification.id}
                className={classes.snackbar}
                message={`You matched with ${notification.to?.name} ${notification.notification?.read ? `` : `(NEW)`}`}
                action={action}
                onClick={() => openNotificationDetails(notification)}
                style={{ marginBottom: `10px` }}
              />
            )}
          </div> :

          <TextBox>No notifications</TextBox>
      }
      {openNotification &&
        <NotificationDetails
          show={notificationDetailsDialog.show}
          onClose={notificationDetailsDialog.dismiss}
          matchedUser={openNotification.hydratedProfile}
          // onContactClick={openCopiedAlert}
        />
      }
      
      <CopiedAlert
        show={copiedAlertDialog.show}
        onClose={copiedAlertDialog.dismiss}
        state={copiedAlertDialog.state}
      />
    </Container>
  );
};

function TextBox({ children }) {
  return <Container className="nav-bar-margin">
    <div className="bg-white mv3 mv5-ns pa3 ph5-ns br3">
      {children}
    </div>
  </Container>;
};
