import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageCard from './ImageCard';
import './Gallery.css';

function Gallery() {
  const [pictures, setPictures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredMetadata, setHoveredMetadata] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/pictures');
        setPictures(data);
      } catch (error) {
        console.error('Error fetching pictures:', error);
      }
    })();
  }, []);

  
  const fetchImageMetadata = useCallback(async (imageUrl) => {
    try {
      
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const resolution = `${img.width} x ${img.height}`;

      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();
      const sizeInKB = `${(blob.size / 1024).toFixed(2)} KB`;

      setHoveredMetadata({ resolution, size: sizeInKB });
    } catch (error) {
      console.error('Error fetching image metadata:', error);
      
      setHoveredMetadata({ resolution: 'Unknown', size: 'Unknown' });
    }
  }, []);

  
  const handleMouseOver = useCallback(
    (imageUrl) => {
      setHoveredMetadata(null); 
      fetchImageMetadata(imageUrl);
    },
    [fetchImageMetadata]
  );

  const handleMouseOut = useCallback(() => {
    setHoveredMetadata(null);
  }, []);

  
  const filteredPictures = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return pictures.filter(
      (picture) =>
        picture.name.toLowerCase().includes(lowerSearch) ||
        picture.artist.toLowerCase().includes(lowerSearch)
    );
  }, [pictures, searchTerm]);

  
  const handleCardClick = useCallback(
    (pictureId) => {
      navigate(`/discussion/${pictureId}`);
    },
    [navigate]
  );

  return (
    <div>
      <header>
        <h1>Art Talks</h1>
        <input
          type="text"
          placeholder="Search by name or artist"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      <div className="gallery">
        {filteredPictures.map((picture) => (
          <ImageCard
            key={picture.id}
            picture={picture}
            onClick={handleCardClick}
            onMouseOver={() => handleMouseOver(picture.image)}
            onMouseOut={handleMouseOut}
          />
        ))}
      </div>

      {hoveredMetadata && (
        <div className="image-tooltip">
          <p>Resolution: {hoveredMetadata.resolution}</p>
          <p>Size: {hoveredMetadata.size}</p>
        </div>
      )}
    </div>
  );
}

export default Gallery;
