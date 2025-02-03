import React from 'react';
import './ImageCard.css';

const ImageCard = ({
  picture: { id, image, name, artist, description },
  onClick,
  onMouseOver,
  onMouseOut
}) => {
  const handleClick = () => {
    onClick?.(id); 
  };

  const handleMouseOver = () => {
    onMouseOver?.(image);
  };

  return (
    <div
      className="card"
      onClick={onClick ? handleClick : undefined}
      onMouseOver={onMouseOver ? handleMouseOver : undefined}
      onMouseOut={onMouseOut}
    >
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>By {artist}</p>
      <p>{description}</p>
    </div>
  );
};

export default ImageCard;
