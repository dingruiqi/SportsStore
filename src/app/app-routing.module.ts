import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { CartDetailComponent } from './store/cartDetail.component';
import { CheckoutComponent } from './store/checkout.component';
import { StoreFirstGuard } from './store/storeFirst.guard';


const routes: Routes = [
  { path: "store", component: StoreComponent, canActivate: [StoreFirstGuard] },
  { path: "cart", component: CartDetailComponent, canActivate: [StoreFirstGuard] },
  { path: "checkout", component: CheckoutComponent, canActivate: [StoreFirstGuard] },
  { path: "admin", loadChildren: "src/app/admin/admin.module#AdminModule", canActivate: [StoreFirstGuard] },//动态加载管理模块
  { path: "**", redirectTo: "/store" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
