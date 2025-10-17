import * as React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Order } from '../../../pages/types';

const OrderProducts: React.FC = () => {
  const { control } = useFormContext<Order>();
  const { fields, update, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Productos
      </Typography>
      <Box sx={{ maxHeight: 280, overflow: 'auto', pr: 1 }}>
        <List disablePadding>
          {fields.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem disablePadding sx={{ py: 1 }}>
                <ListItemText
                  primary={item.productName}
                  secondary={`$${item.priceAtPurchase.toFixed(2)} x ${item.quantity} = $${(item.priceAtPurchase * item.quantity).toFixed(2)}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" size="small" onClick={() => update(index, { ...item, quantity: Math.max(0, item.quantity - 1) })}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body1" component="span" sx={{ px: 1 }}>
                    {item.quantity}
                  </Typography>
                  <IconButton edge="end" size="small" onClick={() => update(index, { ...item, quantity: item.quantity + 1 })}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" sx={{ ml: 1 }} onClick={() => remove(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < fields.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default OrderProducts;
