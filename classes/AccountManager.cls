public with sharing class AccountManager {
    public AccountManager() {

    }
    @AuraEnabled(cacheable=true)
    public static list<Account> getAllAccount(){
      
        return [SELECT Id,Type FROM Account];
    }
    @AuraEnabled
    public static list<Account>getAccountListByType(string searchKey){
    string searchTerm = '%'+ searchKey+ '%';
    return [SELECT Id,Name,AccountNumber,Website,Rating,Phone,Description FROM Account WHERE Type like :searchTerm LIMIT 10];
     }

    
}