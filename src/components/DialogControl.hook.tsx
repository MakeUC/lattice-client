import { useState } from 'react';

export default function<T>(defaultShow = false) {
  const [ show, setShow ] = useState(defaultShow);
  const [ state, setState ] = useState<T>();
  
  const open = () => setShow(true);
  const dismiss = () => {
    setState(undefined);
    setShow(false);
  };

  return { show, open, dismiss, state, setState };
};