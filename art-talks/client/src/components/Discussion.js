  import React, { useState, useEffect, useMemo, useCallback } from 'react';
  import { useParams } from 'react-router-dom';
  import axios from 'axios';
  import io from 'socket.io-client';
  import ChatBox from './ChatBox';
  import './Discussion.css';
  
  
  const socket = io.connect('http://localhost:4000');
  
  function Discussion() {
    const [pictures, setPictures] = useState([]);
    const [hoveredMetadata, setHoveredMetadata] = useState(null);
  
    
    const { id } = useParams();
  
    
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
  
    
    const selectedPicture = useMemo(() => {
      const numericId = parseInt(id, 10);
      return pictures.find((pic) => pic.id === numericId);
    }, [pictures, id]);
  
    
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
        
        setHoveredMetadata({
          resolution: 'Unknown',
          size: 'Unknown'
        });
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
  
    
    if (!selectedPicture) {
      return (
        <div className="discussion">
          <p>Loading or Invalid Picture ID...</p>
        </div>
      );
    }
  
    return (
      <div className="discussion">
        <div className="picture-section">
          <img
            src={selectedPicture.image}
            alt={selectedPicture.name}
            onMouseOver={() => handleMouseOver(selectedPicture.image)}
            onMouseOut={handleMouseOut}
          />
          <div className="image-details">
            <h1>{selectedPicture.name}</h1>
            <p>By {selectedPicture.artist}</p>
            <p>{selectedPicture.description}</p>
          </div>
        </div>
  
        <div className="chat-section">
          <h2>Chat</h2>
          <ChatBox socket={socket} />
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
  
  export default Discussion;
  