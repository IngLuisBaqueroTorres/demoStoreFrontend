import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Paper, Box, Button, ButtonGroup, Typography, useTheme, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';

const chartTypes: { key: ChartType, label: string }[] = [
  { key: 'bar', label: 'Barras' },
  { key: 'line', label: 'Líneas' },
  { key: 'pie', label: 'Pastel' },
  { key: 'doughnut', label: 'Dona' },
];

const SalesChart = () => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Ventas',
        data: [1200, 1900, 3000, 5000, 2300, 3200],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.secondary,
        },
      },
      title: {
        display: true,
        text: 'Ventas Mensuales', // Este título es de Chart.js, no de MUI
        color: theme.palette.text.primary,
        align: 'center',
      },
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.secondary },        
        grid: {
          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)',
        },
      },
      y: {
        ticks: { color: theme.palette.text.secondary },        
        grid: { color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)' },
      },
    },
  };

  return (
    <Paper sx={{ 
      p: 2, 
      borderRadius: '8px', 
      boxShadow: theme.palette.mode === 'light' ? '0 2px 6px rgba(0,0,0,0.04)' : '0 1px 4px rgba(0,0,0,0.4)',
      border: theme.palette.mode === 'light' ? '1px solid #e1e1e1' : 'none',
    }}>
      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        Análisis de Ventas
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Contenedor para los selectores de fecha */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <DatePicker
              label="Fecha de inicio"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    maxWidth: '200px',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : theme.palette.grey[100],
                      '& fieldset': {
                        border: 'none', // Quitar borde visible
                      },
                      '&.Mui-focused fieldset': {
                        // Añadir glow en focus
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.mode === 'dark' ? '#aaa' : 'inherit',
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                  },
                },
              }}
            />
            <DatePicker
              label="Fecha de fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    maxWidth: '200px',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : theme.palette.grey[100],
                      '& fieldset': { border: 'none' },
                      '&.Mui-focused fieldset': {
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.mode === 'dark' ? '#aaa' : 'inherit',
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                  },
                },
              }}
            />
          </Box>
        </LocalizationProvider>
        {/* Contenedor para los botones de tipo de gráfico */}
        <ButtonGroup variant="outlined" size="small" sx={{ '& .MuiButton-root': { mr: '6px' }, '& .MuiButton-root:last-child': { mr: 0 } }}>
          {chartTypes.map(({ key, label }) => (
            <Button key={key} onClick={() => setChartType(key)}
              sx={{
                // Estilo para botón activo
                ...(chartType === key && { 
                  backgroundColor: 'primary.main', 
                  color: 'white', 
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&:hover': { backgroundColor: 'primary.dark' } 
                }),
                // Estilo para botón inactivo en modo oscuro
                ...(chartType !== key && theme.palette.mode === 'dark' && { 
                  backgroundColor: '#2b2b2b', 
                  color: '#cfcfcf', 
                  borderColor: 'grey.700' 
                }),
                // Estilo para botón inactivo en modo claro
                ...(chartType !== key && theme.palette.mode === 'light' && { borderColor: '#d1d1d1' }),
              }}
            >{label}</Button>
          ))}
        </ButtonGroup>
      </Box>
      <Box sx={{ height: 350 }}>
        <Chart type={chartType} data={data} options={options} />
      </Box>
    </Paper>
  );
};

export default SalesChart;