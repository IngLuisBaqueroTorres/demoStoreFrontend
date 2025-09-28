import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Box, Paper, Typography, ButtonGroup, Button, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

dayjs.extend(isBetween);

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend
);

// --- DATA GENERATION ---
const generateDailyData = (days: number) => {
  const today = dayjs();
  return Array.from({ length: days }).map((_, i) => {
    const date = today.subtract(i, 'day');
    return {
      date: date.format('YYYY-MM-DD'),
      sales: Math.floor(Math.random() * 1000) + 200,
      cashFlow: Math.floor(Math.random() * 800) - 100,
    };
  }).reverse();
};

const originalData = generateDailyData(365);

// --- COMPONENT ---
type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';

const SalesChart = () => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    const filteredData = originalData.filter(item => {
      const itemDate = dayjs(item.date);
      return itemDate.isBetween(startDate, endDate, null, '[]'); // inclusive
    });

    if (chartType === 'pie' || chartType === 'doughnut') {
      const totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0);
      const totalCashFlow = filteredData.reduce((sum, item) => sum + item.cashFlow, 0);

      setChartData({
        labels: ['Ventas Totales', 'Flujo de Caja Total'],
        datasets: [{
          label: 'Resumen del Periodo',
          data: [totalSales, totalCashFlow],
          backgroundColor: [
            'rgba(85, 108, 214, 0.5)', // Ventas
            'rgba(25, 133, 123, 0.5)', // Flujo de Caja
          ],
          borderColor: [
            '#556cd6',
            '#19857b',
          ],
          borderWidth: 1,
        }],
      });
    } else {
      // Bar or Line chart
      setChartData({
        labels: filteredData.map(d => d.date),
        datasets: [
          {
            label: 'Ventas (en miles)',
            data: filteredData.map(d => d.sales),
            backgroundColor: 'rgba(85, 108, 214, 0.5)',
            borderColor: '#556cd6',
            borderWidth: 1,
          },
          {
            label: 'Flujo de Caja (en miles)',
            data: filteredData.map(d => d.cashFlow),
            backgroundColor: 'rgba(25, 133, 123, 0.5)',
            borderColor: '#19857b',
            borderWidth: 1,
          },
        ],
      });
    }

  }, [startDate, endDate, chartType]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top' as const,
        // For pie/doughnut, the legend is useful. For others, it might be too cluttered.
        display: chartType === 'pie' || chartType === 'doughnut' || chartData.labels?.length < 32, 
      },
      title: { 
        display: true, 
        text: `Análisis Financiero (${startDate?.format('DD/MM/YY')} - ${endDate?.format('DD/MM/YY')})` 
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line': return <Line options={options} data={chartData} />;
      case 'pie': return <Pie options={options} data={chartData} />;
      case 'doughnut': return <Doughnut options={options} data={chartData} />;
      case 'bar':
      default: return <Bar options={options} data={chartData} />;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Resumen de Actividad
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <DatePicker label="Desde" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
          <DatePicker label="Hasta" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
          <ButtonGroup variant="outlined" aria-label="chart type picker">
            <Button onClick={() => setChartType('bar')} disabled={chartType === 'bar'}>Barras</Button>
            <Button onClick={() => setChartType('line')} disabled={chartType === 'line'}>Líneas</Button>
            <Button onClick={() => setChartType('pie')} disabled={chartType === 'pie'}>Pastel</Button>
            <Button onClick={() => setChartType('doughnut')} disabled={chartType === 'doughnut'}>Dona</Button>
          </ButtonGroup>
        </Stack>

        <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
          {renderChart()}
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default SalesChart;
