import React from "react";
import { animated, interpolate } from "react-spring/hooks";
import { HydratedProfile } from "../../interfaces/profile";

import "../../styles/Card.scss";

const Card = ({ i, x, y, rot, scale, trans, bind, data }: any) => {
  const { skills, name, idea, lookingFor }: HydratedProfile = data[i];

  const skillRows = [skills.slice(0, 3), skills.slice(3, 6)];

  return (
    <animated.div
      key={i}
      style={{
        transform: interpolate(
          [x, y],
          (x, y) => `translate3d(${x}px,${y}px,0)`
        )
      }}
    >
      <animated.div
        {...bind(i)}
        style={{
          transform: interpolate([rot, scale], trans),
          boxShadow: interpolate(
            [x], (x) => {
              if(x > -5 && x < 5) return null;
              const opacity = Math.abs(x)/300;
              const color = x > 0 ? `rgba(100, 237, 136, ${opacity})` : `rgba(237, 100, 100, ${opacity})`;
              return `${x*1.5}px 0 80px -80px ${color} inset`;
            }
          )
        }}
      >
        <div className="font-opensans hacker-profile-card"
          style={{
            textAlign: `center`,
          }}
        >
          <h2 className="name">
            {name}
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
                      <div>
                        <i
                          key={skill.title}
                          className={skill.icon}
                          style={{
                            padding: `10px`,
                            fontSize: `50px`,
                          }}
                        />
                          <p className="card-skill-title font-black"> {skill.title} </p>
                      </div>
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
              <div>
                  <i
                    key={look.title}
                    className={look.icon}
                    style={{
                      padding: `10px`,
                      fontSize: `50px`,
                    }}
                  />
                  <p className="card-skill-title font-black"> {look.title} </p>
              </div>
            ))}
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};

export default Card;
