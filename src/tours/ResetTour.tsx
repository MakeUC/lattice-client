import React from 'react'
import TourComponent from './TourComponent';

export default function() {
  return <TourComponent name="reset" steps={steps} />;
}

const steps = [
  {
    selector: '',
    content: `Hello there! It seems like you have seen all the hackers' profiles that have registered so far. So now, there are three things you can do.`
  },
  {
    selector: '.reset-button',
    content: `If you click on this button, all the profiles that you swiped left on will be available to you again.`
  },
  {
    selector: '.mark-not-visibile-button',
    content: `If you have already found a team for the hackathon, you can click on this button to mark your profile as not visible, so that you don't get any further matches.`
  },
  {
    selector: '.wait-text',
    content: `Hackers will keep on flowing into Lattice until the day of the hackathon, so you can simply wait for more hackers to join Lattice.`
  }
];
