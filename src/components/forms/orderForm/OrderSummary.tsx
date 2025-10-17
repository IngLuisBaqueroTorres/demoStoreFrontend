import * as React from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Divider,
  Paper,
} from '@mui/material';
import type { Order } from '@/components/types/Order';

const OrderSummary: React.FC = () => {
  const { control } = useFormContext<Order>();

  // Observar items y costo de envío
  const items = useWatch({ control, name: 'items' }) || [];
  const shippingCost = useWatch({ control, name: 'shippingCost' }) || 0;

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.priceAtPurchase), 0);
  const total = subtotal + shippingCost;

  return (
    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'action.hover' }}>
      <Typography variant="h6" gutterBottom>
        Resumen
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="body1" color="text.secondary">Subtotal</Typography>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>${subtotal.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="body1" color="text.secondary">Costo de Envío</Typography>
        <Controller
          name="shippingCost"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              type="number"
              sx={{ width: 130 }}
              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
          )}
        />
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${total.toFixed(2)}</Typography>
      </Box>
    </Paper>
  );
};

export default OrderSummary;
