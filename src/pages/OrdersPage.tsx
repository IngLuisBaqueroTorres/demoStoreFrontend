import * as React from "react";
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
  Tooltip,
  Snackbar,
  IconButton,
  TextField,
  InputAdornment,
  TableSortLabel,
  MenuItem, // Añadido para el Select de estado
} from "@mui/material";
import DashboardLayout from "../components/layout/DashboardLayout";
import { green, orange, red } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import EditIcon from "@mui/icons-material/Edit"; // Icono para el botón de editar
import OrderDetailModal from "./OrderDetailModal"; // Nuevo componente de modal
import OrderForm from "../components/forms/OrderForm"; // Nuevo componente de formulario
interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: "Pending" | "Completed" | "Cancelled";
  items: OrderItem[];
  shippingAddress: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
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
  items: OrderItem[];
  couponCode: string | null;
  discountAmount: number;
  shippingCost: number | null;
  shippingMethodName: string | null;
  trackingNumber: string | null;
  finalAmount: number;
}

// Interfaz para la respuesta paginada de la API
interface PaginatedOrdersResponse {
  content: ApiOrder[];
  totalElements: number;
}

// Simulación de datos de órdenes
const mockOrders: Order[] = []; // Ya no necesitamos mocks complejos si la API funciona

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalOrders, setTotalOrders] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  // Estado para la paginación
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Estado para el Snackbar de notificación
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");

  // Estado para el ordenamiento
  const [sortField, setSortField] = React.useState<string>("orderDate"); // Campo por defecto para ordenar
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc"
  ); // Dirección por defecto

  // Estado para el modal de detalle de orden
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status: Order["status"]) => {
    const color = {
      Completed: green[700],
      Pending: orange[700],
      Cancelled: red[700],
    }[status];
    return (
      <Chip
        label={status}
        size="small"
        sx={{ backgroundColor: color, color: "white" }}
      />
    );
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Éxito al copiar
        setSnackbarMessage(`ID "${text.substring(0, 8)}..." copiado.`);
        setSnackbarOpen(true);
      },
      (err) => {
        // Error al copiar
        console.error("Error al copiar al portapapeles: ", err);
        setSnackbarMessage("No se pudo copiar el ID.");
        setSnackbarOpen(true);
      }
    );
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSaveOrder = async (updatedOrder: Order) => {
    if (!selectedOrder) return;

    const token = sessionStorage.getItem("token");
    const orderId = selectedOrder.id;

    // Mapear el estado del frontend al formato que espera la API (e.g., "Pending" -> "PENDING")
    const apiStatus = updatedOrder.status.toUpperCase() as "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

    // Mapear los items al formato que espera la API
    const apiItems = updatedOrder.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const body = {
      status: apiStatus,
      shippingAddress: updatedOrder.shippingAddress,
      items: apiItems,
    };

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la orden.');
      }

      // Si la API responde con la orden actualizada, podríamos usar esa data.
      // Por ahora, actualizamos el estado local con `updatedOrder`.
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      setSnackbarMessage("Orden actualizada correctamente.");
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar la orden:", error);
      setSnackbarMessage(error instanceof Error ? error.message : "No se pudo actualizar la orden.");
      setSnackbarOpen(true);
    }
  };

  React.useEffect(() => {
    // Debouncing: Espera a que el usuario deje de escribir para actualizar el término de búsqueda
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0); // Resetea a la primera página con cada nueva búsqueda
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  React.useEffect(() => {
    // Se ejecuta cuando cambia la búsqueda, la página o el tamaño de la página
    fetchOrders();
  }, [debouncedSearchTerm, page, rowsPerPage, sortField, sortDirection]);

  const handleSortRequest = (field: string) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
    setPage(0); // Volver a la primera página al cambiar el orden
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
        // Aseguramos que el parámetro 'query' siempre se envíe, incluso si está vacío.
        query: debouncedSearchTerm,
      });
      // Añadir parámetros de ordenamiento a la query
      if (sortField) {
        params.append("sort", `${sortField},${sortDirection}`);
      }
      const url = `/api/orders?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Error ${response.status}: No se pudieron obtener las órdenes`
          );
        } else {
          throw new Error(
            `Error ${response.status}: El servidor devolvió una respuesta no esperada.`
          );
        }
      }

      const apiData: PaginatedOrdersResponse = await response.json();

      // Mapear los datos de la API al formato de la tabla
      const fetchedOrders: Order[] = (apiData.content || []).map((order) => ({
        id: order.id,
        customerName: order.customerName,
        date: new Date(order.orderDate).toLocaleDateString("es-ES"), // Formatear fecha
        total: order.finalAmount,
        // Capitalizar el estado: "PENDING" -> "Pending"
        status: (order.status.charAt(0).toUpperCase() +
          order.status.slice(1).toLowerCase()) as Order["status"],
        items: order.items,
        shippingAddress: order.shippingAddress,
      }));

      setOrders(fetchedOrders);
      setTotalOrders(apiData.totalElements);
      // Limpiamos el error si la petición fue exitosa
      setError(null);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Ocurrió un error desconocido";
      console.error("Error fetching orders:", errorMessage);
      setError(
        `Error al cargar órdenes: ${errorMessage}. Mostrando datos de ejemplo.`
      );
      // Si hay un error, mostramos solo los datos de ejemplo
      setOrders(mockOrders);
      // Y ajustamos el total para la paginación de los mocks
      setTotalOrders(mockOrders.length);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Órdenes">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por ID de orden, nombre de cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && error && (
          <Typography color="error" sx={{ p: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <>
            {orders.length > 0 ? (
              <>
                <TableContainer>
                  <Table stickyHeader aria-label="tabla de órdenes">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID Orden</TableCell>
                        <TableCell
                          sortDirection={
                            sortField === "customerName" ? sortDirection : false
                          }
                        >
                          <TableSortLabel
                            active={sortField === "customerName"}
                            direction={
                              sortField === "customerName"
                                ? sortDirection
                                : "asc"
                            }
                            onClick={() => handleSortRequest("customerName")}
                          >
                            Cliente
                          </TableSortLabel>
                        </TableCell>
                        <TableCell
                          sortDirection={
                            sortField === "orderDate" ? sortDirection : false
                          }
                        >
                          <TableSortLabel
                            active={sortField === "orderDate"}
                            direction={
                              sortField === "orderDate" ? sortDirection : "asc"
                            }
                            onClick={() => handleSortRequest("orderDate")}
                          >
                            Fecha
                          </TableSortLabel>
                        </TableCell>
                        <TableCell
                          align="right"
                          sortDirection={
                            sortField === "finalAmount" ? sortDirection : false
                          }
                        >
                          <TableSortLabel
                            active={sortField === "finalAmount"}
                            direction={
                              sortField === "finalAmount"
                                ? sortDirection
                                : "asc"
                            }
                            onClick={() => handleSortRequest("finalAmount")}
                          >
                            Total
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center">Estado</TableCell>
                        <TableCell align="center">Acciones</TableCell>{" "}
                        {/* Nueva columna */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow hover tabIndex={-1} key={order.id}>
                          <TableCell
                            onClick={() => handleCopyToClipboard(order.id)}
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                          >
                            <Tooltip
                              title="Click para copiar ID"
                              placement="top"
                            >
                              <span>{order.id}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell align="right">{`$${order.total.toFixed(
                            2
                          )}`}</TableCell>
                          <TableCell align="center">
                            {getStatusChip(order.status)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenModal(order)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalOrders}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <Typography sx={{ p: 4, textAlign: "center" }}>
                No se encontraron órdenes que coincidan con la búsqueda.
              </Typography>
            )}
          </>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Paper>

      {/* Modal de detalle de orden */}
      <OrderDetailModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Detalle de la Orden"
      >
        {selectedOrder && (
          <OrderForm
            order={selectedOrder}
            onSave={handleSaveOrder}
            onCancel={handleCloseModal}
          />
        )}
      </OrderDetailModal>
    </DashboardLayout>
  );
}
