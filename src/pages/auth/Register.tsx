import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PassOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import { Button, Container, Box } from '@material-ui/core';

import { useAuth } from '../../providers/AuthProvider';

import "../../styles/Form.scss"
import Spinner from '../../components/Spinner';

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
};

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function () {
  const classes = useStyles();
  const { getRegistrantEmail, register } = useAuth();
  const { registrantId } = useParams<{ registrantId: string }>();

  const { register: registerInput, handleSubmit, setValue, errors, watch } = useForm<RegisterForm>();

  const [ isLoading, setLoading ] = useState(true);
  const [ failedToLoad, setFailedToLoad ] = useState<Error>();
  const [ email, setEmail ] = useState<string>();
  const [ isSubmitting, setSubmitting ] = useState(false);
  const [ failedToSubmit, setFailedToSubmit ] = useState<Error>();

  useEffect(() => {
    (async function () {
      try {
        const email = await getRegistrantEmail(registrantId);
        setEmail(email);
      } catch (err) {
        setFailedToLoad(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [getRegistrantEmail, registrantId, setValue]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setSubmitting(true);
      await register(registrantId, data.password);
    } catch (err) {
      setFailedToSubmit(err);
    } finally {
      setSubmitting(false);
    }
  };

  const password = watch(`password`);

  return (
    <Container /* className={classes.root} */>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white mv3 mv5-ns pa3 ph5-ns br3">
          {isLoading ? <h1 className="title">Loading...</h1> :
            failedToLoad ?
              <Box color="error.main" textAlign="center">
                <h3>{failedToLoad.message}</h3>
              </Box> :
              <>
                <h1 className="title">Create Account</h1>
                <Box color="error.main" textAlign="center">{failedToSubmit && failedToSubmit.message}</Box>
                <div className={classes.margin + " font-opensans"}>
                  <Grid container spacing={4} className="lattice-form-band" alignItems="flex-end">
                    <Grid className="lattice-icon" item>
                      <MailOutlineIcon />
                    </Grid>
                    <p className="lattice-form-label mb0 font-gray">Email Address</p>
                    <Grid item className="lattice-form-input">
                      <TextField
                        name="email"
                        type="email"
                        id="input-with-icon-grid"
                        variant="outlined"
                        disabled={true}
                        value={email}
                        inputRef={registerInput({ required: `Invalid email, please check the link provided` })}
                        fullWidth
                      />
                      {errors.email &&
                        <Box color="error.main">{errors.email.message}</Box>
                      }
                    </Grid>
                  </Grid>
                  <Grid container spacing={4} className="lattice-form-band" alignItems="flex-end">
                    <Grid item className="lattice-icon">
                      <PassOutlinedIcon />
                    </Grid>
                    <p className="lattice-form-label mb0 font-gray">Password</p>
                    <Grid item className="lattice-form-input">
                      <TextField
                        name="password"
                        type="password"
                        id="input-with-icon-grid"
                        variant="outlined"
                        fullWidth
                        inputRef={registerInput({
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
                    <p className="lattice-form-label mb0 font-gray">Confirm Password</p>
                    <Grid item className="lattice-form-input">
                      <TextField
                        name="confirmPassword"
                        type="password"
                        id="input-with-icon-grid"
                        variant="outlined"
                        fullWidth
                        inputRef={registerInput({
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
                  <input type="hidden" name="registrantId" value={registrantId} />
                  <Button
                    type="submit"
                    variant="contained"
                    className="center"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {
                      isSubmitting ? <Spinner size="25px" /> : `Sign Up`
                    }
                  </Button>
                  <Box className="mt4">
                    Already registered? Log in <Link to="/auth/login">here</Link>
                  </Box>
                </div>
              </>
          }
        </div>
      </form>
    </Container>
  );
}
