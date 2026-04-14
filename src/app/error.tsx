'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Container sx={{ textAlign: 'center', pt: 10 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Something went wrong
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        {error.message || 'An unexpected error occurred.'}
      </Typography>
      <Button variant="contained" onClick={reset}>
        Try again
      </Button>
    </Container>
  );
}
