import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { Box, Typography, Grid, TextField, MenuItem } from '@mui/material';
import type { Order } from '@/components/types/Order';

const OrderExtraInfo: React.FC = () => {
  const { control } = useFormContext<Order>();

  const status = useWatch({ control, name: 'status' });
  const customerId = useWatch({ control, name: 'customerId' });
  const trackingNumber = useWatch({ control, name: 'trackingNumber' });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Detalles y Estado</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Estado de la Orden" fullWidth>
                {['Pending', 'Processing', 'Completed', 'Cancelled'].map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="ID Cliente"
            value={customerId || ''}
            fullWidth
            InputProps={{ readOnly: true }}
            variant="filled"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Nº de Seguimiento"
            value={trackingNumber || ''}
            fullWidth
            InputProps={{ readOnly: true }}
            variant="filled"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderExtraInfo;
