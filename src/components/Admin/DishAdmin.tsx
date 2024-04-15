import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

const DishAdmin = ({ item }) => {
  return (
    <Card className="dish">
      <CardContent>
        {item.imagePath && <CardMedia component="img" height="140" image={`${import.meta.env.VITE_API_URL}/${item.imagePath}`} />}
        <Typography variant="h5" component="h2">{item.name}</Typography>
        <Typography variant="body2" color="textSecondary">Price: ${item.price}</Typography>
        <Typography variant="body2" color="textSecondary">{item.description}</Typography>
      </CardContent>
    </Card>
  );
};

export default DishAdmin;
