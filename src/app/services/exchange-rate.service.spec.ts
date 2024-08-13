import { TestBed } from '@angular/core/testing';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default exchange rate', () => {
    expect(service.getExchangeRate()).toBe(1.1);
  });

  it('should set exchange rate correctly', () => {
    service.setExchangeRate(1.5);
    expect(service.getExchangeRate()).toBe(1.5);
  });

  it('should update exchange rate randomly within expected range', () => {
    const baseRate = service.getExchangeRate();
    service.updateExchangeRate();
    const updatedRate = service.getExchangeRate();
    expect(updatedRate).toBeGreaterThanOrEqual(baseRate - 0.05);
    expect(updatedRate).toBeLessThanOrEqual(baseRate + 0.05);
    expect(updatedRate).not.toBe(baseRate); 
  });

  it('should round exchange rate to two decimal places after update', () => {
    service.setExchangeRate(1.1234);
    service.updateExchangeRate();
    const regex = /^\d+\.\d{2}$/;
    const updatedRate = service.getExchangeRate().toString();
    expect(regex.test(updatedRate)).toBeTruthy();
  });
});
