import { LightningElement, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import TYPE from "@salesforce/schema/Account.Type";
import { fireEvent } from "c/pubsub";
export default class PicklistSearch extends LightningElement {
    selectedAccount;
    accountOptions = [];
    errorDeatails;

    //used uiObjectInfoApi for get list of account type

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: TYPE
    })
    typeArray;

    //used options to display data in combobox in UI 
    //check data validations for error handling

    get options() {
            return this.typeArray.data ? this.typeArray.data.values : {};
        }
        // get pageRefence for navigation

    @wire(CurrentPageReference) pageRef;

    //onchange event of combobox to get selected data  

    accountNameChange(event) {
            this.selectedItem = event.detail.value;
        }
        //onclick method of Search button 
        //used pubsub event to pass the selected account type  to component.
        //fireEvent method takes three parameters pageRef,event name and Parameter which want to pass to respective component.

    handleTypeSearch() {
        fireEvent(this.pageRef, "handleAccountChangeEvent", this.selectedItem);
    }
}