import * as React from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { green, orange, red } from '@mui/material/colors';

interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

// Interfaz que coincide con la respuesta de la API
interface ApiOrder {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string; // "PENDING", "COMPLETED", "CANCELLED"
  shippingAddress: string;
  billingAddress: string;
  items: unknown[]; // No necesitamos los items por ahora
  couponCode: string | null;
  discountAmount: number;
  shippingCost: number | null;
  shippingMethodName: string | null;
  trackingNumber: string | null;
  finalAmount: number;
}

// Simulación de datos de órdenes
const mockOrders: Order[] = [
  { id: 'ORD001', customerName: 'Juan Pérez', date: '2023-10-27', total: 150.5, status: 'Completed' },
  { id: 'ORD002', customerName: 'Ana Gómez', date: '2023-10-26', total: 75.2, status: 'Pending' },
  { id: 'ORD003', customerName: 'Carlos Ruiz', date: '2023-10-25', total: 320.0, status: 'Completed' },
  { id: 'ORD004', customerName: 'Lucía Fernández', date: '2023-10-24', total: 50.0, status: 'Cancelled' },
  { id: 'ORD005', customerName: 'Mario Luna', date: '2023-10-23', total: 112.0, status: 'Completed' },
  { id: 'ORD006', customerName: 'Sofía Castro', date: '2023-10-22', total: 25.5, status: 'Pending' },
  { id: 'ORD007', customerName: 'David Reyes', date: '2023-10-21', total: 88.0, status: 'Completed' },
  { id: 'ORD008', customerName: 'Elena Torres', date: '2023-10-20', total: 199.99, status: 'Pending' },
  { id: 'ORD009', customerName: 'Javier Ortiz', date: '2023-10-19', total: 45.0, status: 'Cancelled' },
  { id: 'ORD010', customerName: 'Isabel Romero', date: '2023-10-18', total: 500.1, status: 'Completed' },
];

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Estado para la paginación
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status: Order['status']) => {
    const color = {
      Completed: green[700],
      Pending: orange[700],
      Cancelled: red[700],
    }[status];
    return <Chip label={status} size="small" sx={{ backgroundColor: color, color: 'white' }} />;
  };

  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error("No se encontró token de autenticación.");
        }

        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: No se pudieron obtener las órdenes`);
          } else {
            throw new Error(`Error ${response.status}: El servidor devolvió una respuesta no esperada.`);
          }
        }

        const apiData: ApiOrder[] = await response.json();

        // Mapear los datos de la API al formato de la tabla
        const fetchedOrders: Order[] = apiData.map(order => ({
          id: order.id,
          customerName: order.customerName,
          date: new Date(order.orderDate).toLocaleDateString('es-ES'), // Formatear fecha
          total: order.finalAmount,
          // Capitalizar el estado: "PENDING" -> "Pending"
          status: (order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()) as Order['status'],
        }));

        // Combinar órdenes de la API con las de ejemplo
        setOrders([...fetchedOrders, ...mockOrders]);

      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido';
        console.error("Error fetching orders:", errorMessage);
        setError(`Error al cargar órdenes: ${errorMessage}. Mostrando datos de ejemplo.`);
        // Si hay un error, mostramos solo los datos de ejemplo
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <DashboardLayout title="Órdenes">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}
        {error && <Typography color="error" sx={{ p: 2, textAlign: 'center' }}>{error}</Typography>}
        {!loading && !error && (
          <>
            <TableContainer>
              <Table stickyHeader aria-label="tabla de órdenes">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Orden</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell align="right">{`$${order.total.toFixed(2)}`}</TableCell>
                        <TableCell align="center">{getStatusChip(order.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </DashboardLayout>
  );
}