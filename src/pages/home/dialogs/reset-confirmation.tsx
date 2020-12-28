import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PromiseButton from '../../../components/PromiseButton';

export default function({ show, onSuccess, onClose }:
  { show: boolean, onSuccess: () => Promise<any>, onClose: () => void }
) {
  return (
    <div>
      <Dialog
        open={show}
        onClose={onClose}
      >
        <DialogTitle>Are you sure</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Reset all the negative swipes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <PromiseButton onClick={onSuccess} color="primary">
            Yes
          </PromiseButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
