import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

declare const grecaptcha: any;

@Component({
  selector: 'app-recaptcha',
  template: `<div class="g-recaptcha" id="recaptcha-container"></div>`,
  standalone: true
})
export class RecaptchaComponent implements AfterViewInit {
  @Input() siteKey!: string;
  @Output() verified = new EventEmitter<string>();

  ngAfterViewInit(): void {
    // 👇 Fix TypeScript error
    (window as any)['onRecaptchaSuccess'] = (token: string) => {
      this.verified.emit(token);
    };

    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.render('recaptcha-container', {
        sitekey: this.siteKey,
        callback: 'onRecaptchaSuccess'
      });
    }
  }
}
