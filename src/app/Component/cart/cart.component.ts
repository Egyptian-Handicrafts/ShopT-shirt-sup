import { Component } from '@angular/core';
import { Iproduct } from '../interface/Iproduct';
import { CartService } from '../../Service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: Iproduct[] = [];



  constructor(private cartService: CartService) { }

  // ngOnInit(): void {
  //   this.cartService.cartItems$.subscribe(items => {
  //     this.cartItems = items;
  //   });
  // }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }
  
  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  getTotalPrice(): number {
    // return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return this.cartService.getTotalPrice()

  }

  increaseQuantity(item: Iproduct): void {
    item.quantity++;
    this.cartService.updateQuantity(item.id, item.quantity);
  }

  decreaseQuantity(item: Iproduct): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateQuantity(item.id, item.quantity);
    }
  }


  // updateQuantity(productId: string, quantity: number): void {
  //   this.cartService.updateQuantity(productId, quantity);
  // }

  updateQuantity(productId: string, event: Event): void {
    const target = event.target as HTMLInputElement; // تحويل EventTarget إلى HTMLInputElement
    const quantity = +target.value; // تحويل القيمة إلى رقم
    this.cartService.updateQuantity(productId, quantity);
  }

  addToCart(product: Iproduct): void {
    if (!product.quantity) {
      product.quantity = 1;
    }
    this.cartService.addToCart(product);
  }
  
}
