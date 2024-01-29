export default interface IQfMaktabiPrivilageAdminState{
    OfferList:boolean,
    VendorList: boolean,
    NewOfferPage:boolean,
    ViewEditRenew:boolean,
    NewVendorPage:boolean,

    //create new offer Modal
    GroupModal:boolean
    CategoriesModal:boolean,
    ApprovalModal:boolean,
    OfferTypes:boolean,
    Survey:boolean,
    Banner:boolean,
    OfferSummary:boolean,
    SupplierReq:boolean,
    OfferRating:boolean
    //create new offer Modal

    dataForOfferViewEditPage:any,
      dataForVendorViewEditPage:any,
            vieworeditcondition:number,

            vendoreditrenew:boolean,

            OfferIDtoPass:number,

            modalOpen:boolean,


            //access
            ppTeam:boolean,
      ppAdminTeam:boolean,
      loadcomplete:boolean,
            //access
}