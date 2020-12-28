import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Button, Container, Box } from '@material-ui/core';
import PassOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import { useAuth } from '../../providers/AuthProvider';
import Spinner from '../../components/Spinner';
import useDialogControl from '../../components/DialogControl.hook';
import ResetAlert from './dialogs/reset-alert';

interface ResetPasswordForm {
  email: string
  password: string
  confirmPassword: string
};

export default function () {
  const { resetToken } = useParams<{ resetToken: string }>();
  const { getResetInfo, resetPassword } = useAuth();
  const resetAlertDialog = useDialogControl();

  const { register, handleSubmit, setValue, errors, watch } = useForm<ResetPasswordForm>();

  const [ isLoading, setLoading ] = useState(true);
  const [ failedToLoad, setFailedToLoad ] = useState<Error>();
  const [ isSubmitting, setSubmitting ] = useState(false);
  const [ failedToSubmit, setFailedToSubmit ] = useState<Error>();
  const [ redirect, setRedirect ] = useState(``);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setSubmitting(true);
      await resetPassword(resetToken, data.password);
    } catch (err) {
      setFailedToSubmit(err);
    } finally {
      setSubmitting(false);
      resetAlertDialog.open();
    }
  };

  const done = () => {
    resetAlertDialog.dismiss();
    setRedirect(`/auth/login`);
  };

  useEffect(() => {
    (async function () {
      try {
        const email = await getResetInfo(resetToken);
        setValue(`email`, email);
      } catch (err) {
        setFailedToLoad(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [getResetInfo, resetToken, setValue]);

  const password = watch(`password`);

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white mv3 mv5-ns pa3 ph5-ns br3">
        {isLoading ? <h1 className="title">Loading...</h1> :
          failedToLoad ?
            <Box color="error.main" textAlign="center">
              <h3>{failedToLoad.message}</h3>
            </Box> :
            <>
              <h1 className="title">Reset Password</h1>
              <Box color="error.main" textAlign="center">{failedToSubmit?.message}</Box>
              <div className="mb4">
                <Grid container spacing={4} className="mb3 lattice-form-band" alignItems="flex-end">
                  <Grid className="lattice-icon" item>
                    <MailOutlineIcon />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">Email Address</p>
                  <Grid item className="lattice-form-input">
                    <TextField
                      name="email"
                      type="email"
                      variant="outlined"
                      fullWidth
                      disabled={true}
                      inputRef={register({ required: `Invalid email, please check the link provided` })}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="lattice-form-band" alignItems="flex-end">
                  <Grid item className="lattice-icon">
                    <PassOutlinedIcon />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">New Password</p>
                  <Grid item className="lattice-form-input">
                    <TextField
                      name="password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      inputRef={register({
                        required: `Please provide a password`,
                        minLength: 6
                      })}
                    />
                    {errors.password &&
                      <Box color="error.main">
                        {errors.password?.message || `Password must be atleast 6 characters.`}
                      </Box>
                    }
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="lattice-form-band" alignItems="flex-end">
                  <Grid item className="lattice-icon">
                    <PassOutlinedIcon />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">Confirm New Password</p>
                  <Grid item className="lattice-form-input">
                    <TextField
                      name="confirmPassword"
                      type="password"
                      variant="outlined"
                      fullWidth
                      inputRef={register({
                        validate: confirmPassword => password === confirmPassword
                      })}
                    />
                    {errors.confirmPassword &&
                      <Box color="error.main">
                        {errors.confirmPassword?.message || `Passwords must match.`}
                      </Box>
                    }
                  </Grid>
                </Grid>
                <Button
                  type="submit" 
                  variant="contained"
                  className="center" 
                  color="primary"
                  disabled={isSubmitting}
                >
                  {
                    isSubmitting ? <Spinner size="25px" /> : `Submit`
                  }
                </Button>
              </div>
            </>
        }
        </div>
      </form>
      <ResetAlert
        show={resetAlertDialog.show}
        onClose={done}
      />
      {redirect && <Redirect to={redirect} />}
    </Container>
  );
}
