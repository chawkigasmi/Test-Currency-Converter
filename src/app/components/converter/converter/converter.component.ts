import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversionHistory } from '../../../models/conversion-history';
import { ExchangeRateService } from '../../../services/exchange-rate.service';
import { ConversionHistoryComponent } from '../conversion-history/conversion-history.component';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ConversionHistoryComponent],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  exchangeRate: number = 1.1;  
  amount: number = 0;  
  convertedAmount: number = 0;  
  isEuroToDollar: boolean = true;  
  customExchangeRate: number | null = null;  
  conversionHistory: ConversionHistory[] = [];  
  private readonly MAX_HISTORY_LENGTH = 5;  

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    // Initialise le composant et récupère le taux de change initial depuis le service
    this.exchangeRate = this.exchangeRateService.getExchangeRate();
    this.updateExchangeRate();  // Démarre la mise à jour périodique du taux de change
  }

  updateExchangeRate(): void {
    setInterval(() => {
      if (this.customExchangeRate === null) {
        // Met à jour le taux de change via le service
        this.exchangeRateService.updateExchangeRate();
        this.exchangeRate = this.exchangeRateService.getExchangeRate();  // Récupère le taux de change mis à jour
      }
    }, 3000);  // Actualise le taux toutes les 3 secondes
  }

  convertAmount(): void {
    // Calcule le montant converti basé sur la direction de la conversion
    if (this.isEuroToDollar) {
      this.convertedAmount = this.amount * this.exchangeRate;  // Conversion EUR à USD
    } else {
      this.convertedAmount = this.amount / this.exchangeRate;  // Conversion USD à EUR
    }
    this.addToHistory();  // Ajoute la conversion à l'historique
  }

  toggleConversionDirection(): void {
    // Inverse la direction de la conversion et recalcule le montant
    this.isEuroToDollar = !this.isEuroToDollar;
    [this.amount, this.convertedAmount] = [this.convertedAmount, this.amount];  // Échange les montants
    this.convertAmount();
  }

  setCustomExchangeRate(rate: number | null): void {
    // Définit un taux de change personnalisé ou réinitialise au taux actuel
    this.customExchangeRate = rate !== null ? rate : this.exchangeRateService.getExchangeRate();
  }

  addToHistory(): void {
    // Ajoute la dernière conversion à l'historique, limite à une longueur maximale
    if (this.conversionHistory.length >= this.MAX_HISTORY_LENGTH) {
      this.conversionHistory.shift();  // Supprime l'élément le plus ancien si la limite est atteinte
    }
    this.conversionHistory.push({
      realRate: this.exchangeRate,
      customRate: this.customExchangeRate,
      initialAmount: this.amount,
      initialCurrency: this.isEuroToDollar ? 'EUR' : 'USD',
      convertedAmount: this.convertedAmount,
      convertedCurrency: this.isEuroToDollar ? 'USD' : 'EUR'
    });
  }
}
