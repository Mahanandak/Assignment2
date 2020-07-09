import { LightningElement, wire, track, api } from 'lwc';
import fetchAllAccounts from '@salesforce/apex/AccountManager.getAccountListByType';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
export default class SearchResults extends LightningElement {
    @track accountData;
    @track accData;
    @wire(CurrentPageReference) pageRef;
    @track accFilter;
    @track openDetailAccount = false;

    //Listen the pubsub event using registerListener method.
    //registerListener method takes three parameters event name,callback method, received parameter
    connectedCallback() {
        registerListener("handleRefreshEvent", this.handelAccFilterChange, this);
        registerListener("handleAccountChangeEvent", this.handelAccFilterChange, this);
    }

    //called unregisterAllListeners method
    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    //show toast method is used to display success or errormessages 
    //it takes three parameters title,message,varient
    showToast(title, message, variant) {
            const evt = new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
            });
            this.dispatchEvent(evt);
        }
        /*  @api refreshData() {
              console.log("refresh");
              return refreshApex(this.accData);
          }*/

    //imperitive method is used to push data in accData variable.
    //This method called by Pubsub registerListener method which pass the selected account type as parameter
    //Acc type parameter pass to apex class to get Account data from server
    //accData used to  store account data,displyed data through accData variable.

    handelAccFilterChange(accType) {
        this.accFilter = accType;
        this.accData = [];
        fetchAllAccounts({
                searchKey: this.accFilter,
            })
            .then(result => {
                this.accData = result;
            })
            .catch(error => {
                this.showToast('ERROR', error.body.message, 'error');
            });
    }
}