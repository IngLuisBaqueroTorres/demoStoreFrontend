import * as React from 'react';
import { Box, Grid, Divider, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import type { Order, OrderItem } from '../../pages/types';
import OrderProducts from './orderForm/OrderProducts';
import OrderSummary from './orderForm/OrderSummary';
import OrderShipping from './orderForm/OrderShipping';
import OrderExtraInfo from './orderForm/OrderExtraInfo';

interface OrderFormProps {
  order: Order;
  onSave: (updatedOrder: Order) => void;
  onCancel: () => void;
}
const OrderForm: React.FC<OrderFormProps> = ({ order, onSave, onCancel }) => {
  const methods = useForm<Order>({
    defaultValues: order,
  });
  const { handleSubmit, control, watch, reset } = methods;
  // Observamos los campos que afectan al total para recalcularlo en tiempo real
  const watchedItems = watch('items');
  const watchedShippingCost = watch('shippingCost');
  const subtotal = React.useMemo(
    () => (watchedItems || []).reduce((acc, item) => acc + item.quantity * item.priceAtPurchase, 0),
    [watchedItems]
  );
  const total = React.useMemo(
    () => subtotal + (watchedShippingCost || 0),
    [subtotal, watchedShippingCost]
  );
  // Cuando la prop 'order' cambia, reseteamos el formulario con los nuevos valores
  React.useEffect(() => {
    reset(order);
  }, [order, reset]);
  const onSubmitHandler = (data: Order) => {
    // Unir la dirección antes de guardar
    const fullAddress = [data.country, data.city, data.addressLine].filter(Boolean).join(', ');
    onSave({ ...data, shippingAddress: fullAddress });
  };
  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <OrderProducts />
            <Divider sx={{ my: 3 }} />
            <OrderShipping />
          </Grid>
          <Grid item xs={12} md={5}>
            <OrderSummary subtotal={subtotal} total={total} />
            <Divider sx={{ my: 3 }} />
            <OrderExtraInfo />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button onClick={onCancel} color="secondary">Cancelar</Button>
          <Button type="submit" variant="contained">Guardar Cambios</Button>
        </Box>
      </Box>
    </FormProvider>
  );
};
export default OrderForm;
