import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Spinner from '../../../components/Spinner';

export interface ChangePasswordForm {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

export default function({ show, onClose, onSuccess }:
  { show: boolean, onClose: () => void, onSuccess: (data: ChangePasswordForm) => Promise<any> }
) {
  const { register, getValues, handleSubmit, errors } = useForm<ChangePasswordForm>();

  const [ isSubmitting, setSubmitting ] = useState(false);

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      setSubmitting(true);
      await onSuccess(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Dialog
        open={show}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              name="oldPassword"
              label="Current password"
              variant="outlined"
              type="password"
              margin="normal"
              fullWidth
              inputRef={register({ required: `This field is required` })}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword?.message}
            />
            <TextField
              name="newPassword"
              label="New password"
              variant="outlined"
              type="password"
              margin="normal"
              fullWidth
              inputRef={register({
                required: `This field is required`,
                minLength: 6
              })}
              error={!!errors.newPassword}
              helperText={
                errors.newPassword?.message ||
                (errors.newPassword?.type === `minLength` && `Passwords should be atleast 6 characters`)
              }
            />
            <TextField
              name="confirmNewPassword"
              label="Confirm new password"
              variant="outlined"
              type="password"
              margin="normal"
              fullWidth
              inputRef={register({
                required: `This field is required`,
                validate: confirm => getValues(`newPassword`) === confirm
              })}
              error={!!errors.confirmNewPassword}
              helperText={
                errors.confirmNewPassword?.message ||
                (errors.confirmNewPassword?.type === `validate` && `Passwords do not match`)
              }
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary"disabled={isSubmitting} >
              {isSubmitting ? <Spinner size="25px" /> : `Submit`}
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
