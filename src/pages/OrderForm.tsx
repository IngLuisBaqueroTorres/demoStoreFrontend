import * as React from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Typography,
  Autocomplete,
} from '@mui/material';
import type { Order } from '../components/types/Order';

interface OrderFormProps {
  order: Order;
  onSave: (updatedOrder: Order) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState<Order>(order);
  const [countries, setCountries] = React.useState<string[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = React.useState(false);
  const [loadingCities, setLoadingCities] = React.useState(false);

  // Cargar la lista de países al montar el componente
  React.useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
        const data = await response.json();
        if (!data.error) {
          setCountries(data.data.map((c: { name: string }) => c.name).sort());
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Cargar las ciudades cuando se selecciona un país
  React.useEffect(() => {
    if (formData.country) {
      const fetchCities = async () => {
        setLoadingCities(true);
        setCities([]); // Limpiar ciudades anteriores
        try {
          const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: formData.country }),
          });
          const data = await response.json();
          if (!data.error) {
            setCities(data.data.sort());
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        } finally {
          setLoadingCities(false);
        }
      };
      fetchCities();
    }
  }, [formData.country]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (event: React.SyntheticEvent, value: string | null) => {
    setFormData((prev) => ({ ...prev, country: value || '', city: '' })); // Resetea la ciudad al cambiar de país
  };

  const handleCityChange = (event: React.SyntheticEvent, value: string | null) => {
    setFormData((prev) => ({ ...prev, city: value || '' }));
  };

  const handleSave = () => {
    // Unir la dirección antes de guardar
    const fullAddress = [formData.country, formData.city, formData.addressLine].filter(Boolean).join(', ');
    onSave({ ...formData, shippingAddress: fullAddress });
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            label="Estado de la Orden"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            {['Pending', 'Processing', 'Completed', 'Cancelled'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Dirección de Envío</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={countries}
            value={formData.country || null}
            onChange={handleCountryChange}
            loading={loadingCountries}
            renderInput={(params) => (
              <TextField
                {...params}
                label="País"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingCountries ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={cities}
            value={formData.city || null}
            onChange={handleCityChange}
            loading={loadingCities}
            disabled={!formData.country || loadingCities}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ciudad"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingCities ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Dirección (Calle, número, etc.)"
            name="addressLine"
            value={formData.addressLine || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button onClick={onCancel} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar Cambios</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderForm;