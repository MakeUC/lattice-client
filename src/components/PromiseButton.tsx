import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Spinner from './Spinner';

const PromiseButton = ({ onClick, children, ...props }: {
  onClick: (...args: any[]) => Promise<any>
  children: string | JSX.Element
  [key: string]: any
}) => {
  const [ waiting, setWaiting ] = useState<boolean>();

  const _onClick = async (...args: any[]) => {
    try {
      setWaiting(true);
      await onClick(...args);
    } finally {
      setWaiting(false);
    }
  }

  return <Button {...props} onClick={_onClick} disabled={waiting}>
    {
      waiting ? <Spinner size="25px" /> : children
    }
  </Button>;
};

export default PromiseButton;