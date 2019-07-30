import { Component } from "@angular/core";
import { Cart } from '../model/cart.model';

//import { FaIconService } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: "cart-summary",
    //moduleId:module.id,
    templateUrl: "cartSummary.component.html",
    // providers: [
    //     FaIconService
    //   ]
})
export class CartSummaryComponent {
    constructor(public cart: Cart) {
        library.add(faShoppingCart);
    }
}