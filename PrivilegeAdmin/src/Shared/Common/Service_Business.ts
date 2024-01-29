import { WebPartContext } from "@microsoft/sp-webpart-base";
// import * as React from "react";
import { IWeb, sp } from "@pnp/sp/presets/all";
import { LISTS } from "./Service_Config";
import { SPService } from "./Service_dataAccess";
import { saveAs } from 'file-saver';
// import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import {  IColumn  } from '@fluentui/react';
import moment from "moment";




import * as XLSX from 'xlsx';





export class Service_Business_Ar {
    private _services: SPService;
    constructor(private context: WebPartContext) {
        sp.setup({
            spfxContext: context as any,
        });
        this._services = new SPService(context as any);
    }

    public getPrivilegeFinalOffers = async (filterquery = "") => {
        // const FinalOfferDetails = await this._services.getListitemsusingRestAPI(this.context.pageContext.web.absoluteUrl + "/_api/Web/Lists/GetByTitle('Offers')/items?$select=Status,Group/groupName,Group/ID,Vendor/Vendor_x002f_Branch_x0020_Name,Vendor/ID,Vendor/VendorContactName,Vendor/VendorEmail,Vendor/VendrOfficeTel,Vendor/Website,Branches/ID,Branches/branchName,offer_x0020_end_x0020_date,Offer_x0020_Title,offer0,Rating,discount,ID,offer_x0020_start_x0020_date,Modified,Created,L1Category/Categories,L1Category/ID,Attachments,AttachmentFiles,L2Categories/ID,L2Categories/subCategories,L3Categories/ID,L3Categories/subSubCategories,OfferURL&$expand=AttachmentFiles,Group,Vendor,Branches,L1Category,L2Categories,L3Categories&$filter=((Status ne 'Submitted') and (Status ne 'Cancelled'))&$top=4999&$orderby=Created desc")
        const today = new Date().toISOString().split('T')[0]; // Get today's date in ISO format

        const filterQuery = `Status eq 'Approved' and offer_x0020_end_x0020_date ge '${today}'`;
        const selectedFields = [
            { key: "Id", fieldType: "SP.FieldNumber" },
            { key: "Group/groupName", fieldType: "SP.FieldText" },
            { key: "Group", fieldType: "SP.FieldLookup" },
            { key: "Vendor", fieldType: "SP.FieldLookup" },
            { key: "Branches", fieldType: "SP.FieldLookupNoTitle" },
            { key: "L1Category", fieldType: "SP.FieldLookup" },
            { key: "L2Categories", fieldType: "SP.FieldLookup" },
            { key: "L3Categories", fieldType: "SP.FieldLookup" },
            { key: "Vendor/Vendor_x002f_Branch_x0020_Name",fieldType: "SP.FieldText"},
            // { key: "Vendor/VendorContactName", fieldType: "SP.FieldText"},
            // { key: "Vendor/VendorEmail", fieldType: "SP.FieldText" },
            // { key: "Vendor/VendrOfficeTel", fieldType: "SP.FieldText" },
            // { key: "Vendor/Website", fieldType: "SP.FieldText" },
            // { key: "Vendor/VendorCity", fieldType: "SP.FieldText" },
            // { key: "Branches/branchName", fieldType: "SP.FieldText" },
            // { key: "Branches/Latitude", fieldType: "SP.FieldText" },
            // { key: "Branches/Longitude", fieldType: "SP.FieldText" },
            { key: "offer_x0020_end_x0020_date", fieldType: "SP.FieldText" },
            { key: "Offer_x0020_Title", fieldType: "SP.FieldText" },
            { key: "offer0", fieldType: "SP.FieldText" },
            // { key: "Rating", fieldType: "SP.FieldText" },
            { key: "Status", fieldType: "SP.FieldText" },
            // { key: "discount", fieldType: "SP.FieldText" },
            { key: "offer_x0020_start_x0020_date", fieldType: "SP.FieldText" },
            // { key: "Modified", fieldType: "SP.FieldText" },
            // { key: "Created", fieldType: "SP.FieldText" },
            // { key: "OfferURL", fieldType: "SP.FieldText" },
            { key: "L1Category/Categories", fieldType: "SP.FieldText" },
            // { key: "L1Category/Arabic", fieldType: "SP.FieldText" },
            { key: "L2Categories/subCategories", fieldType: "SP.FieldText" },
            // { key: "L2Categories/Arabic", fieldType: "SP.FieldText" },
            { key: "L3Categories/subSubCategories", fieldType: "SP.FieldText" },
            // { key: "L3Categories/Arabic", fieldType: "SP.FieldText" },
        ]
        const FinalOfferDetails = this._services.getListItems(LISTS.PRIVILAGE_OFFERS, selectedFields,filterQuery);
        return FinalOfferDetails;
    }

    public getPrivilegeFinalVendors = async () => {
        const filterQuery="Status eq 'Approved'"
        const selectedFields = [
            { key: "Id", fieldType: "SP.FieldNumber" },
            { key: "Address", fieldType: "SP.FieldText" },
            { key: "logo", fieldType: "SP.FieldText" },
            { key: "Vendor_x002f_Branch_x0020_Name", fieldType: "SP.FieldText" },
            { key: "VendrOfficeTel", fieldType: "SP.FieldText" },
            { key: "Created", fieldType: "SP.FieldText" },
            { key: "Author", fieldType: "SP.FieldUser" },
            { key: "Status", fieldType: "SP.FieldText" },
            { key: "VendorContactEmail", fieldType: "SP.FieldText" },
            { key: "Group", fieldType: "SP.FieldLookup" },
            { key: "Group/groupName", fieldType: "SP.FieldText" },
            { key: "Active", fieldType: "SP.FieldText" },

        ];
        // const FinalVendorsDetails = await this._services.getListitemsusingRestAPI(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/getByTitle('vendor Master')/items?$select=Id,Id,Address,logo,Vendor_x002f_Branch_x0020_Name,VendrOfficeTel,Created,Author/Title,Author/EMail,Author/Name,Author/Id,Attachments,AttachmentFiles,Status,VendorContactEmail,Group/Title,Group/Id,Group/groupName,VendorContactEmail,VendorContactName,VendorContactPosition,VendorCity,City,VendorofficeTel,VendorEmail,Website&$expand=Author,AttachmentFiles,Group&$orderby=Created asc&$top=4999")

        const FinalVendorsDetails = this._services.getListItems(LISTS.PRIVILAGE_VENDORS, selectedFields,filterQuery);
        return FinalVendorsDetails;
    }

    public deleteOffer = async (Id: number) => {
        await this._services.DeleteItem(LISTS.PRIVILAGE_OFFERS, "", Id)
    }

    public renderColumn(columnNameArray) {
        const ColumnList: IColumn[] = [];
        columnNameArray.map((item, index) => {
            ColumnList.push({ key: `column ${index + 1}`, name: item.headerName, fieldName: item.fieldName, minWidth: 100, maxWidth: 200, isResizable: true })
        })
        const lengthColumn = ColumnList.length
        // ColumnList.push({key: `column ${lengthColumn+1}`,name: "Edit/Copy", fieldName: 'edit-copy', minWidth: 100, maxWidth: 200, isResizable: true
        // })
        return ColumnList
    }

    public renderRows(offerDetails, TableDetails) {
        const Rows: any[] = [];

        offerDetails.map((Listitem, index) => {
            let Row = {}

            TableDetails.map((item, index) => {
                const FieldName = item.fieldName;
                const ListValue = Listitem[item.ListColumn]

                if (item.lookup === 1) {
                    if (ListValue) {

                        Row = {
                            ...Row,
                            [FieldName]: ListValue[item.lookupColumn]
                        }
                    }

                }
                else if (item.lookup === 2) {
                    Row = {
                        ...Row,
                        [FieldName]: moment(ListValue).format("DD/MM/YYYY")
                    }
                }
                else {
                    Row = {
                        ...Row,
                        [FieldName]: ListValue
                    }
                }
            })

            Rows.push(Row);
        })


        return Rows
    }

    public getOfferTypes = async () => {
        const fields = [{ key: "OfferTypes", fieldType: "SP.FieldText" }]
        const Offertypes = await this._services.getListItems(LISTS.PRIVILAGE_OFFERTYPE, fields)
        console.log("offertypesbusniness", Offertypes)
        return Offertypes;
    }
    public ToComboBox = async (Items, field) => {
        const ToComboBox = []
        Items.map((item, index) => {
            if (item[field]) {
                ToComboBox.push({ key: item.ID, text: item[field] })
            }

        })

        return ToComboBox;
    }
    public ToComboBoxCountry = async (Items, field) => {
        const ToComboBox = []
        Items.map((item, index) => {
            ToComboBox.push({ key: item[field], text: item[field] })
        })

        return ToComboBox;
    }
    public getGroups = async () => {
        const fields = [{ key: "groupName", fieldType: "SP.FieldText" }]
        const Groups = await this._services.getListItems(LISTS.PRIVILAGE_GROUPS, fields, '', 'groupName', 500, true)
        console.log("groups", Groups)
        return Groups;
    }

    public getCategories = async () => {
        const fields = [{ key: "Categories", fieldType: "SP.FieldText" }]
        const Caterories = await this._services.getListItems(LISTS.PRIVILAGE_CATEGORIES, fields);
        console.log("Caterories", Caterories);
        return Caterories;
    }

    public getVendors = async (groupSelected) => {
        const filter = `Group/groupName eq '${groupSelected}'`
        const fields = [{ key: "Vendor_x002f_Branch_x0020_Name", fieldType: "SP.FieldText" }, { key: "Group", fieldType: "SP.FieldLookupCustom" },{ key: "Active", fieldType: "SP.FieldText" }]
        const Vendors = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_VENDORS, fields, filter, "Created", 4999, true, false, ['groupName'])
        console.log("Vendors", Vendors);
        const filterActive=[]
        await Vendors.map((item)=>{
            if(item.Active){
                filterActive.push(item)
            }
        })
        return filterActive;
    }
    public getVendorsbyID = async (id) => {
        const filter = `Group/ID eq '${id}'`
        const fields = [{ key: "Vendor_x002f_Branch_x0020_Name", fieldType: "SP.FieldText" }, { key: "Group", fieldType: "SP.FieldLookupCustom" }]
        const Vendors = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_VENDORS, fields, filter, "Created", 4999, true, false, ['groupName'])
        console.log("Vendors", Vendors);
        return Vendors;
    }

    public getBranches = async (vendorSelected) => {
        const filter = `vendor/Vendor_x002f_Branch_x0020_Name eq '${vendorSelected}'`
        const fields = [{ key: "branchName", fieldType: "SP.FieldText" }, { key: "vendor", fieldType: "SP.FieldLookupCustom" }]
        const Vendors = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_BRANCH, fields, filter, "Created", 4999, true, false, ['Vendor_x002f_Branch_x0020_Name'])
        console.log("Vendors", Vendors);
        return Vendors;
    }
    public getBranchesbyID = async (id) => {
        const filter = `vendor/ID eq '${id}'`
        const fields = [{ key: "branchName", fieldType: "SP.FieldText" }, { key: "vendor", fieldType: "SP.FieldLookupCustom" }, { key: "Latitude", fieldType: "SP.FieldText" }, { key: "Longitude", fieldType: "SP.FieldText" }]
        const Vendors = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_BRANCH, fields, filter, "Created", 4999, true, false, ['Vendor_x002f_Branch_x0020_Name'])
        console.log("Vendors", Vendors);
        return Vendors;
    }

    public getSubCategories = async (mainCategorySelected) => {
        const filter = `CategoryV1/Categories eq '${mainCategorySelected}'`
        const fields = [{ key: "subCategories", fieldType: "SP.FieldText" }, { key: "CategoryV1", fieldType: "SP.FieldLookupCustom" }]
        const subCategories = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_SUB_CATEGORIES, fields, filter, "Created", 4999, true, false, ['Categories'])
        console.log("SubCategories", subCategories);
        return subCategories;
    }
    public getSubCategoriesbyID = async (id) => {
        const filter = `CategoryV1/ID eq '${id}'`
        const fields = [{ key: "subCategories", fieldType: "SP.FieldText" }, { key: "CategoryV1", fieldType: "SP.FieldLookupCustom" }]
        const subCategories = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_SUB_CATEGORIES, fields, filter, "Created", 4999, true, false, ['Categories'])
        console.log("SubCategories", subCategories);
        return subCategories;
    }

    public getSubSubCategories = async (subCategoryselected) => {
        const filter = `SubCategories/subCategories eq '${subCategoryselected}'`
        const fields = [{ key: "subSubCategories", fieldType: "SP.FieldText" }, { key: "SubCategories", fieldType: "SP.FieldLookupCustom" }]
        const subsubCategories = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_SUB_SUB_CATEGORIES, fields, filter, "Created", 4999, true, false, ['subCategories'])
        console.log("SubCategories", subsubCategories);
        return subsubCategories;
    }
    public getSubSubCategoriesbyID = async (id) => {
        const filter = `SubCategories/ID eq '${id}'`
        const fields = [{ key: "subSubCategories", fieldType: "SP.FieldText" }, { key: "SubCategories", fieldType: "SP.FieldLookupCustom" }]
        const subsubCategories = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_SUB_SUB_CATEGORIES, fields, filter, "Created", 4999, true, false, ['subCategories'])
        console.log("SubCategories", subsubCategories);
        return subsubCategories;
    }

    public attachMentRenderingtoComboBox = async (Items) => {
        const ToComboBox = []
        Items.map((item, index) => {
            ToComboBox.push({ key: item["name"], text: item["name"] })
        })
        console.log(ToComboBox)

        return ToComboBox;
    }

    public saveOfferReport = async (item) => {
        console.log(item);
        const addedItem = await this._services.CreateItem(LISTS.PRIVILAGE_OFFERS, item);
        return addedItem
    }

    public saveOfferReportbyId = async (item, id) => {
        console.log(item);
        const addedData = await this._services.UpdateItem(LISTS.PRIVILAGE_OFFERS, item, id)
        return addedData
    }

    public async exportToExcelWorkBook(rows, columns, nameOfFile: string) {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const Heading_excel = []

        await columns.map(item => Heading_excel.push(item.name));

        const ws = XLSX.utils.book_new();
        // const ws = XLSX.utils.json_to_sheet(csvData,{header:["A","B","C","D","E","F","G"], skipHeader:false});  
        XLSX.utils.sheet_add_aoa(ws, [Heading_excel]);
        XLSX.utils.sheet_add_json(ws, rows, { origin: 'A2', skipHeader: true });
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        saveAs(data, nameOfFile + fileExtension);
    }


    public async getCountries() {
        const fields = [{ key: "Title", fieldType: "SP.FieldText" }]
        const countries = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_COUNTRIES, fields, "", "Created", 4999, true, false, [])
        console.log("Countries", countries);
        return countries;
    }


    public saveVendor = async (item) => {
        console.log(item);
        const addedItem = await this._services.CreateItem(LISTS.PRIVILAGE_VENDORS, item);
        return addedItem
    }
    public async saveVendorbyID(item, id) {
        console.log(item);
        const addedItem = await this._services.UpdateItem(LISTS.PRIVILAGE_VENDORS, item, id)

        return addedItem
    }
    public async addBranch(item) {
        console.log(item);
        await this._services.CreateItem(LISTS.PRIVILAGE_BRANCH, item);
    }

    public async updateBranch(item,id){
        console.log(item);
        const addedItem = await this._services.UpdateItem(LISTS.PRIVILAGE_BRANCH, item, id)

        return addedItem
    }


    //APPROVAAL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    public async getOfferByID(ID) {
        const selectedFields = [
            { key: "Id", fieldType: "SP.FieldNumber" },
            //rte

            { key: "Group/groupName", fieldType: "SP.FieldText" },
            { key: "Group", fieldType: "SP.FieldLookup" },
            { key: "Vendor", fieldType: "SP.FieldLookup" },
            { key: "Branches", fieldType: "SP.FieldLookupNoTitle" },
            { key: "L1Category", fieldType: "SP.FieldLookup" },
            { key: "L2Categories", fieldType: "SP.FieldLookup" },
            { key: "L3Categories", fieldType: "SP.FieldLookup" },
            {
                key: "Vendor/Vendor_x002f_Branch_x0020_Name",
                fieldType: "SP.FieldText",
            },

            { key: "Vendor/VendorContactName", fieldType: "SP.FieldText" },
            { key: "Vendor/VendorEmail", fieldType: "SP.FieldText" },
            { key: "Vendor/VendrOfficeTel", fieldType: "SP.FieldText" },
            { key: "Vendor/Website", fieldType: "SP.FieldText" },
            { key: "Vendor/VendorCity", fieldType: "SP.FieldText" },
            { key: "Branches/branchName", fieldType: "SP.FieldText" },
            { key: "Branches/Latitude", fieldType: "SP.FieldText" },
            { key: "Branches/Longitude", fieldType: "SP.FieldText" },
            { key: "offer_x0020_end_x0020_date", fieldType: "SP.FieldText" },
            { key: "Offer_x0020_Title", fieldType: "SP.FieldText" },
            { key: "offer0", fieldType: "SP.FieldText" },
            { key: "Rating", fieldType: "SP.FieldText" },
            { key: "Status", fieldType: "SP.FieldText" },
            { key: "discount", fieldType: "SP.FieldText" },
            { key: "offer_x0020_start_x0020_date", fieldType: "SP.FieldText" },
            { key: "Modified", fieldType: "SP.FieldText" },
            { key: "Offer", fieldType: "SP.FieldText" },
            { key: "Created", fieldType: "SP.FieldText" },
            { key: "OfferURL", fieldType: "SP.FieldText" },
            { key: "L1Category/Categories", fieldType: "SP.FieldText" },
            { key: "L1Category/Arabic", fieldType: "SP.FieldText" },
            { key: "L2Categories/subCategories", fieldType: "SP.FieldText" },
            { key: "L2Categories/Arabic", fieldType: "SP.FieldText" },
            { key: "L3Categories/subSubCategories", fieldType: "SP.FieldText" },
            { key: "L3Categories/Arabic", fieldType: "SP.FieldText" },
            { key: "Attachments", fieldType: "SP.FieldAttachment" },
            { key: "PortalAttachments", fieldType: "SP.FieldText" },

        ]
        const offerData = await this._services.getListItemById(LISTS.PRIVILAGE_OFFERS, selectedFields, ID)
        return offerData
    }



    public async getVendorBYID(ID) {
        const selectedFields = [
            { key: "Id", fieldType: "SP.FieldNumber" },
            { key: "Address", fieldType: "SP.FieldText" },
            { key: "logo", fieldType: "SP.FieldText" },
            { key: "Vendor_x002f_Branch_x0020_Name", fieldType: "SP.FieldText" },
            { key: "VendrOfficeTel", fieldType: "SP.FieldText" },
            { key: "Created", fieldType: "SP.FieldText" },
            { key: "Author", fieldType: "SP.FieldUser" },
            { key: "Status", fieldType: "SP.FieldText" },
            { key: "VendorContactEmail", fieldType: "SP.FieldText" },
            { key: "Group", fieldType: "SP.FieldLookup" },
            { key: "Group/groupName", fieldType: "SP.FieldText" },
            { key: "VendorCity", fieldType: "SP.FieldText" },
            { key: "VendorContactName", fieldType: "SP.FieldText" },
            { key: "VendorContactPosition", fieldType: "SP.FieldText" },
            { key: "VendorContactEmail", fieldType: "SP.FieldText" },
            { key: "City", fieldType: "SP.FieldText" },
            { key: "VendrOfficeTel", fieldType: "SP.FieldText" },
            { key: "VendorEmail", fieldType: "SP.FieldText" },
            { key: "Website", fieldType: "SP.FieldText" },
            { key: "Address", fieldType: "SP.FieldText" },
            { key: "VendorofficeTel", fieldType: "SP.FieldText" },
            { key: "Attachments", fieldType: "SP.FieldAttachment" },
        ];
        const vendorData = await this._services.getListItemById(LISTS.PRIVILAGE_VENDORS, selectedFields, ID)
        return vendorData
    }

    public async checkDuplicte(Title, groupID, vendorID) {
        const selectedFields = [
            { key: "Id", fieldType: "SP.FieldNumber" },
            { key: "offer0", fieldType: "SP.FieldText" },
            { key: "Group", fieldType: "SP.FieldLookup" },
            { key: "Vendor", fieldType: "SP.FieldLookup" },
        ]
        const filterQuery = `offer0 eq '${Title}' and Group/ID eq ${groupID}  and Vendor/ID eq ${vendorID}`

        const duplicateData = await this._services.getListItems(LISTS.PRIVILAGE_OFFERS, selectedFields, filterQuery)

        console.log(duplicateData)

        return duplicateData.length !== 0 ? true : false
    }
    public async checkDuplicteRenew(StartDate, EndDate, Id) {
        const selectedFields = [
            { key: "Id", fieldType: "SP.FieldNumber" },
            { key: "offer_x0020_start_x0020_date", fieldType: "SP.FieldText" },
            { key: "offer_x0020_end_x0020_date", fieldType: "SP.FieldText" },

        ]
        // const filterQuery= `offer0 eq '${Title}' and Group/ID eq ${groupID}  and Vendor/ID eq ${vendorID}`

        const duplicateData = await this._services.getListItemById(LISTS.PRIVILAGE_OFFERS, selectedFields, Id)
        console.log(StartDate, EndDate)
        const duplicate = (duplicateData.offer_x0020_start_x0020_date === StartDate || duplicateData.offer_x0020_end_x0020_date === EndDate) ? true : false
        console.log(duplicateData)
        console.log(duplicate)
        return duplicate
    }


    public deleteBranch = async (id) => {
        await this._services.DeleteItem(LISTS.PRIVILAGE_BRANCH, "", id)
    }
    public isAuthorized = async (groupName: string) => {
        const isMember = await this._services.isMemberOf(groupName);
        return isMember;
    };
    public async filterByDateRange(array: any, startDate, endDate, filterColumn) {
        // Convert start and end date strings to Date objects
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        console.log(startDateObj, endDateObj)

        // Filter the array based on the date range
        let filteredArray = []
        filteredArray=await array.filter(item => {
          const itemDate = new Date(item[filterColumn]);
          if(item[filterColumn]){
              console.log(itemDate)
            return itemDate >= startDateObj && itemDate <= endDateObj;
          }

        });

    
        
        // for (const key in array) {
        //     if (Object.prototype.hasOwnProperty.call(array, key)) {
        //         const itemDate = new Date(array[key][filterColumn]);
        //         if (!array[key][filterColumn]) {
        //             if (!isNaN(itemDate.getTime())) {
        //                 if (itemDate >= startDateObj && itemDate <= endDateObj) {
        //                     filteredArray.push(array[key]);
        //                 }
        //             }
        //         }
        //     }
        // }
        
        


        // if (startDateObj) {
        //     filteredArray = await array.filter((a) => {
        //       let date = new Date(a[filterColumn]);
        //       return date >= startDateObj;
        //     });
        // }
        // if (endDateObj) {
        //     filteredArray = await array.filter((a) => {
        //       let date = new Date(a[filterColumn]);
        //       return date >= endDateObj;
        //     });
        // }
        console.log(filteredArray);
        return filteredArray;
    }


    public async setVendorInactive(id,currentValue){
        const setValue= currentValue?false:true;
        const addedData = await this._services.UpdateItem(LISTS.PRIVILAGE_VENDORS, {Active:setValue}, id)
        return addedData;
    }


    //APPROVAL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>




    // public async getOfferByID(ID){
    //     const selectedFields=[
    //         { key: "ID", fieldType: "SP.FieldNumber" },
    //         { key: "Address", fieldType: "SP.FieldText" },
    //         { key: "Offer_x0020_Title", fieldType: "SP.FieldText" },
    //         { }
    //     ]
        
    // }
    public getOfferItem = async (web: IWeb, itemId: number) => {
        const selectedFields = [
          { key: "Id", fieldType: "SP.FieldNumber" },
          { key: "Offer", fieldType: "SP.FieldText" },
          { key: "PortalAttachments", fieldType: "SP.FieldText" },
          { key: "Attachments", fieldType: "SP.FieldAttachment" },
          { key: "ViewCount", fieldType: "SP.FieldText" },
          { key: "Group/groupName", fieldType: "SP.FieldText" },
          { key: "Group", fieldType: "SP.FieldLookup" },
          { key: "Vendor", fieldType: "SP.FieldLookup" },
          { key: "Branches", fieldType: "SP.FieldLookupNoTitle" },
          { key: "L1Category", fieldType: "SP.FieldLookup" },
          { key: "L2Categories", fieldType: "SP.FieldLookup" },
          { key: "L3Categories", fieldType: "SP.FieldLookup" },
          {
            key: "Vendor/Vendor_x002f_Branch_x0020_Name",
            fieldType: "SP.FieldText",
          },
          { key: "Vendor/VendorContactName", fieldType: "SP.FieldText" },
          { key: "Vendor/VendorEmail", fieldType: "SP.FieldText" },
          { key: "Vendor/VendrOfficeTel", fieldType: "SP.FieldText" },
          { key: "Vendor/Website", fieldType: "SP.FieldText" },
          { key: "Vendor/VendorCity", fieldType: "SP.FieldText" },
          { key: "Branches/branchName", fieldType: "SP.FieldText" },
          { key: "Branches/Latitude", fieldType: "SP.FieldText" },
          { key: "Branches/Longitude", fieldType: "SP.FieldText" },
          { key: "offer_x0020_end_x0020_date", fieldType: "SP.FieldText" },
          { key: "Offer_x0020_Title", fieldType: "SP.FieldText" },
          { key: "offer0", fieldType: "SP.FieldText" },
          { key: "Rating", fieldType: "SP.FieldText" },
          { key: "Status", fieldType: "SP.FieldText" },
          { key: "discount", fieldType: "SP.FieldText" },
          { key: "offer_x0020_start_x0020_date", fieldType: "SP.FieldText" },
          { key: "Modified", fieldType: "SP.FieldText" },
          { key: "Created", fieldType: "SP.FieldText" },
          { key: "OfferURL", fieldType: "SP.FieldText" },
          { key: "L1Category/Categories", fieldType: "SP.FieldText" },
          { key: "L1Category/Arabic", fieldType: "SP.FieldText" },
          { key: "L2Categories/subCategories", fieldType: "SP.FieldText" },
          { key: "L2Categories/Arabic", fieldType: "SP.FieldText" },
          { key: "L3Categories/subSubCategories", fieldType: "SP.FieldText" },
          { key: "L3Categories/Arabic", fieldType: "SP.FieldText" },
          { key: "vendorEmailChecked", fieldType: "SP.FieldText" },
          { key: "EndUserEmailChecked", fieldType: "SP.FieldText" },
          

        ];
        const offer: any = await this._services.getListItemByIdOtherWeb(
          web,
          LISTS.PRIVILAGE_OFFERS,
          selectedFields,
          itemId
        );
        return offer;
      };

    //   public getBranchesbyID = async (id) => {
    //     const filter = `vendor/ID eq '${id}'`
    //     const fields = [{ key: "branchName", fieldType: "SP.FieldText" }, { key: "vendor", fieldType: "SP.FieldLookupCustom" },{key:"Latitude",fieldType: "SP.FieldText" },{key:"Longitude",fieldType: "SP.FieldText" }]
    //     const Vendors = await this._services.getListItemsCustomLookupNew(LISTS.PRIVILAGE_BRANCH, fields, filter, "Created", 4999, true, false, ['Vendor_x002f_Branch_x0020_Name'])
    //     console.log("Vendors", Vendors);
    //     return Vendors;
    // }
    public getvendorItem= async (web: IWeb, itemId: number) =>{
        const selectedFields =[
            { key: "Id", fieldType: "SP.FieldNumber" },
            { key: "Vendor_x002f_Branch_x0020_Name", fieldType: "SP.FieldText" },
            { key: "Group", fieldType: "SP.FieldLookup" },
            { key: "Status", fieldType: "SP.FieldText" },
            { key: "Group/groupName", fieldType: "SP.FieldText" },
            { key: "Attachments", fieldType: "SP.FieldAttachment" },
            { key: "latitude", fieldType: "SP.FieldText" },
            { key: "longitude", fieldType: "SP.FieldText" },
            { key: "Address", fieldType: "SP.FieldText" },
            { key: "VendorContactEmail", fieldType: "SP.FieldText" },
            { key: "VendrOfficeTel", fieldType: "SP.FieldText" },
        ];
        const vendor: any = await this._services.getListItemByIdOtherWeb(
          web,
          LISTS.PRIVILAGE_VENDORS,
          selectedFields,
          itemId
        );
        return vendor;
    }
    public async checkL1Access(email){
        const selectedFields=[
            { key: "Title", fieldType: "SP.FieldText" },
            { key: "Value", fieldType: "SP.FieldText" },
            { key: "Key", fieldType: "SP.FieldText" },
        ]
        const filter = `Title eq 'L1APPROVER'`;

        const accessData=await this._services.getListItems(LISTS.PRIVILAGE_CONFIG,selectedFields,filter)
        console.log(accessData)
        return(accessData[0].Value===email?true:false);

    }
    public async checkL2Access(email){
        const selectedFields=[
            { key: "Title", fieldType: "SP.FieldText" },
            { key: "Value", fieldType: "SP.FieldText" },
            { key: "Key", fieldType: "SP.FieldText" },
        ]
        const filter = `Title eq 'L2APPROVER'`;
        const accessData=await this._services.getListItems(LISTS.PRIVILAGE_CONFIG,selectedFields,filter)
        console.log(accessData)
        return(accessData[0].Value===email?true:false);
        
    }
    public async updateStatusbyId(passdata,id){
        
        await this._services.UpdateItem(LISTS.PRIVILAGE_OFFERS,passdata,id)
    }
    public async updateVendorStatusbyId(passdata,id){
        
        await this._services.UpdateItem(LISTS.PRIVILAGE_VENDORS,passdata,id)
    }

    public async AddNotification(data){
        await this._services.CreateItem(LISTS.PRIVILAGE_NOTIFICATION,data)
    }
}


