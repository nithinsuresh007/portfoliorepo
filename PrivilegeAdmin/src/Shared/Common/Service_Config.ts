export interface IFieldType {
  label: string;
  required: boolean;
  fieldType: string;
  disabled?: boolean;
  mandatoryDependancyValue?: string;
  arabic?: boolean;
}
export interface IFieldObject {
  [key: string]: IFieldType;
}

export const LISTS: any = {
      PRIVILAGE_OFFERS:"Offers",
      PRIVILAGE_OFFERTYPE:"offerTypes",
      PRIVILAGE_GROUPS:"groupMaster",
      PRIVILAGE_VENDORS:"vendor Master",
      PRIVILAGE_BRANCH:"branchMaster",
      PRIVILAGE_CATEGORIES:"Categories",
      PRIVILAGE_SUB_CATEGORIES:"SubCategories",
      PRIVILAGE_SUB_SUB_CATEGORIES:"sub-subCategories",
      PRIVILAGE_COUNTRIES:"Country",
      PRIVILAGE_CONFIG:"Privilege Config",
      PRIVILAGE_NOTIFICATION:"Privilege_Notification"
};

export const PAGES:any={
   CATEGORIES:"Categoriesv2",
   APPROVALS:"Approvalsv2",
   OFFERTYPES:"OfferTypesv2",
   SURVEYLIST:"SurveyList",
   BANNER:"BannerModal",
   OFFERSUMMARY:"OfferSummary",
   SUPPLIERREQUEST:"SuppierRequest",
   OFFERRATING:"OfferRatingv2"
}

export const GROUPS: any = {
  PORTAL_COMMUNICATIONS: "communications",
  PORTAL_PP_ADMIN_TEAM:"PP Admin Team",
  PORTAL_PP_TEAM:"PP Team"
};
export const DRP_OPTIONS: any = {
  GENDER_OPTIONS: [
    { key: "Select", text: "Select" },
    { key: "Male", text: "Male" },
    { key: "Female", text: "Female" },
  ],
  YESNO_OPTIONS: [
    { key: "Select", text: "Select" },
    { key: "Yes", text: "Yes" },
    { key: "No", text: "No" },
  ],
};
// export const APIs: any = {
//   EVENTS_API_URL_HOMEPAGE:
//     "https://cdn.contentful.com/spaces/2h1qowfuxkq7/entries?access_token=58c4afc16acba8b5b5a1f79a13f22cb0e140a4e3a5ab3355da49ff6bfd9a7978&content_type=event&order=fields.startDate&fields.startDate[gte]=##todaysdate##&limit=3&skip=0",
// };
