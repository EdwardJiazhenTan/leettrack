import React, { useState, useEffect } from 'react';
import { useTrail, a } from '@react-spring/web';
import meme from '../assets/meme.png'; // Adjust the path as necessary

import styles from './styles.module.css';

const Trail = ({ open, children }) => {
  const items = React.Children.toArray(children);
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? 110 : 0,
    from: { opacity: 0, x: 20, height: 0 },
  });

  return (
    <div>
      {trail.map(({ height, ...style }, index) => (
        <a.div key={index} className={styles.trailsText} style={style}>
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  );
};

export default function App() {
  const [open, setOpen] = useState(true);
  const [showMeme, setShowMeme] = useState(false);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setShowMeme(true);
      }, 1000); // Adjust the delay as needed to match the animation timing

      return () => clearTimeout(timer);
    } else {
      setShowMeme(false);
    }
  }, [open]);

  return (
    <div className={styles.container + " flex justify-center items-center h-screen"} onClick={() => setOpen(state => !state)}>
      <Trail open={open}>
        <span>Practice</span>
        <span>LeetCode</span>
        <span>Everyday</span>
        <span>And</span>
        <span>You</span>
        <span>Get</span>
        <span>This :</span>
      </Trail>
      {showMeme && (
         <img src={meme} alt="meme"/> 
      )}
    </div>
  );
}
