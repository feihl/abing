import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

export default function Timer({ minutes }) {
  const [time, setTime] = useState(minutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return <Text style={styles.timer}>{formatTime()}</Text>;
}

const styles = StyleSheet.create({
  timer: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
});
