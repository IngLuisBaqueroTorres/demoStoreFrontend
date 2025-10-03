import * as React from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}
interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: "Pending" | "Completed" | "Cancelled";
  items: OrderItem[];
  shippingAddress: string;
}

interface OrderFormProps {
  order: Order;
  onSave: (updatedOrder: Order) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onSave, onCancel }) => {
  // Estado local para manejar los cambios en el formulario
  const [currentStatus, setCurrentStatus] = React.useState(order.status);
  const [editableItems, setEditableItems] = React.useState<OrderItem[]>(
    order.items
  );
  const [total, setTotal] = React.useState(order.total);
  const [shippingAddress, setShippingAddress] = React.useState(
    order.shippingAddress
  );

  // Determina si el formulario es editable basado en el estado inicial de la orden
  const isEditable = order.status === "Pending";

  React.useEffect(() => {
    // Recalcular el total cada vez que los items cambien
    const newTotal = editableItems.reduce(
      (sum, item) => sum + item.quantity * item.priceAtPurchase,
      0
    );
    setTotal(newTotal);
  }, [editableItems]);

  const handleStatusChange = (event: any) => {
    setCurrentStatus(event.target.value as Order["status"]);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const newQuantity = Math.max(0, quantity); // Evitar cantidades negativas
    setEditableItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setEditableItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Construir la orden actualizada con los datos del estado local
    const updatedOrder: Order = {
      ...order,
      status: currentStatus,
      items: editableItems,
      total: total,
      shippingAddress: shippingAddress,
    };
    onSave(updatedOrder);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <TextField
        label="ID de Orden"
        value={order.id}
        fullWidth
        margin="normal"
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        variant="outlined"
      />
      <TextField
        label="Cliente"
        value={order.customerName}
        fullWidth
        margin="normal"
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        variant="outlined"
      />
      <TextField
        label="Fecha"
        value={order.date}
        fullWidth
        margin="normal"
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        variant="outlined"
      />
      <TextField
        label="Total"
        value={`$${total.toFixed(2)}`}
        fullWidth
        margin="normal"
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        variant="outlined"
      />
      <TextField
        label="Dirección de Entrega"
        value={shippingAddress}
        fullWidth
        multiline
        rows={2}
        margin="normal"
        variant="outlined"
        onChange={(e) => setShippingAddress(e.target.value)}
        slotProps={{
          input: {
            readOnly: !isEditable,
          },
        }}
      />

      <Box sx={{ my: 2 }}>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="right">Precio Unit.</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                {isEditable && <TableCell align="center">Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {editableItems.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell component="th" scope="row">
                    {item.productName}
                  </TableCell>
                  <TableCell align="center">
                    {isEditable ? (
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                        slotProps={{
                          input: {
                            inputProps: {
                              min: 0,
                              style: { textAlign: "center" },
                            },
                          },
                        }}
                        size="small"
                        sx={{ width: "80px" }}
                      />
                    ) : (
                      item.quantity
                    )}
                  </TableCell>
                  <TableCell align="right">{`$${item.priceAtPurchase.toFixed(
                    2
                  )}`}</TableCell>
                  <TableCell align="right">{`$${(
                    item.quantity * item.priceAtPurchase
                  ).toFixed(2)}`}</TableCell>
                  {isEditable && (
                    <TableCell align="center">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="order-status-label">Estado</InputLabel>
        <Select
          labelId="order-status-label"
          id="order-status-select"
          value={currentStatus}
          label="Estado"
          onChange={handleStatusChange}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </Box>
    </Box>
  );
};

export default OrderForm;
