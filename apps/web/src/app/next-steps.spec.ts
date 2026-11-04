import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

// The welcome page's "Next Steps": each card writes its command into the
// terminal under them (a hidden input's value, switched on by ngSwitch). The
// template's specs check the banner; this checks the one part of the page
// that reacts to a click, so a change-detection or template-compiler change
// that breaks it fails here and not in a visitor's browser.
describe('the Next Steps terminal', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function terminal(compiled: HTMLElement): string {
    return compiled.querySelector('.terminal pre')?.textContent?.trim() ?? '';
  }

  it('starts on the new-component command', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(terminal(fixture.nativeElement as HTMLElement)).toBe('ng generate component xyz');
  });

  it('shows the command of the card that was clicked', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const expected: Record<string, string> = {
      'Angular Material': 'ng add @angular/material',
      'Add PWA Support': 'ng add @angular/pwa',
      'Add Dependency': 'ng add _____',
      'Run and Watch Tests': 'ng test',
      'Build for Production': 'ng build',
      'New Component': 'ng generate component xyz',
    };
    const buttons = Array.from(compiled.querySelectorAll<HTMLButtonElement>('button.card'));
    expect(buttons.map((b) => b.textContent?.trim())).toEqual([
      'New Component',
      'Angular Material',
      'Add PWA Support',
      'Add Dependency',
      'Run and Watch Tests',
      'Build for Production',
    ]);
    for (const [label, command] of Object.entries(expected)) {
      buttons.find((b) => b.textContent?.trim() === label)!.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(terminal(compiled)).toBe(command);
    }
  });
});
