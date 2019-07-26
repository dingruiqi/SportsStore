import { Directive, ViewContainerRef, TemplateRef, Input, Attribute, SimpleChanges } from "@angular/core"

@Directive({
    selector:"[counterOf]"
})
export class CounterDirective{
    constructor(private container: ViewContainerRef,
        private template:TemplateRef<Object>){
            
        }
}