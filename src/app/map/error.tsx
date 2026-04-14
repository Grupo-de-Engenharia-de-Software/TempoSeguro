'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function MapError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Container sx={{ textAlign: 'center', pt: 10 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4">Failed to load the map</Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {error.message || 'An unexpected error occurred while loading the map.'}
        </Typography>
        <Button variant="contained" onClick={reset}>
          Retry
        </Button>
      </Stack>
    </Container>
  );
}
