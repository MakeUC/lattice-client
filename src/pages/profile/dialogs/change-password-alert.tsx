import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function({ show, onClose, error }) {
  return (
    <div>
      <Dialog
        open={show}
        onClose={onClose}
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              error ?
                `There was a problem trying to change your password, please try again later.` :
                `Your password has been successfully changed.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
