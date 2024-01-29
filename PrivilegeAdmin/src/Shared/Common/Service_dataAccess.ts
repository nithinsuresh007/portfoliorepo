//import { IDropdownOption } from "@microsoft/sp-component-base/node_modules/@fluentui/react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  IAttachmentInfo,
  IItem,
  IItemAddResult,
  IWeb,
  sp,
  Web,
} from "@pnp/sp/presets/all";
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { dateAdd } from "@pnp/core";
export class SPService {
  constructor(private context: WebPartContext) {
    sp.setup({
      spfxContext: context as any,
    });
  }

  public async checkService(): Promise<any> {
    return this.context.pageContext.user.displayName;
  }

  //Crud operations

  public async getListItemsCAML(selectedList: string, camlQuery: string) {
    let filItems = await sp.web.lists
      .getByTitle(selectedList)
      .getItemsByCAMLQuery({
        ViewXml: camlQuery,
      });
    return filItems;
  }

  public async getListItemsCAMLStream(
    web,
    selectedList: string,
    camlQuery: string,
    pagingString?: string
  ) {
    let filItems: any;
    pagingString
      ? (filItems = await web.lists
        .getByTitle(selectedList)
        .renderListDataAsStream({
          ViewXml: camlQuery,
          Paging: pagingString,
        }))
      : (filItems = await web.lists
        .getByTitle(selectedList)
        .renderListDataAsStream({
          ViewXml: camlQuery,
        }));
    return filItems;
  }

  public async getListItemById(
    selectedList: string,
    selectedFields: any[],
    itemId: number
  ) {
    //try {
    let selectQuery: any[] = ["Id"];
    let expandQuery: any[] = [];
    let listItem: any;
    for (let i = 0; i < selectedFields.length; i++) {
      switch (selectedFields[i].fieldType) {
        case "SP.FieldUser":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/EMail,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldUserNoEmail":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldAttachment":
          selectQuery.push("Attachments,AttachmentFiles");
          expandQuery.push("AttachmentFiles");
          break;
        case "SP.FieldLookup":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldValueAsText":
          selectQuery.push(`FieldValuesAsText/${selectedFields[i].key}`);
          expandQuery.push("FieldValuesAsText");
          break;
        case "SP.FieldLookupNoTitle":
          selectQuery.push(
            `${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        default:
          selectQuery.push(selectedFields[i].key);
          break;
      }
    }
    listItem = await sp.web.lists
      .getByTitle(selectedList)
      .items.getById(itemId)
      .select(selectQuery.join())
      .expand(expandQuery.join())
      .get();

    return listItem;
    /*} catch (err) {
            console.log(err);
            Promise.reject(err);
        }*/
  }

  public async getListItemByIdbyWeb(
    selectedList: string,
    selectedFields: any[],
    itemId: number
  ) {
    //try {
    let selectQuery: any[] = ["Id"];
    let expandQuery: any[] = [];
    let listItem: any;
    const web = Web(this.context.pageContext.site.absoluteUrl);
    for (let i = 0; i < selectedFields.length; i++) {
      switch (selectedFields[i].fieldType) {
        case "SP.FieldUser":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/EMail,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldUserNoEmail":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldAttachment":
          selectQuery.push("Attachments,AttachmentFiles");
          expandQuery.push("AttachmentFiles");
          break;
        case "SP.FieldLookup":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldValueAsText":
          selectQuery.push(`FieldValuesAsText/${selectedFields[i].key}`);
          expandQuery.push("FieldValuesAsText");
          break;
        case "SP.FieldLookupNoTitle":
          selectQuery.push(
            `${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        default:
          selectQuery.push(selectedFields[i].key);
          break;
      }
    }
    listItem = await web.lists
      .getByTitle(selectedList)
      .items.getById(itemId)
      .select(selectQuery.join())
      .expand(expandQuery.join())
      .get();

    return listItem;
    /*} catch (err) {
            console.log(err);
            Promise.reject(err);
        }*/
  }

  public async getAttachments(selectedList: string, itemId: number) {
    const item: IItem = await sp.web.lists
      .getByTitle(selectedList)
      .items.getById(itemId);
    let tmpFiles: any = [];
    // get all attachments
    const attachments: IAttachmentInfo[] = await item.attachmentFiles();
    attachments.map((file) => {
      tmpFiles.push(`${file.FileName};${file.ServerRelativeUrl}`);
    });
    return tmpFiles;
  }

  public async getFolderItems(
    listName: string,
    listUri: string,
    folderName: string
  ) {
    const items = await sp.web
      .getFolderByServerRelativeUrl(`${listUri}/${folderName}`)
      .files.get();
    /* .filter(`FileDirRef eq '${listUri}/${folderName}'`)
    .select("FileLeafRef","FileRef","File","Title","Id").expand("File")
    .get();*/

    return items;
  }

  public async getListItems(
    selectedList: string,
    selectedFields: any[],
    filter?: string,
    sortField: string = "Created",
    topValue: number = 4999,
    order: boolean = true,
    useCache: boolean = false
  ) {
    //try {
    let selectQuery: any[] = ["Id"];
    let expandQuery: any[] = [];
    let listItems: any[] = [];
    let items: any;

    for (let i = 0; i < selectedFields.length; i++) {
      switch (selectedFields[i].fieldType) {
        case "SP.FieldUser":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/EMail,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldUserNoEmail":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookup":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookupNoTitle":
          selectQuery.push(
            `${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldAttachment":
          selectQuery.push("Attachments,AttachmentFiles");
          expandQuery.push("AttachmentFiles");
          break;
        case "SP.FieldValueAsText":
          selectQuery.push(`FieldValuesAsText/${selectedFields[i].key}`);
          expandQuery.push("FieldValuesAsText");
          break;
        // case 'SP.Field':
        //     selectQuery.push('Attachments,AttachmentFiles');
        //     expandQuery.push('AttachmentFiles');
        //     break;
        default:
          selectQuery.push(selectedFields[i].key);
          break;
      }
    }
    if (filter) {
      if (useCache) {
        items = await sp.web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .filter(filter)
          .orderBy(sortField, order)
          .top(topValue).usingCaching({
            expiration: dateAdd(new Date(), "minute", 60),
            key: selectedList,
            storeName: "local"
          })
          .getPaged();
      }
      else {
        items = await sp.web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .filter(filter)
          .orderBy(sortField, order)
          .top(topValue)
          .getPaged();
      }
    } else {
      if (useCache) {
        items = await sp.web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .orderBy(sortField, order)
          .top(topValue).usingCaching({
            expiration: dateAdd(new Date(), "minute", 60),
            key: selectedList,
            storeName: "local"
          })
          .getPaged();
      }
      else {
        items = await sp.web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .orderBy(sortField, order)
          .top(topValue)
          .getPaged();
      }
    }

    listItems = items.results;
    /*while (items.hasNext) {
      items = await items.getNext();
      listItems = [...listItems, ...items.results];
    }*/
    return listItems;
    /*} catch (err) {
            console.log(err);
            Promise.reject(err);
        }*/
  }

  public async getListItemsbyWeb(
    selectedList: string,
    selectedFields: any[],
    filter?: string,
    sortField: string = "Created",
    topValue: number = 4999,
    order: boolean = true,
    useCache: boolean = false
  ) {
    //try {
    let selectQuery: any[] = ["Id"];
    let expandQuery: any[] = [];
    let listItems: any[] = [];
    let items: any;
    const web = Web(this.context.pageContext.site.absoluteUrl);
    for (let i = 0; i < selectedFields.length; i++) {
      switch (selectedFields[i].fieldType) {
        case "SP.FieldUser":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/EMail,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldUserNoEmail":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookup":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookupCustom":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/DirectorateName_Ar,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookupCustom2":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Title_Ar,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldAttachment":
          selectQuery.push("Attachments,AttachmentFiles");
          expandQuery.push("AttachmentFiles");
          break;
        case "SP.FieldValueAsText":
          selectQuery.push(`FieldValuesAsText/${selectedFields[i].key}`);
          expandQuery.push("FieldValuesAsText");
          break;
        // case 'SP.Field':
        //     selectQuery.push('Attachments,AttachmentFiles');
        //     expandQuery.push('AttachmentFiles');
        //     break;
        default:
          selectQuery.push(selectedFields[i].key);
          break;
      }
    }
    if (filter) {
      if (useCache) {
        items = await web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .filter(filter)
          .orderBy(sortField, order)
          .top(topValue).usingCaching({
            expiration: dateAdd(new Date(), "minute", 60),
            key: selectedList,
            storeName: "local"
          })
          .getPaged();
      }
      else {
        items = await web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .filter(filter)
          .orderBy(sortField, order)
          .top(topValue)
          .getPaged();
      }
    } else {
      if (useCache) {
        items = await web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .orderBy(sortField, order)
          .top(topValue).usingCaching({
            expiration: dateAdd(new Date(), "minute", 60),
            key: selectedList,
            storeName: "local"
          })
          .getPaged();
      }
      else {
        items = await web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .orderBy(sortField, order)
          .top(topValue)
          .getPaged();
      }
    }

    listItems = items.results;
    /*while (items.hasNext) {
      items = await items.getNext();
      listItems = [...listItems, ...items.results];
    }*/
    return listItems;
    /*} catch (err) {
            console.log(err);
            Promise.reject(err);
        }*/
  }


  public async CreateItem(listName: string, data: any) {
    const listItem: IItemAddResult = await sp.web.lists
      .getByTitle(listName)
      .items.add(data);
    return listItem;
  }
  public async UpdateItem(listName: string, data: any, itemId: number) {
    const listItem: IItemAddResult = await sp.web.lists
      .getByTitle(listName)
      .items.getById(itemId)
      .update(data);
    return listItem;
  }
  public async DeleteItem(listName: string, data: any, itemId: number) {
    await sp.web.lists.getByTitle(listName).items.getById(itemId).recycle();
  }

  public async CreateItemByWeb(listName: string, data: any) {
    const web = Web(this.context.pageContext.site.absoluteUrl);
    const listItem: IItemAddResult = await web.lists
      .getByTitle(listName)
      .items.add(data);
    return listItem;
  }
  public async UpdateItemByWeb(listName: string, data: any, itemId: number) {
    const web = Web(this.context.pageContext.site.absoluteUrl);
    const listItem: IItemAddResult = await web.lists
      .getByTitle(listName)
      .items.getById(itemId)
      .update(data);
    return listItem;
  }
  public async DeleteItemByWeb(listName: string, data: any, itemId: number) {
    const web = Web(this.context.pageContext.site.absoluteUrl);
    await web.lists.getByTitle(listName).items.getById(itemId).recycle();
  }

  //User groups operations
  public async isMemberOf(groupName: string) {
    let isMember = false;
    let groups = await sp.web.currentUser.groups();
    groups.forEach((group, index) => {
      if (group.Title.toLowerCase() === groupName.toLowerCase()) {
        isMember = true;
      }
    });

    if (this.context.pageContext.legacyPageContext.isSiteAdmin) {
      isMember = true;
    }
    return isMember;
  }

  public getAllUsers = async () => {
    const users = await sp.web.siteUsers();
    let userInformation: any = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].Title.length > 0 && users[i].LoginName.length > 0) {
        if (users[i].LoginName.indexOf("i:0#") >= 0) {
          let tempUserInfo: any = { Id: users[i].Id, Title: users[i].Title };
          userInformation.push(tempUserInfo);
        }
      }
    }
    return userInformation;
  };

  public getFieldChoices = async (listName: string, fieldName: string) => {
    let keyValues: any = [];
    const items: any = await sp.web.lists
      .getByTitle(listName)
      .fields.getByInternalNameOrTitle(fieldName)
      .select("Choices,ID")
      .get();
    items.Choices.map((item: any) => {
      keyValues.push({
        key: item,
        text: item,
      });
    });
    return keyValues;
  };

  public async getAllListItemsbyOtherWeb(
    web: IWeb,
    selectedList: string,
    selectedFields: any[],
    filter?: string,
    sortField: string = "Created",
    topValue: number = 4999,
    order: boolean = true,
    useCache: boolean = false
  ) {
    //try {
    let selectQuery: any[] = ["Id"];
    let expandQuery: any[] = [];
    let listItems: any[] = [];
    let items: any;
    for (let i = 0; i < selectedFields.length; i++) {
      switch (selectedFields[i].fieldType) {
        case "SP.FieldUser":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/EMail,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldUserNoEmail":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookup":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookupCustom":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/DirectorateName_Ar,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldAttachment":
          selectQuery.push("Attachments,AttachmentFiles");
          expandQuery.push("AttachmentFiles");
          break;
        case "SP.FieldValueAsText":
          selectQuery.push(`FieldValuesAsText/${selectedFields[i].key}`);
          expandQuery.push("FieldValuesAsText");
          break;
        default:
          selectQuery.push(selectedFields[i].key);
          break;
      }
    }
    if (filter) {
      if (useCache) {
        items = await web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .filter(filter)
          .orderBy(sortField, order)
          .top(topValue).usingCaching({
            expiration: dateAdd(new Date(), "minute", 60),
            key: selectedList,
            storeName: "local"
          })
          .getPaged();
      }
      else {
        items = await web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .filter(filter)
          .orderBy(sortField, order)
          .top(topValue)
          .getPaged();
      }
    } else {
      if (useCache) {
        items = await web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .orderBy(sortField, order)
          .top(topValue).usingCaching({
            expiration: dateAdd(new Date(), "minute", 60),
            key: selectedList,
            storeName: "local"
          })
          .getPaged();
      }
      else {
        items = await web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .orderBy(sortField, order)
          .top(topValue)
          .getPaged();
      }
    }

    /*listItems = items.results;
    while (items.hasNext) {
      items = await items.getNext();
      listItems = [...listItems, ...items.results];
    }*/
    return listItems;
    /*} catch (err) {
            console.log(err);
            Promise.reject(err);
        }*/
  }

  public async getListItemByOtherWeb(
    web: IWeb,
    selectedList: string,
    selectedFields: any[],
    filter?: string,
    sortField: string = "Created",
    topValue: number = 4999,
    order: boolean = true
  ) {
    //try {
    let selectQuery: any[] = ["Id"];
    let expandQuery: any[] = [];
    let listItems: any[] = [];
    let items: any;
    for (let i = 0; i < selectedFields.length; i++) {
      switch (selectedFields[i].fieldType) {
        case "SP.FieldUser":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/EMail,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldUserNoEmail":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookup":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookupCustom":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/DirectorateName_Ar,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldAttachment":
          selectQuery.push("Attachments,AttachmentFiles");
          expandQuery.push("AttachmentFiles");
          break;
        case "SP.FieldValueAsText":
          selectQuery.push(`FieldValuesAsText/${selectedFields[i].key}`);
          expandQuery.push("FieldValuesAsText");
          break;
        // case 'SP.Field':
        //     selectQuery.push('Attachments,AttachmentFiles');
        //     expandQuery.push('AttachmentFiles');
        //     break;
        default:
          selectQuery.push(selectedFields[i].key);
          break;
      }
    }
    if (filter) {
      items = await web.lists
        .getByTitle(selectedList)
        .items.select(selectQuery.join())
        .expand(expandQuery.join())
        .filter(filter)
        .orderBy(sortField, order)
        .top(topValue)
        .getPaged();
    } else {
      items = await web.lists
        .getByTitle(selectedList)
        .items.select(selectQuery.join())
        .expand(expandQuery.join())
        .orderBy(sortField, order)
        .top(topValue)
        .getPaged();
    }

    listItems = items.results;
    /*while (items.hasNext) {
      items = await items.getNext();
      listItems = [...listItems, ...items.results];
    }*/
    return listItems;
    /*} catch (err) {
            console.log(err);
            Promise.reject(err);
        }*/
  }
  //N
  public async getListitemsusingRestAPI(url: string) {

    // const listTitle = 'YourListTitle';

    const dataloaded = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('List Items:', data.d.results);
        return data.d.results

      })
      .catch(error => {
        console.error('Error:', error);
      });

    return dataloaded;
  }

  // public async renderListDataAsStream(url: string) {
  //   const restAPI = `${url}/_api/web/Lists(guid'a2e88671-9787-4f40-bca3-b65f97d7de96')/RenderListDataAsStream`;
  //  const data= await this.context.spHttpClient.post(restAPI, SPHttpClient.configurations.v1, {
  //     body: JSON.stringify({
  //       parameters: {
  //         RenderOptions: 2,
  //         ViewXml: `<View>
  //                 <ViewFields><FieldRef Name='ID'/><FieldRef Name='Title'/><FieldRef Name='Full_Name'/><FieldRef Name='Position'/><FieldRef Name='Mobile'/><FieldRef Name='Work_Telephone'/><FieldRef Name='EmailID'/></ViewFields>
  //                 <Query>
  //                   <Where>
  //                     <Eq>
  //                     <FieldRef Name="Active" /> 
  //                     <Value Type="Text">Employee</Value> 
  //                     </Eq>
  //                   </Where>
  //                 </Query>
  //                 <RowLimit Paged="TRUE">5000</RowLimit>
  //               </View>`
  //       }
  //     })
  //   });
  //   const dataJson = await data.json();
  //   return dataJson.Row;

  // }
  //N
  public async getListItemsCustomLookupNew(
    selectedList: string,
    selectedFields: any[],
    filter?: string,
    sortField: string = "Created",
    topValue: number = 4999,
    order: boolean = true,
    useCache: boolean = false,
    customSelectQuery = []
  ) {
    //try {
    let selectQuery: any[] = ["Id"];
    let expandQuery: any[] = [];
    let listItems: any[] = [];
    let items: any;
    let fieldToExpand;
    let selectQueryCustomPush

    for (let i = 0; i < selectedFields.length; i++) {
      switch (selectedFields[i].fieldType) {
        case "SP.FieldUser":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/EMail,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldUserNoEmail":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookup":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookupCustom":

          fieldToExpand = selectedFields[i].key
          selectQueryCustomPush = customSelectQuery.map((item) => {
            fieldToExpand + '/' + item
          }).join(', ')
          console.log("customselectquery", selectQueryCustomPush)
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Id`
          );
          // selectQuery.push(selectQueryCustomPush);
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldAttachment":
          selectQuery.push("Attachments,AttachmentFiles");
          expandQuery.push("AttachmentFiles");
          break;
        case "SP.FieldValueAsText":
          selectQuery.push(`FieldValuesAsText/${selectedFields[i].key}`);
          expandQuery.push("FieldValuesAsText");
          break;
        // case 'SP.Field':
        //     selectQuery.push('Attachments,AttachmentFiles');
        //     expandQuery.push('AttachmentFiles');
        //     break;
        default:
          selectQuery.push(selectedFields[i].key);
          break;
      }
    }
    if (filter) {
      if (useCache) {
        items = await sp.web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .filter(filter)
          .orderBy(sortField, order)
          .top(topValue).usingCaching({
            expiration: dateAdd(new Date(), "minute", 60),
            key: selectedList,
            storeName: "local"
          })
          .getPaged();
      }
      else {
        items = await sp.web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .filter(filter)
          .orderBy(sortField, order)
          .top(topValue)
          .getPaged();
      }
    } else {
      if (useCache) {
        items = await sp.web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .orderBy(sortField, order)
          .top(topValue).usingCaching({
            expiration: dateAdd(new Date(), "minute", 60),
            key: selectedList,
            storeName: "local"
          })
          .getPaged();
      }
      else {
        items = await sp.web.lists
          .getByTitle(selectedList)
          .items.select(selectQuery.join())
          .expand(expandQuery.join())
          .orderBy(sortField, order)
          .top(topValue)
          .getPaged();
      }
    }

    listItems = items.results;
    console.log(listItems)
    /*while (items.hasNext) {
      items = await items.getNext();
      listItems = [...listItems, ...items.results];
    }*/
    return listItems;

    /*} catch (err) {
            console.log(err);
            Promise.reject(err);
        }*/
  }

  public async getListItemByIdOtherWeb(
    web: IWeb,
    selectedList: string,
    selectedFields: any[],
    itemId: number
  ) {
    //try {
    let selectQuery: any[] = ["Id"];
    let expandQuery: any[] = [];
    let listItem: any;
    for (let i = 0; i < selectedFields.length; i++) {
      switch (selectedFields[i].fieldType) {
        case "SP.FieldUser":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/EMail,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldUserNoEmail":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Name,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldAttachment":
          selectQuery.push("Attachments,AttachmentFiles");
          expandQuery.push("AttachmentFiles");
          break;
        case "SP.FieldLookup":
          selectQuery.push(
            `${selectedFields[i].key}/Title,${selectedFields[i].key}/Id`
          );
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldLookupNoTitle":
          selectQuery.push(`${selectedFields[i].key}/Id`);
          expandQuery.push(selectedFields[i].key);
          break;
        case "SP.FieldValueAsText":
          selectQuery.push(`FieldValuesAsText/${selectedFields[i].key}`);
          expandQuery.push("FieldValuesAsText");
          break;
        default:
          selectQuery.push(selectedFields[i].key);
          break;
      }
    }
    listItem = await web.lists
      .getByTitle(selectedList)
      .items.getById(itemId)
      .select(selectQuery.join())
      .expand(expandQuery.join())
      .get();

    return listItem;
    /*} catch (err) {
            console.log(err);
            Promise.reject(err);
        }*/
  }
}
