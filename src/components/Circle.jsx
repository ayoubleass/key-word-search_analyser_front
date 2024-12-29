import React, { useRef, useEffect } from 'react';


export default function Circle({percent = 30}) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const radius = 30;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
    context.lineWidth = 15;
    context.strokeStyle = 'grey';
    context.fillStyle = 'white'
    context.font = "50px";
    context.fillText(`${percent}%`, centerX - 8, centerY);
    const totalRad = 2 * Math.PI;
    const rad = (totalRad * percent) / 100;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, rad, false);
    context.lineWidth = 15;
    context.strokeStyle = 'green';
    context.stroke();
  }, [percent]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={150}
        height={150}
      >
      </canvas>
    </div>
  );
}

