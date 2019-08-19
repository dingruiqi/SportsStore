import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Product } from './product.model';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Order } from './order.model';
import { url } from 'inspector';


const PROTOCOL = "http";
const PORT = 3500;

const METHOD_DELTE = 'DELETE';
const METHOD_POST = 'POST';
const METHOD_GET = 'GET';
const METHOD_PUT = 'PUT';



@Injectable()
export class RestDataSource {
    baseUrl: string;
    auth_token: string;

    constructor(private http: HttpClient) {
        this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/`;
    }

    authenticate(user: string, pass: string): Observable<boolean> {
        let configUrl = this.baseUrl + "login";

        return this.http.post<{ success: boolean, token: string }>(configUrl, { name: user, password: pass })
            .pipe(
                map(result => {
                    this.auth_token = result.success ? result.token : null;
                    return result.success;
                }),
                catchError(this.handleError) // then handle the error
            );
    }

    getProducts(): Observable<Product[]> {
        let configUrl = this.baseUrl + "products";

        return this.sendRequest(METHOD_GET, configUrl).pipe(
            map(data => {
                let products = (<Product[]>data);
                return products;
            }),
            retry(3), // retry a failed request up to 3 times
            catchError(this.handleError) // then handle the error

        );
        /* return this.http.get<Product[]>(configUrl)
            .pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError) // then handle the error
            ); */
    }

    saveOrder(order: Order): Observable<Order> {
        let configUrl = this.baseUrl + "orders";

        return this.sendRequest(METHOD_POST, configUrl, order)
            .pipe(
                map(data => {
                    let order = (<Order>data);
                    return order;
                }),
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError) // then handle the error
            );
        /* return this.http.post<Order>(configUrl, order)
            .pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError) // then handle the error
            ); */
    }

    private sendRequest(verb: string,
        url: string, body?: Product | Order, auth: boolean = false)
        : Observable<Product | Product[] | Order | Order[]> {

        let headers = new HttpHeaders();

        if (auth && this.auth_token != null) {
            headers.set("authorization", `Bearer<${this.auth_token}>`);
        }

        let options = {
            body: body ? body : null,
            headers: headers,
            //responseType: 'json',
        };

        // let i=3;
        // let rr = this.http.request<Product| Product[] >(verb,url,options).subscribe(data=>{
        //     let ii = data;
        //     let product = ii[0].id;
        //     let name = ii[0].name;
        // })
        // rr.pipe(map(t=>{
        //     console.log(t);
        //     return t;
        // }));


        return this.http.request<Product | Product[] | Order | Order[]>(verb, url, options);
    }

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