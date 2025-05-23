import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addMonths } from 'date-fns';

export default function TestDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(addMonths(new Date(), 3));

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        height: 'fit-content'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontFamily: 'Poppins',
          fontWeight: 700,
          color: '#333'
        }}
      >
        Test Date
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar 
          value={selectedDate}
          onChange={(newValue: Date | null) => setSelectedDate(newValue)}
          sx={{
            '& .MuiPickersDay-root.Mui-selected': {
              backgroundColor: '#7c4dff',
              '&:hover': {
                backgroundColor: '#6b42e0'
              }
            },
            '& .MuiDayCalendar-header': {
              '& .MuiTypography-root': {
                fontSize: '0.675rem'
              }
            },
            '& .MuiPickersDay-root': {
              width: 24,
              height: 24,
              fontSize: '0.75rem',
              margin: '1px'
            },
            '& .MuiPickersCalendarHeader-root': {
              paddingLeft: 1,
              paddingRight: 1,
              marginTop: '4px',
              marginBottom: '4px',
              '& .MuiPickersCalendarHeader-label': {
                fontSize: '0.875rem'
              },
              '& .MuiSvgIcon-root': {
                width: '18px',
                height: '18px'
              }
            },
            '& .MuiDayCalendar-weekContainer': {
              margin: '2px 0'
            }
          }}
        />
      </LocalizationProvider>
      <Box sx={{ mt: 2 }}>
        <Typography 
          sx={{ 
            fontFamily: 'Poppins',
            color: '#666',
            fontSize: '0.875rem'
          }}
        >
          Next JLPT Test Date:
        </Typography>
        <Typography 
          sx={{ 
            fontFamily: 'Poppins',
            color: '#333',
            fontWeight: 600
          }}
        >
          {selectedDate?.toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      </Box>
    </Paper>
  );
}
