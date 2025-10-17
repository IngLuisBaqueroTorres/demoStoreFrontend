import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  CircularProgress,
} from '@mui/material';

const OrderShipping: React.FC = () => {
  const { control, watch, setValue } = useFormContext();
  const [countries, setCountries] = React.useState<string[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = React.useState(false);
  const [loadingCities, setLoadingCities] = React.useState(false);

  const selectedCountry = watch('country');

  React.useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
        const data = await response.json();
        if (!data.error) setCountries(data.data.map((c: { name: string }) => c.name).sort());
      } catch (error) { console.error("Error fetching countries:", error); }
      finally { setLoadingCountries(false); }
    };
    fetchCountries();
  }, []);

  React.useEffect(() => {
    if (selectedCountry) {
      const fetchCities = async () => {
        setLoadingCities(true);
        setCities([]);
        try {
          const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: selectedCountry }),
          });
          const data = await response.json();
          if (!data.error) setCities(data.data.sort());
        } catch (error) { console.error("Error fetching cities:", error); }
        finally { setLoadingCities(false); }
      };
      fetchCities();
    }
  }, [selectedCountry]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Dirección de Envío</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller name="country" control={control} render={({ field }) => (
            <Autocomplete {...field} options={countries} loading={loadingCountries}
              onChange={(_, value) => {
                field.onChange(value || '');
                setValue('city', ''); // Reset city on country change
              }}
              renderInput={(params) => <TextField {...params} label="País" />}
            />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="city" control={control} render={({ field }) => (
            <Autocomplete {...field} options={cities} loading={loadingCities} disabled={!selectedCountry}
              onChange={(_, value) => field.onChange(value || '')}
              renderInput={(params) => <TextField {...params} label="Ciudad" />}
            />
          )} />
        </Grid>
        <Grid item xs={12}>
          <Controller name="addressLine" control={control} render={({ field }) => (
            <TextField {...field} label="Dirección (Calle, número, etc.)" fullWidth multiline rows={2} />
          )} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderShipping;
