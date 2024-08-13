import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private currentRate: number = 1.1;

  getExchangeRate(): number {
    return this.currentRate;
  }


  updateExchangeRate(): void {
    const randomChange = (Math.random() - 0.5) / 10;
    this.currentRate += randomChange;
    this.currentRate = Math.round(this.currentRate * 100) / 100;
  }
}
