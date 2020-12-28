import React, { useState } from 'react'
import Tour from 'reactour'
import { useProfile } from '../providers/ProfileProvider';

export default function({ name, steps }) {
  const { profile, completeTour } = useProfile();
  const [ isOpen, setOpen ] = useState(true);

  const onTourComplete = async () => {
    setOpen(false);
    await completeTour(name);
  };

  const showTour = !profile?.completedTours?.includes(name);

  return showTour ?
    <Tour
      steps={steps}
      isOpen={isOpen}
      onRequestClose={onTourComplete}
    /> : null
};
