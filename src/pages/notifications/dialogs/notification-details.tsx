import React from 'react';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import NotificationTour from '../../../tours/NotificationTour';
import { HydratedProfile } from '../../../interfaces/profile';

export default function ({ show, onClose, matchedUser, onContactClick }:
  { show: boolean, onClose: () => void, matchedUser: HydratedProfile, onContactClick?: () => void }
) {
  const { skills, name, idea, lookingFor, /* email, slack */ } = matchedUser;

  const skillRows = [skills?.slice(0, 3), skills?.slice(3, 6)];

  return (
    <div>
      <Dialog
        open={show}
        onClose={onClose}
      >
        <div style={{ width: `300px` }}>
          {
            !!name &&
            <div className="font-opensans" style={{ textAlign: `center` }}>
              <h2 className="name">
                <small>You matched with</small> <br /> {name}!
              </h2>
              <h3>Project Idea</h3>
              <div
                style={{
                  marginTop: `-5px`,
                  marginLeft: `15px`,
                  marginRight: `15px`,
                  marginBottom: `35px`,
                  borderRadius: `10px`,
                  paddingBottom: `0px`,
                }}
              >
                <p
                  style={{
                    fontSize: `13px`,
                  }}
                >
                  {idea}
                </p>
              </div>
              <h3>Offering</h3>
              {skillRows.map(
                (row, index) =>
                  !!row.length && (
                    <div
                      key={index}
                      style={{
                        padding: `25px`,
                        paddingBottom: `10px`,
                        marginTop: `-45px`,
                        marginLeft: `15px`,
                        marginRight: `15px`,
                        display: `flex`,
                        borderRadius: `10px`,
                      }}
                    >
                      {row.map((skill) => (
                        <i
                          key={skill.title}
                          className={skill.icon}
                          style={{
                            padding: `10px`,
                            fontSize: `50px`,
                          }}
                        />
                      ))}
                    </div>
                  )
              )}
              <h3>Looking For</h3>
              <div
                style={{
                  padding: `25px`,
                  marginTop: `-45px`,
                  marginLeft: `15px`,
                  marginRight: `15px`,
                  display: `flex`,
                  borderRadius: `10px`,
                }}
              >
                {lookingFor.map((look) => (
                  <i
                    key={look.title}
                    className={look.icon}
                    style={{
                      padding: `10px`,
                      fontSize: `50px`,
                    }}
                  ></i>
                ))}
              </div>
              {/*
                <Button
                  className="slack-button"
                  fullWidth={true}
                  color="primary"
                  onClick={() => onContactClick([`Slack handler`, `@${slack}`])}
                >Slack: @{slack}</Button>

                <Button
                  className="email-button"
                  fullWidth={true}
                  color="primary"
                  onClick={() => onContactClick([`Email`, email])}
                >Email: {email}</Button>
              */}
            </div>
          }
        </div>
        <NotificationTour />
      </Dialog>
    </div>
  );
};
