import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { Iproduct } from '../interface/Iproduct';
import { CartService } from '../../Service/cart.service';
import { WhatchlaterHarteService } from '../../Service/whatchlater-harte.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  bigImgSrc: string = '';
  oneProduct: Iproduct | undefined; // استخدام oneProduct بدلاً من product
  productId: any;
  errMsg: any;
  

  products: Iproduct[] = [];
  filteredProducts: Iproduct[] = [];
  errMsgProduct: string | null = null;
  price: number = 0;

  colors: string[] = ['#000000', '#dc2626', '#2563eb', '#16a34a', 'yellow', '#8b5cf6', 'orange'];
  additionalColors: string[] = ['skyblue', 'palevioletred', 'white'];
  selectedColor: string | null = null;

  selectedCategories: string[] = [];
  selectedPriceRange: number = 0;
  selectedRating: number | null = null;

  mainImage: string = '';
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private watchlater: WhatchlaterHarteService
  ) { }

  changeMainImage(image: string): void {
    this.mainImage = image;
  }

  increaseQuantity(product: Iproduct): void {
    if (product) {
      product.quantity++;
      this.cartService.updateQuantity(product.id, product.quantity);
    }
  }

  decreaseQuantity(product: Iproduct): void {
    if (product && product.quantity > 1) {
      product.quantity--;
      this.cartService.updateQuantity(product.id, product.quantity);
    }
  }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productService.getOneProduct(this.productId).subscribe({
        next: (data) => {
          this.oneProduct = data;
          if (this.oneProduct && !this.oneProduct.quantity) {
            this.oneProduct.quantity = 1;
          }
          if (this.oneProduct?.images && this.oneProduct.images.length > 0) {
            this.mainImage = this.oneProduct.images[0];
          }
        },
        error: (err) => {
          this.errMsg = err.message || 'Product not found';
          return throwError(() => err);
        }
      });
    }
  }

  updatePrice(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedPriceRange = parseFloat(target.value);
  }
  updateQuantity(newQuantity: number): void {
    if (this.oneProduct) {
      this.oneProduct.quantity = newQuantity;
      this.cartService.updateQuantity(this.oneProduct.id, newQuantity);
    }
  }

  selectColor(color: string): void {
    this.selectedColor = this.selectedColor === color ? null : color;
  }

  toggleCategory(category: string): void {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    } else {
      this.selectedCategories.push(category);
    }
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

  getOneProduct(id: string): void {
    this.router.navigate(['/product', id]);
  }

  addToCart(): void {
    if (this.oneProduct) {
      if (!this.oneProduct.quantity) {
        this.oneProduct.quantity = 1; // تعيين الكمية إلى 1 إذا لم تكن موجودة
      }
      this.cartService.addToCart(this.oneProduct);
    }
  }

  saveImage(product: any): void {
    this.watchlater.saveImage(product);
  }
}