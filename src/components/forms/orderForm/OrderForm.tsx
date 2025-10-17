import * as React from "react";
import { Box, Button, Grid, TextField, Typography, Divider } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import type { Order } from "@/components/types/Order";
import CustomerSection from "./CustomerSection";
import OrderProducts from "./OrderProducts";
import OrderShipping from "./OrderShipping";
import OrderSummary from "./OrderSummary";
import OrderExtraInfo from "./OrderExtraInfo";

interface OrderFormProps {
  order: Order;
  onSave: (order: Order) => void | Promise<void>;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onSave, onCancel }) => {
  const methods = useForm<Order>({
    defaultValues: order,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSave(data);
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Información de la Orden
        </Typography>

        <Grid container spacing={2}>
          {/* ID de la orden (solo lectura) */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID de Orden"
              {...methods.register("id")}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Fecha (solo lectura) */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Creación"
              {...methods.register("date")}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Sección de Cliente */}
        <CustomerSection 
        customerId={order.customerId}
        editable={false} 
        />

        <Divider sx={{ my: 3 }} />

        {/* Sección de Productos */}
        <OrderProducts />

        <Divider sx={{ my: 3 }} />

        {/* Sección de extra info */}
        <OrderExtraInfo 
        status={order.status}
        customerId={order.customerId}
        trackingNumber={order.trackingNumber}
        />

        <Divider sx={{ my: 3 }} />

        {/* Sección de Envío */}
        <OrderShipping />

        <Divider sx={{ my: 3 }} />

        {/* Sección de Resumen */}
        <OrderSummary />

        <Divider sx={{ my: 3 }} />

        {/* Botones de acción */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Guardar cambios
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default OrderForm;
