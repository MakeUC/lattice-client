import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SlackIcon from '@material-ui/icons/AlternateEmail';
import PersonIcon from '@material-ui/icons/Person';
import DescriptionIcon from '@material-ui/icons/Description';
import { Button, Container, InputAdornment, Box } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AssignmentTurnedIn } from "@material-ui/icons";

import { useProfile } from "../../providers/ProfileProvider";
import ConfirmationDialog from './dialogs/profile-save-confirmation';

import "../../styles/Form.scss"
import { useProfileList } from '../../providers/ProfileListProvider';
import Spinner from '../../components/Spinner';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function() {
  const classes = useStyles();
  const { isLoading, profile, updateProfile } = useProfile();
  const { skills } = useProfileList();
  const { register, setValue, handleSubmit, errors, reset, watch } = useForm();

  const [ isSubmitting, setSubmitting ] = useState(false);
  const [ failedToSubmit, setFailedToSubmit ] = useState<string>();
  const [ showConfirmationModal, setShowModal ] = useState(false);
  const [ redirect, setRedirect ] = useState<string>();

  useEffect(()=> {
    register({ name: `skills` }, {
      required: true,
      validate: value => value.length <= 6
    });
    register({ name: `lookingFor` }, {
      required: true,
      validate: value => value.length <= 3
    });
  }, [ register ]);

  useEffect(() => {
    const profileSkills = skills?.filter(skill => profile?.skills?.includes(skill.title));
    const profileLookingFor = skills?.filter(skill => profile?.lookingFor?.includes(skill.title));

    reset({ ...profile, skills: profileSkills, lookingFor: profileLookingFor });
  }, [ reset, skills, profile ]);

  useEffect(() => {
    setFailedToSubmit((!!Object.keys(errors).length) ? `Please fix the above errors` : undefined);
  }, [ errors ]);

  const onSubmit = async data => {
    try {
      setSubmitting(true);

      const skills = data.skills.map(s => s.title);
      const lookingFor = data.lookingFor.map(s => s.title);

      await updateProfile({ ...data, skills, lookingFor });

      setShowModal(true);
    } catch(err) {
      setFailedToSubmit(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onModalDismiss = () => {
    setShowModal(false);
    setRedirect(`/profile`);
  };

  const profileSkills = watch(`skills`) || [];
  const profileLookingFor = watch(`lookingFor`)|| [];

  return (
    <Container className={/* classes.root +  */" nav-bar-margin"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white mv3 mv5-ns pa3 ph5-ns br3">
          <h1 className="title">Your Profile</h1>
          {isLoading ? `Loading...` :
            <>
              <div className={classes.margin + " font-opensans"}>
                <Grid container spacing={4} className="mb3 lattice-form-band" alignItems="flex-end">
                  <Grid className="lattice-icon" item>
                    <PersonIcon />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">Full name</p>
                  <Grid item className="lattice-form-input">
                    <TextField
                      fullWidth
                      name="name"
                      id="input-with-icon-grid"
                      variant="outlined" 
                      placeholder="John Doe"
                      inputRef={register({ required: `This field is required` })}
                      error={!!errors.name}
                      helperText={errors.name?.message || `Every hacker needs a public identity.`}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="mb3 lattice-form-band" alignItems="flex-end">
                  <Grid item className="lattice-icon">
                    <DescriptionIcon />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">Project Idea</p>
                  <Grid item className="lattice-form-input">
                    <TextField
                      fullWidth
                      multiline
                      name="idea"
                      id="input-with-icon-grid"
                      variant="outlined"
                      placeholder="A coronavirus map"
                      inputRef={register({ required: `This field is required`, maxLength: 250 })}
                      error={!!errors.idea}
                      helperText={
                        errors.idea?.message ||
                        (
                          errors.idea?.type === `maxLength` ?
                          `Please write no more than 250 characters` :
                          `Share your innovative idea. It's fine if you don't have one.`
                        )
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="mb3 lattice-form-band" alignItems="flex-end">
                  <Grid className="lattice-icon" item>
                    <AssignmentTurnedIn />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">Your skills</p>
                  <Grid item className="lattice-form-input">
                    <Autocomplete
                      multiple
                      filterSelectedOptions
                      id="tags-outlined"
                      options={skills} // TODO: Need to be taken from DB ideally
                      getOptionLabel={(option) => option.title}
                      value={profileSkills}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label=""
                          placeholder="Skills"
                          error={!!errors.skills}
                          helperText={(errors.skills?.type === `required`) ?
                            `Please select atleast one` :
                            `Please select no more than 6`
                          }
                        />
                      )}
                      onChange={(e, skills) => setValue(`skills`, skills)}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="mb3 lattice-form-band" alignItems="flex-end">
                  <Grid className="lattice-icon" item>
                    <AssignmentTurnedIn />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">Looking For</p>
                  <Grid item className="lattice-form-input">
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={skills} // TODO: Need to be taken from DB ideally
                      getOptionLabel={(option) => option.title}
                      filterSelectedOptions
                      value={profileLookingFor}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label=""
                          placeholder="Skills"
                          error={!!errors.lookingFor}
                          helperText={(errors.lookingFor?.type === `required`) ?
                            `Please select atleast one` :
                            `Please select no more than 3`
                          }
                        />
                      )}
                      onChange={(e, skills) => setValue(`lookingFor`, skills)}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4} className="mb3 lattice-form-band" alignItems="flex-end">
                  <Grid item className="lattice-icon">
                    <SlackIcon />
                  </Grid>
                  <p className="lattice-form-label mb0 font-gray">Slack handle</p>
                  <Grid item className="lattice-form-input">
                    <TextField
                      fullWidth
                      name="slack"
                      id="input-with-icon-grid"
                      variant="outlined"
                      inputRef={register({ required: `This field is required` })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">@</InputAdornment>
                      }}
                      error={!!errors.slack}
                      helperText={errors.slack?.message || `Please provide the handle you have on the MakeUC Slack. Your matches will use this to contact you.`}
                    />
                  </Grid>
                </Grid>
              </div>
              <Button
                type="submit"
                variant="contained"
                className="center"
                color="primary"
                disabled={isSubmitting}
              >
                {
                  isSubmitting ? <Spinner size="25px" /> : `Save`
                }
              </Button>
              {failedToSubmit &&
                <Box color="error.main" className="mt2">{failedToSubmit}</Box>
              }
            </>
          }
        </div>
      </form>
      <ConfirmationDialog show={showConfirmationModal} onClose={onModalDismiss} />
      {redirect && <Redirect to={redirect} />}
    </Container>
  );
};
