import { LightningElement, api, wire, track } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import { CurrentPageReference } from 'lightning/navigation'
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import SITE_FIELD from '@salesforce/schema/Account.Site';
import ACCOUNT_NUMBER from '@salesforce/schema/Account.AccountNumber';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { fireEvent } from 'c/pubsub';
export default class IdsDetailComponent extends LightningElement {
    @api accountDetailId;
    @api isCameFromDetail = false;
    @api accEditId;
    @track accEditDetails = false;
    @track accType;
    nameField = NAME_FIELD;
    siteField = SITE_FIELD;
    accNoField = ACCOUNT_NUMBER;
    phoneField = PHONE_FIELD;
    websiteField = WEBSITE_FIELD;
    ratingField = RATING_FIELD;
    accountObj = ACCOUNT_OBJECT;


    //get the page reference from CurrentPageReference
    @wire(CurrentPageReference) pageRef;

    //After update the account displayed the toast message.
    //accEditDetails is a flag sets to false,after editing the data.
    //Used pubsub fireEventMethod to pass updated data
    handelAccountCreated(event) {
        const evt = new ShowToastEvent({
            title: 'Account Created',
            message: '',
            variant: "success"
        });
        this.dispatchEvent(evt);
        this.accEditDetails = false;
        fireEvent(this.pageRef, "handleRefreshEvent", this.accType);
    }


    //called on click of cancelbutton to clear the data from lightning input field
    handelCancel(event) {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    //get Record Wire Adapter to get the selected account Id data 
    //getRecord takes two parameters dynamic account Id and Fields that want to display
    //accountRecordis variable to store the get account record data.  
    @wire(getRecord, { recordId: '$accountDetailId', fields: [NAME_FIELD, SITE_FIELD, WEBSITE_FIELD, ACCOUNT_NUMBER, PHONE_FIELD, RATING_FIELD] })
    accountRecord

    //get account Name from accountRecord
    get accName() {
            if (this.accountRecord.data) {
                return this.accountRecord.data.fields.Name.value;
            }
        }
        //get account Name from accountRecord

    //get account Website from accountRecord
    get accWebsite() {
            if (this.accountRecord.data) {
                return this.accountRecord.data.fields.Website.value;

            }
        }
        //get account Rating from accountRecord
    get accRating() {
            if (this.accountRecord.data) {
                return this.accountRecord.data.fields.Rating.value;

            }
        }
        //get account Number from accountRecord
    get accNumber() {
            if (this.accountRecord.data) {
                return this.accountRecord.data.fields.AccountNumber.value;

            }
        }
        //get account Phone from accountRecord
    get accPhone() {
            if (this.accountRecord.data) {
                return this.accountRecord.data.fields.Phone.value;

            }
        }
        //pubsub register listener methhod to get Account Id & Accoont Type
    connectedCallback() {
        registerListener("handleAccountIdDetailEvent", this.handelDetailAccountId, this);
        registerListener("handleAccountChangeEvent", this.getAccType, this);

    }

    //call back method called by pubsub register listener method event - handleAccountChangeEvent
    getAccType(filterAccType) {
            this.accType = filterAccType;
            console.log("this.accType" + this.accType);

        }
        //called pubsub unregisterAllListeners 
    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    //call back method called by pubsub register listener method event - handleAccountIdDetailEvent
    //isCameFromDetail flag sets true 
    handelDetailAccountId(accId) {
        this.isCameFromDetail = true;
        this.accountDetailId = accId;
    }

    //called when Edit button click
    // accEditDetails flag sets to true
    //get the editedAccount Id to disply editable data on click of edit button.
    // used accEditId variable on UI to display data
    accountEditClick(event) {
        this.accEditDetails = true;
        this.accEditId = event.target.value;
    }
}