import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  }
}));

export default function PopperPopupState() {
  const classes = useStyles();

  return (
    <PopupState variant="popper" popupId="demo-popup-popper">
      {(popupState) => (
        <div>
          <Button variant="contained" color="primary" {...bindToggle(popupState)}>
            Popper
          </Button>
          <Popper {...bindPopper(popupState)} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <Typography className={classes.typography}>Content...</Typography>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
      )}
    </PopupState>
  );
}
