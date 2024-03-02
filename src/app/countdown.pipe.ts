import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { startWith, map, takeWhile } from 'rxjs/operators';
import { intervalToDuration } from 'date-fns';

@Pipe({
  name: 'countdown',
  pure: false // Necessary for the countdown updates
})
export class CountdownPipe implements PipeTransform, OnDestroy {
  private timerSubscription: Subscription | null = null;
  private lastValue: string = ''; // Store the last computed value

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  transform(value: Date | string): string {
    if (!this.timerSubscription) {
      const endDate = new Date(value);
      const endDateMs = endDate.getTime();

      if (isNaN(endDateMs)) {
        console.error('Invalid date provided to countdown pipe');
        return 'Invalid date';
      }

      this.timerSubscription = interval(1000).pipe(
        startWith(0),
        map(() => {
          const now = Date.now();
          if (endDateMs < now) {
            this.cleanup();
            return '00:00';
          }
          const duration = intervalToDuration({ start: new Date(), end: endDate });
          const minutes = String(duration.minutes || 0).padStart(2, '0');
          const seconds = String(duration.seconds || 0).padStart(2, '0');
          return `${minutes}:${seconds}`;
        }),
        takeWhile(time => time !== '00:00', true)
      ).subscribe(time => {
        this.lastValue = time; // Update the stored value
        this.changeDetectorRef.markForCheck(); // Ensure view is updated
      });
    }

    return this.lastValue; // Return the last computed value
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
}
