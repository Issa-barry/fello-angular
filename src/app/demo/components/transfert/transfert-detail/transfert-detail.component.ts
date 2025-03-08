import { Component } from '@angular/core';

@Component({
  selector: 'app-transfert-detail',
  standalone: false,
  // imports: [],
  templateUrl: './transfert-detail.component.html',
  styleUrl: './transfert-detail.component.scss'
})
export class TransfertDetailComponent {
  products = [
    {
        name: 'Cotton Sweatshirt',
        size: 'Medium',
        color: 'White',
        price: '$12',
        quantity: '1',
        image: 'assets/demo/images/ecommerce/ordersummary/order-summary-1-1.png'
    },
    {
        name: 'Regular Jeans',
        size: 'Large',
        color: 'Black',
        price: '$24',
        quantity: '1',
        image: 'assets/demo/images/ecommerce/ordersummary/order-summary-1-2.png'
    }
];
}
