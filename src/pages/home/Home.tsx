import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "@material-ui/core";

import { useProfile } from "../../providers/ProfileProvider";
import { useProfileList } from "../../providers/ProfileListProvider";
import { useMatch } from "../../providers/MatchProvider";
import Spinner from "../../components/Spinner";
import useDialogControl from '../../components/DialogControl.hook';
import HomeTour from '../../tours/HomeTour';
import ResetTour from "../../tours/ResetTour";
import Deck from "./Deck";
import ResetConfirmation from './dialogs/reset-confirmation';
import ResetAlert from './dialogs/reset-alert';
import ToggleVisibilityConfirmation from './dialogs/toggle-visibility-confirmation';
import ToggleVisibilityAlert from './dialogs/toggle-visibility-alert';
import { HydratedProfile } from "../../interfaces/profile";
import { WrapperComponent } from "../../interfaces/wrapper";

export default function () {
  const profileState = useProfile();
  const profileListState = useProfileList();

  const [ hydratedProfiles, setHydratedProfiles ] = useState<Array<HydratedProfile>>();

  const { profile } = profileState;
  const { isLoading, skills, profiles } = profileListState;

  useEffect(() => {
    if(skills.length) {
      const hydratedProfiles = profiles.map((profile): HydratedProfile => {
        const profileSkills = skills.filter(skill => profile?.skills?.includes(skill.title));
        const profileLookingFor = skills.filter(skill => profile?.lookingFor?.includes(skill.title));
    
        return { ...profile, skills: profileSkills, lookingFor: profileLookingFor };
      });

      setHydratedProfiles(hydratedProfiles);
    }
  }, [ profiles, skills ]);

  return (
    <>
      <LoadingText />
      <SetupText />
      <ResetText />
      <ErrorText />

      {profile?.visible && !isLoading && !!hydratedProfiles?.length &&
        <>
          <Deck data={hydratedProfiles} />
          <HomeTour />
        </>
      }

    </>
  );
};

const TextBox: WrapperComponent = ({ children }) => {
  return <Container className="nav-bar-margin">
    <div className="bg-white mv3 mv5-ns pa3 ph5-ns br3">
      {children}
    </div>
  </Container>;
};

const SetupText = () => {
  const { isLoading, failedToLoad, profile } = useProfile();

  return (
    (!isLoading && !failedToLoad) ? (
      !profile?.started ? 
      <TextBox>
        Welcome! Let's get you set up. Head over to your <Link to="/profile/edit">profile page</Link> to get started.
      </TextBox> :
  
      !profile.completed ?
      <TextBox>
        Welcome back! Head over to your <Link to="/profile/edit">profile page</Link> to complete your profile and start searching for potential teammates!
      </TextBox> :
  
      !profile.visible ?
      <TextBox>
        Welcome back! Mark your profile "visible" from your <Link to="/profile">profile page</Link> to start searching for potential teammates!
      </TextBox> : null
    ) : null
  );
};

function LoadingText() {
  const profileState = useProfile();
  const profileListState = useProfileList();

  return (
    profileState.isLoading ?
    <TextBox>
      Fetching your profile... <br /> <Spinner />
    </TextBox> :

    profileListState.isLoading ?
    <TextBox>
      Finding the best hackers for you... <br /> <Spinner />
    </TextBox> : null
  );
};

function ResetText() {
  const { profile, toggleVisibility } = useProfile();
  const { isLoading, profiles } = useProfileList();
  const { reset } = useMatch();

  const resetConfirmationDialog = useDialogControl();
  const resetAlertDialog = useDialogControl();
  const toggleVisibilityConfirmationDialog = useDialogControl();
  const toggleVisibilityAlertDialog = useDialogControl();

  const onReset = async () => {
    await reset();
    resetConfirmationDialog.dismiss();
    resetAlertDialog.open();
  };

  const onToggleVisibility = async () => {
    await toggleVisibility();
    toggleVisibilityConfirmationDialog.dismiss();
    toggleVisibilityAlertDialog.open();
  };

  return (
    (profile?.visible && !isLoading && !profiles.length) ?
    <>
      <TextBox>
        <p>
          That's everybody! If you still haven't found your teammates, you can reset all your left swipes and start over.
        </p>
        <Button
          className="reset-button"
          variant="contained"
          color="primary"
          onClick={resetConfirmationDialog.open}
        >Reset</Button>

        <p>
          Or if you have already found your teammates, you can mark your profile as not visible.
        </p>
        <Button
          className="mark-not-visibile-button"
          variant="contained"
          color="primary"
          onClick={toggleVisibilityConfirmationDialog.open}
        >Mark not visible</Button>

        <p className="wait-text">
          Or you can just wait for more people to join Lattice!
        </p>

        <ResetTour />
      </TextBox>
      <ResetConfirmation
        show={resetConfirmationDialog.show}
        onClose={resetConfirmationDialog.dismiss}
        onSuccess={onReset}
      />
      <ResetAlert
        show={resetAlertDialog.show}
        onClose={resetAlertDialog.dismiss}
      />
      <ToggleVisibilityConfirmation
        show={toggleVisibilityConfirmationDialog.show}
        onClose={toggleVisibilityConfirmationDialog.dismiss}
        onSuccess={onToggleVisibility}
      />
      <ToggleVisibilityAlert
        show={toggleVisibilityAlertDialog.show}
        onClose={toggleVisibilityAlertDialog.dismiss}
      />
    </>: null
  );
};

function ErrorText() {
  const profileState = useProfile();
  const profileListState = useProfileList();

  return (
    profileState.failedToLoad ?
    <TextBox>
      There was an error fetching your profile <br />
      <Button variant="contained" color="primary" onClick={profileState.getProfile}>Retry</Button>
    </TextBox> :

    profileListState.failedToLoad ?
    <TextBox>
      There was an error fetching hackers <br />
      <Button variant="contained" color="primary" onClick={profileListState.getProfiles}>Retry</Button>
    </TextBox> : null
  );
};
