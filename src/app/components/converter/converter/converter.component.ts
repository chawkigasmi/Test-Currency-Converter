import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversionHistory } from '../../../models/conversion-history';
import { ExchangeRateService } from '../../../services/exchange-rate.service';
import { ConversionHistoryComponent } from '../conversion-history/conversion-history.component';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule,ConversionHistoryComponent],
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
    this.updateExchangeRate();  // Initialise le composant et démarre la mise à jour périodique du taux de change.
  }

  updateExchangeRate(): void {
    setInterval(() => {
      if (this.customExchangeRate === null) {
        // Met à jour le taux de change avec une variation aléatoire si aucun taux personnalisé n'est défini.
        const randomChange = (Math.random() - 0.5) / 10;
        this.exchangeRate += randomChange;
        this.exchangeRate = Math.round(this.exchangeRate * 100) / 100;
      }
    }, 3000);  // Actualise le taux toutes les 3 secondes.
  }

  convertAmount(): void {
    // Calcule le montant converti basé sur la direction de la conversion et met à jour l'historique.
    if (this.isEuroToDollar) {
      this.convertedAmount = this.amount * this.exchangeRate;
    } else {
      this.convertedAmount = this.amount / this.exchangeRate;
    }
    this.addToHistory();
  }

  toggleConversionDirection(): void {
    // Inverse la direction de la conversion et recalcule immédiatement le montant converti.
    this.isEuroToDollar = !this.isEuroToDollar;
    [this.amount, this.convertedAmount] = [this.convertedAmount, this.amount];
    this.convertAmount();
  }

  setCustomExchangeRate(rate: number | null): void {
    // Définit un taux de change personnalisé ou réinitialise au taux actuel si null est passé.
    this.customExchangeRate = rate !== null ? rate : this.exchangeRate;
  }

  addToHistory(): void {
    // Ajoute la dernière conversion à l'historique et limite la taille de l'historique.
    if (this.conversionHistory.length >= this.MAX_HISTORY_LENGTH) {
      this.conversionHistory.shift();  // Supprime l'élément le plus ancien si la limite est atteinte.
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
