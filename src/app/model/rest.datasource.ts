import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Order } from './order.model';


const PROTOCOL = "http";
const PORT = 3500;

@Injectable()
export class RestDataSource {
    baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/`;
    }

    getProducts(): Observable<Product[]> {
        let configUrl = this.baseUrl + "products";
        return this.http.get<Product[]>(configUrl)
            .pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError) // then handle the error
            );
    }

    saveOrders(order: Order): Observable<Order> {
        let configUrl = this.baseUrl + "orders";
        return this.http.post<Order>(configUrl, order)
            .pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError) // then handle the error
            );
    }

    // private sendRequest(verb:request)

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };

    makeIntentionalError() {
        return this.http.get('not/a/real/url')
            .pipe(
                catchError(this.handleError)
            );
    }
}