import React from 'react';
import TourComponent from './TourComponent';

export default function() {
  return <TourComponent name="home" steps={steps} />
}

const steps = [
  {
    selector: '',
    content: `This is the Lattice homepage. Here you can find other enthusiastic hackers and team up with them to build awesome stuff.`
  },
  {
    selector: '.hacker-profile-card:last-of-type',
    content: `This is a hacker profile card. We automatically sort these profiles based on the skills you have and are looking for.`
  },
  {
    selector: '.hacker-profile-card:last-of-type',
    content: `If you are familiar with Tinder, you already know what to do. If not, here it is: you can swipe these cards either left or right.`
  },
  {
    selector: '.hacker-profile-card:last-of-type',
    content: `Swiping left means that you are not interested in teaming up with this hacker. Swiping right means that you like this hacker's profile and are interested in teaming up with them.`
  },
  {
    selector: '.notifications-link',
    content: `If you and another hacker both swipe right on each other, it's a match! You both will get a notification. You can check out all your match notifications here.`
  },
  {
    selector: '.profile-link',
    content: `You can always go here and modify your profile.`
  },
  {
    selector: '.deck',
    content: `That is all I have for you today. Hope you have a great time at MakeUC. Happy swiping!`
  }
];
