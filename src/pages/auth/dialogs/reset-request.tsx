import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface ResetRequestForm { email: string }

export default function({ show, onClose, onSuccess }:
  { 
    show: boolean,
    onClose: () => void,
    onSuccess: (data: ResetRequestForm) => Promise<void>
  }
) {
  const { register, handleSubmit, errors } = useForm<ResetRequestForm>();

  return (
    <div>
      <Dialog
        open={show}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSuccess)}>
          <DialogTitle>Request Password Reset</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              name="email"
              label="Email"
              variant="outlined"
              type="email"
              margin="normal"
              fullWidth
              inputRef={register({ required: `This field is required` })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              Submit
            </Button>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
