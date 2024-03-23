import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from './services/location.service';

export const locationGuard = () => {
  const location = inject(LocationService);
  const router = inject(Router);

  if (location.latitude && location.longitude) {
    return true;
  }

  // Redirect to the login page
  console.debug('Bounced by locationGuard')
  return router.parseUrl('/');
};
