import { LightningElement, api, wire } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
export default class CardComponent extends LightningElement {
    @api acc;
    @wire(CurrentPageReference) pageRef;

    //used pubsub event to pass the selected Account Id to respective component
    accountDetailsClick(event) {
        this.accountId = event.target.value;
        fireEvent(this.pageRef, "handleAccountIdDetailEvent", this.accountId);
    }
}