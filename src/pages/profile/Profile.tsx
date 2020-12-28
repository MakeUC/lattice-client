import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
// import SlackIcon from '@material-ui/icons/AlternateEmail';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
// import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Button, Container } from '@material-ui/core';

import { useAuth } from '../../providers/AuthProvider';
import { useProfile } from '../../providers/ProfileProvider';
import { useNotification } from '../../providers/NotificationProvider';
import useDialogControl from '../../components/DialogControl.hook';
import PromiseButton from '../../components/PromiseButton';
import ProfileTour from '../../tours/ProfileTour';
import ToggleVisibilityConfirmation from './dialogs/toggle-visibility-confirmation';
import ToggleVisibilityAlert from './dialogs/toggle-visibility-alert';
import ChangePassword, { ChangePasswordForm } from './dialogs/change-password';
import ChangePasswordAlert from './dialogs/change-password-alert';
import LogoutConfirmation from './dialogs/logout-confirmation';

import '../../styles/Profile.scss'

export default function() {
  const { logout, changePassword } = useAuth();
  const { isLoading, profile, toggleVisibility } = useProfile();
  const { pushPermission, requestNotificationPermission } = useNotification();

  const toggleVisibilityConfirmationDialog = useDialogControl();
  const toggleVisibilityAlertDialog = useDialogControl();
  const changePasswordDialog = useDialogControl();
  const changePasswordAlertDialog = useDialogControl();
  const logoutConfirmationDialog = useDialogControl();

  const [ redirect, setRedirect ] = useState<string>();

  const redirectToProfileForm = () => setRedirect(`/profile/edit`);

  const onToggleVisibility = async () => {
    await toggleVisibility();
    toggleVisibilityConfirmationDialog.dismiss();
    toggleVisibilityAlertDialog.open();
  };

  const onPasswordChange = async (data: ChangePasswordForm) => {
    try {
      await changePassword(data.oldPassword, data.newPassword);
    } catch(err) {
      changePasswordAlertDialog.setState(err);
    } finally {
      changePasswordDialog.dismiss();
      changePasswordAlertDialog.open();
    }
  };

  const onLogout = async () => {
    await logout();
    logoutConfirmationDialog.dismiss();
  };

  return (
    <Container className="nav-bar-margin">
      <div className="bg-white mv3 mv5-ns pa3 ph5-ns br3">
        <h1 className="title">Lattice Account</h1>
          {isLoading ? `Loading...` :
            <>
              <div className="mb4">
                <Grid container spacing={4} className="mb3 lattice-form-band" alignItems="flex-end">
                  <Grid className="lattice-icon" item>
                    <PersonIcon />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">{profile?.name}</p>
                </Grid>
                {/* <Grid container spacing={4} className="mb3 lattice-form-band" alignItems="flex-end">
                  <Grid className="lattice-icon" item>
                    <MailOutlineIcon />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">{profile?.email}</p>
                </Grid>
                <Grid container spacing={4} className="mb3 lattice-form-band" alignItems="flex-end">
                  <Grid item className="lattice-icon">
                    <SlackIcon />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">{profile?.slack}</p>
                </Grid> */}
              </div>

              <Button
                variant="contained"
                className="center profile-button edit-profile-button"
                color="primary"
                onClick={redirectToProfileForm}
              >Edit Profile</Button>

              <Button
                variant="contained"
                className="center profile-button toggle-visibility-button"
                color="primary"
                onClick={toggleVisibilityConfirmationDialog.open}
              >
                {profile?.visible ?
                  <>
                    <VisibilityIcon /> &nbsp; Mark Not Visible
                  </> :
                  <>
                    <VisibilityOffIcon /> &nbsp; Mark Visible
                  </>
                }
              </Button>

              {
                pushPermission === `granted` ? null :
                  <PromiseButton
                    variant="contained"
                    className="center profile-button notification-request-button"
                    color={pushPermission === `denied` ? `secondary` : `primary`}
                    onClick={requestNotificationPermission}
                    disabled={pushPermission === `denied`}
                  >
                    {
                      pushPermission === `default` ?
                        `Enable Push Notification` :
                        `Push Notification Permission Denied`
                    }
                  </PromiseButton>
              }

              <Button
                variant="contained"
                className="center profile-button"
                color="primary"
                onClick={changePasswordDialog.open}
              >Change Password</Button>

              <Button
                variant="contained"
                className="center profile-button"
                color="primary"
                onClick={logoutConfirmationDialog.open}
              >Logout</Button>
            </>
          }
          <ToggleVisibilityConfirmation
            show={toggleVisibilityConfirmationDialog.show}
            onClose={toggleVisibilityConfirmationDialog.dismiss}
            onSuccess={onToggleVisibility}
            visible={profile?.visible}
          />
          <ToggleVisibilityAlert
            show={toggleVisibilityAlertDialog.show}
            onClose={toggleVisibilityAlertDialog.dismiss}
            visible={profile?.visible}
          />
          <ChangePassword
            show={changePasswordDialog.show}
            onClose={changePasswordDialog.dismiss}
            onSuccess={onPasswordChange}
          />
          <ChangePasswordAlert
            show={changePasswordAlertDialog.show}
            onClose={changePasswordAlertDialog.dismiss}
            error={changePasswordAlertDialog.state}
          />
          <LogoutConfirmation
            show={logoutConfirmationDialog.show}
            onClose={logoutConfirmationDialog.dismiss}
            onSuccess={onLogout}
          />
          {redirect && <Redirect to={redirect} />}
      </div>
      <ProfileTour />
    </Container>
  );
};
