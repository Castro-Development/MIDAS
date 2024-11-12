import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-phone-input',
  template: `
    <input
      type="tel"
      [value]=formattedPhone
      (input)="handleInput($event)"
      placeholder="(555) 555-5555"
      class="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      maxlength="14"
      [disabled]="disabled"
    />
  `,
  providers : [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppPhoneInputComponent),
      multi: true
    }
  ]
})
export class AppPhoneInputComponent {
  formattedPhone = '';
  disabled = false;
  private onChange: any = () => {};
  private onTouched: any = () => {};

  formatPhoneNumber(value: string): string {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format the number as (XXX) XXX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.formattedPhone = this.formatPhoneNumber(value);
    
    // Extract just the numbers for the model value
    const numberValue = this.formattedPhone.replace(/\D/g, '');
    this.onChange(numberValue);
    this.onTouched();
  }

  writeValue(value: string): void {
    if (value) {
      this.formattedPhone = this.formatPhoneNumber(value);
    } else {
      this.formattedPhone = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
