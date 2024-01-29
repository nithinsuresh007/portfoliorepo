
import { ComboBox, IComboBoxOption } from "@fluentui/react/lib/ComboBox";
import * as React from "react";

import { DatePicker, DayOfWeek, Dropdown } from '@fluentui/react';

import moment from "moment";

import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

export interface NewOfferListProps {
    siteurl: string,
    serviceObject: any,
    closeButtonNewOffer:any,
}
const modules = {
    toolbar: [
        [{
            'header': [1, 2, 3, false]
        }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{
            'color': []
        }, {
            'background': []
        }],
        [{
            'list': 'ordered'
        }, {
            'list': 'bullet'
        }, {
            'indent': '-1'
        }, {
            'indent': '+1'
        }],
        ['link', 'image', 'video'],
        ['clean']
    ],
};
const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video', 'background', 'color'];
export interface INewOfferListState {
    OfferTypeSelected: any,
    AllOfferTypes: any,

    OfferTitle: any,

    AllGroups: any,
    GroupSelected: any,

    AllVendors: any,
    VendorSelected: any,

    addAllBranchesCheck: boolean,
    allBranches: any,
    branchesSelected: any,

    startDate: any,
    endDate: any,

    mainCategories: any,
    selectedMainCategory: any,

    subCategories: any,
    selectedsubCategory: any,

    subsubCategories: any,
    selectedsubsubCategory: any,

    offerURl: any,
    moreInformation: any,

    documents: any,
    showDocumentInvalid: boolean,
    attachmenttoComboBox: any,
    attachmentSelected: any,



    submitclicked: boolean,
    documentstoShow:any,
}


export default class NewOfferList extends React.Component<
    NewOfferListProps,
    INewOfferListState>
{
    constructor(props: NewOfferListProps, state: INewOfferListState) {
        super(props);
        this.state = {
            OfferTypeSelected: "",
            AllOfferTypes: [{ key: 'value0', text: '       ' }],

            OfferTitle: "",

            AllGroups: [{ key: 'value0', text: '       ' }],
            GroupSelected: "",

            AllVendors: [{ key: 'value0', text: '       ' }],
            VendorSelected: "",

            addAllBranchesCheck: false,
            allBranches: [{ key: 'value0', text: '       ' }],
            branchesSelected: [],

            startDate: "",
            endDate: "",

            mainCategories: [],
            selectedMainCategory: "",

            subCategories: [],
            selectedsubCategory: "",

            subsubCategories: [],
            selectedsubsubCategory: "",

            moreInformation: "",
            offerURl: "",

            documents: [],
            showDocumentInvalid: false,
            attachmenttoComboBox: [],
            attachmentSelected: [],


            submitclicked: false,
            documentstoShow:[]
        }
    }

    // private async HandleGroupChange(event: React.FormEvent<IComboBoxOption>, option?: IComboBoxOption) {
    //     console.log("Hello")
    //     await this.MapVendorsToGroups(option.text);
    //     this.setState({ GroupSelected: option });
    //     console.log("Group Selected")
    // }



    private async MapVendorsToGroups(group: string) {



        console.log(this.state.GroupSelected);

        const Vendors = await this.props.serviceObject.getVendors(group);
        const VendorsToComboBox = await this.props.serviceObject.ToComboBox(Vendors, "Vendor_x002f_Branch_x0020_Name");

        this.setState({ AllVendors: VendorsToComboBox });
    }
    public mapBranchesToVendors = async (vendor: any) => {
        const Branches = await this.props.serviceObject.getBranches(vendor);
        const BranchesToComboBox = await this.props.serviceObject.ToComboBox(Branches, "branchName");

        this.setState({ allBranches: BranchesToComboBox });

    }
    async componentDidMount() {
        const Offertypes = await this.props.serviceObject.getOfferTypes();
        const Groups = await this.props.serviceObject.getGroups();
        const Cateogries = await this.props.serviceObject.getCategories();



        const OfferTypesToComboBox = await this.props.serviceObject.ToComboBox(Offertypes, "OfferTypes");
        const CategoriestoComboBox = await this.props.serviceObject.ToComboBox(Cateogries, "Categories");
        const GroupsToComboBox = await this.props.serviceObject.ToComboBox(Groups, "groupName");

        this.setState({ AllOfferTypes: OfferTypesToComboBox });
        this.setState({ AllGroups: GroupsToComboBox });
        this.setState({ mainCategories: CategoriestoComboBox });

    }

    public changeCheckBox = async () => {
        const checkstate: boolean = !this.state.addAllBranchesCheck
        this.setState({ addAllBranchesCheck: checkstate })
        console.log(checkstate);
        if (checkstate) {
            const newBranches = []
            this.state.allBranches.map((item: { key: any; text: any; }, index: any) => {
                newBranches.push({ key: item.key, text: item.text, selected: true })
            })
            this.setState({ branchesSelected: newBranches })
            console.log(newBranches)
        }
        else {
            this.setState({ branchesSelected: [] })
        }
    }

    public setSubCategories = async (selectedMainCategory: string) => {
        console.log(this.state.GroupSelected);

        const Categories = await this.props.serviceObject.getSubCategories(selectedMainCategory);
        const CategoriesToComboBox = await this.props.serviceObject.ToComboBox(Categories, "subCategories");

        this.setState({ subCategories: CategoriesToComboBox });
    }

    public setSubSubCategories = async (selectedSubCategory: string) => {
        console.log(this.state.GroupSelected);

        const Categories = await this.props.serviceObject.getSubSubCategories(selectedSubCategory);
        const CategoriesToComboBox = await this.props.serviceObject.ToComboBox(Categories, "subSubCategories");

        this.setState({ subsubCategories: CategoriesToComboBox });
    }

    private UploadDocuments = async () => {
        const files: any = (document.querySelector("#rDocs") as HTMLInputElement)
            .files;
        let showDocumentInvalid = false;
        let documents = this.state.documents;
        const documentstoShow = this.state.documentstoShow;
        const allowedTypes: any = [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/gif",
            "text/calendar",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "image/svg+xml",
            "text/plain",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
        ];
        for (let i = 0; i < files.length; i++) {
            if (!allowedTypes.includes(files[i].type)) {
                (document.getElementById("tImage") as HTMLInputElement).value = "";
                documents = []; //issue fix later>>
                showDocumentInvalid = true;
                break;
            } else {
                documents.push(files[i]);
                documentstoShow.push({FileName:files[i].name})
            }
        }
        this.setState({ documents, showDocumentInvalid ,documentstoShow});
        const AttachmentToComboBox = await this.props.serviceObject.attachMentRenderingtoComboBox(documents);
        this.setState({ attachmenttoComboBox: AttachmentToComboBox }, () => console.log(this.state.attachmenttoComboBox));

        console.log(documents); //n
    };

    private saveOfferReport = async () => {
        const branchesSelected = []
        await this.state.branchesSelected.map((item: { key: any; }) => {
            branchesSelected.push(item.key)
        })

        const PortalFiles=await this.state.attachmentSelected.map((item: { text: any; })=>item.text).join(' ,')

        
        const item = {
            Offer_x0020_Title: this.state.OfferTypeSelected.text,
            Rating: 0,
            Status: "Submitted",
            offer_x0020_end_x0020_date: `${moment(this.state.endDate).format('YYYY-MM-DD')}T00:00:00Z`,
            offer_x0020_start_x0020_date: `${moment(this.state.startDate).format('YYYY-MM-DD')}T00:00:00Z`,
            GroupId: this.state.GroupSelected.key,
            L1CategoryId: this.state.selectedMainCategory.key,
            L2CategoriesId: this.state.selectedsubCategory.key,
            L3CategoriesId: this.state.selectedsubsubCategory.key,
            VendorId: this.state.VendorSelected.key,
            OfferURL: this.state.offerURl,
            offer0: this.state.OfferTitle,
            PortalAttachments:PortalFiles,
            BranchesId: {
                results: branchesSelected
            },

            


        }
        if(branchesSelected.length===0){
            window.alert("Kindly Add branches.");
            this.setState({ submitclicked: true });
            
        }
        else{
            if (this.state.OfferTypeSelected !== "" && this.state.OfferTitle !== "" && this.state.GroupSelected !== "" && this.state.VendorSelected !== "" && this.state.branchesSelected.length !== 0 && this.state.startDate !== "" && this.state.endDate !== "" && this.state.selectedMainCategory !== "" && this.state.selectedsubCategory !== "") {
                const chkdup:boolean=await this.props.serviceObject.checkDuplicte(this.state.OfferTitle,this.state.GroupSelected.key,this.state.VendorSelected.key)
                if(!chkdup){
                    const itemAdded=await this.props.serviceObject.saveOfferReport(item);
                    console.log(itemAdded)
                    const offerID=itemAdded.data.ID
                    const offerIDAdded= await this.props.serviceObject.saveOfferReportbyId({
                        OfferItemID:`${offerID}`,
                        Offer:this.state.moreInformation
                    },offerID)
                    console.log(offerIDAdded)
                    
                    // const documentAdded= await this.state.documents.map(async (attachment,index)=>{
                    //     await offerIDAdded.item.attachmentFiles.add(
                    //         attachment.name,
                    //         attachment
                    //       );
                    // })

                    for (const item of this.state.documents) {
                        await offerIDAdded.item.attachmentFiles.add(
                            item.name,
                            item
                          );
                    }
                    
                    
                    
                    
                    
                   
                    this.setState({ submitclicked: false });
                    window.location.reload()
                }
                else{
                    window.alert("Duplicate Item, Kindly change Offer Name, Vendor  or Group")
                    this.setState({ submitclicked: true });
                }
               
            }
            else {
                this.setState({ submitclicked: true });
            }
        }
        //validation
        



    }







    public render(): React.ReactElement<NewOfferListProps> {
        return (
            <>
                <div className="row">
                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="OfferTypes">Offer Type</label>
                        <ComboBox 
                            className="form-control p-0"
                            placeholder="Please Select Offer Type"
                            options={this.state.AllOfferTypes}
                            
                            id="OfferTypes"
                            selectedKey={this.state.OfferTypeSelected?.key}
                            onChange={(event, value) => this.setState({ OfferTypeSelected: value })}

                        />

                        {
                            this.state.OfferTypeSelected === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="OfferTitle">Offer Title</label>
                        <input className="form-control" type="text" placeholder="Enter Offer Title" name="OfferTitle" id="OfferTitle" value={this.state.OfferTitle} onChange={(e) => { this.setState({ OfferTitle: e.target.value }) }} />

                        {
                            this.state.OfferTitle === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="Groups">Group</label>
                        <ComboBox
                            allowFreeform
                            className="form-control p-0"
                            
                            placeholder="Please Select Groups"
                            options={this.state.AllGroups}
                            id="Groups"
                            selectedKey={this.state.GroupSelected?.key}
                            onChange={(event, value?) => this.setState({ GroupSelected: value }, () => this.MapVendorsToGroups(value.text))}
                            
                        />

                        {
                            this.state.GroupSelected === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>

                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="Groups">Vendor</label>
                        <ComboBox
                            disabled={(this.state.GroupSelected==="")?true:false}
                            className="form-control p-0"
                            placeholder="Please Select Groups"
                            options={this.state.AllVendors}
                            id="Groups"
                            selectedKey={this.state.VendorSelected?.key}
                            onChange={(event, value) => this.setState({ VendorSelected: value }, () => this.mapBranchesToVendors(value.text))}

                        />

                        {
                            this.state.VendorSelected === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>

                {
                    (this.state.VendorSelected === "") ? null :
                        
                            
                                
                                
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={this.state.addAllBranchesCheck} onChange={this.changeCheckBox} id="myCheckbox" name="myCheckbox" />
                                        <label className="form-check-label" htmlFor="myCheckbox">Add All Branches</label>
                                    </div>
                                
                            
                                
                            
                        
                }

                <div className="row">
                    <div className="form-group col-sm-12">
                        <label className="mandatory-label" htmlFor="Branch">Branches</label>
                        <ComboBox
                            disabled={(this.state.VendorSelected==="")?true:false}
                            placeholder="Please Select Branches"
                            className="form-control p-0"
                            options={this.state.allBranches}
                            selectedKey={this.state.branchesSelected.map((item: { key: any; }) => item.key)}
                            id="Branch"
                            

                            onChange={(event, value) => {
                                const temp = this.state.branchesSelected;
                                temp.push(value); this.setState({ branchesSelected: temp }, () => console.log(this.state.branchesSelected))
                            }}
                            multiSelect
                        />
                        {
                            this.state.branchesSelected.length === 0 && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="startDate">Start Date</label>
                        <DatePicker
                            firstDayOfWeek={DayOfWeek.Sunday}
                            placeholder="Select a date..."
                            ariaLabel="Select a date"
                            onSelectDate={(date) => {
                                { this.setState({ startDate: date }, () => console.log(`${moment(this.state.startDate).format('YYYY-MM-DD')}T00:00:00Z`)) }
                            }}
                            value={this.state.startDate}
                            formatDate={(date)=>`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`}
                            id="startDate"
                            
                            
                        />
                        {
                            this.state.startDate === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="startDate">End Date</label>
                        <DatePicker
                            firstDayOfWeek={DayOfWeek.Sunday}
                            placeholder="Select a date..."
                            ariaLabel="Select a date"
                            formatDate={(date)=>`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`}
                            onSelectDate={(date) => {
                                { this.setState({ endDate: date }, () => console.log(`${moment(this.state.endDate).format('YYYY-MM-DD')}T00:00:00Z`)) }
                            }}
                            value={this.state.endDate}
                            id="endDate"
                            minDate={this.state.startDate}
                            disabled={this.state.startDate===""?true:false}
                        />

                        {
                            this.state.endDate === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-sm-4">
                        <label className="mandatory-label" htmlFor="Categories">Categories</label>
                        <ComboBox
                            placeholder="Please Select Groups"
                            options={this.state.mainCategories}
                            id="Categories"
                            className="form-control p-0"
                            selectedKey={this.state.selectedMainCategory?.key}
                            onChange={(event, value) => this.setState({ selectedMainCategory: value }, async () => { await this.setSubCategories(value.text) })}

                        />

                        {
                            this.state.selectedMainCategory === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>


                    <div className="form-group col-sm-4">

                        <label className="mandatory-label" htmlFor="SubCategories"> SubCategories</label>
                        <ComboBox
                            placeholder="Please Select Groups"
                            options={this.state.subCategories}
                            id="SubCategories"
                            className="form-control p-0"
                            selectedKey={this.state.selectedsubCategory?.key}
                            onChange={(event, value) => this.setState({ selectedsubCategory: value }, () => this.setSubSubCategories(value.text))}

                        />
                        {
                            this.state.selectedsubCategory === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }

                    </div>


                    <div className="form-group col-sm-4">
                        <label htmlFor="SubSubCategories">Sub Sub Categories</label>
                        <ComboBox
                            placeholder="Please Select Groups"
                            options={this.state.subsubCategories}
                            id="SubSubCategories"
                            className="form-control p-0"
                            selectedKey={this.state.selectedsubsubCategory?.key}
                            onChange={(event, value) => this.setState({ selectedsubsubCategory: value })}

                        />


                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-sm-12">
                        <label htmlFor="moreInformation">More Information</label>
                        <ReactQuill theme="snow"

                            modules={modules}
                            formats={formats}
                            id="moreInformation"
                            className="p-0"
                            value={this.state.moreInformation}
                            onChange={(ev) => {
                                this.setState({ moreInformation: ev }, () => console.log(this.state.moreInformation));
                            }}
                        ></ReactQuill>
                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-sm-12">
                        <label htmlFor="OfferTitle">Offer URL</label>
                        <input className="form-control" type="text" placeholder="Enter Offer URL" name="offerURl" id="offerURl" value={this.state.offerURl} onChange={(e) => { this.setState({ offerURl: e.target.value }) }} />


                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-sm-12">
                        <label htmlFor="attachments">Attachments</label>
                        <input

                            type="file"
                            className="file form-control-file"
                            multiple={true}
                            value={this.state.documents?.name}
                            onChange={() => this.UploadDocuments()}
                            id="rDocs"
                            accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,text/plain,text/html,.xlsx, .xls,video/*,audio/*"

                        />
                        <p>{this.state.documentstoShow.map((item: { FileName: any; }, index: any) => { return item.FileName }).join(' ,')}</p>
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-sm-12">
                        <label htmlFor="attachments">Select files to show on portal</label>
                        <Dropdown
                            
                            placeholder="Please Select Branches"
                            options={this.state.attachmenttoComboBox}
                            selectedKey={this.state.attachmentSelected?.key}
                            id="Branch"
                            className="form-control p-0"
                            style={{ border: 0 }}
                            onChange={async (event, option:IComboBoxOption) =>{
                                const temp = this.state.attachmentSelected;
                            
                                if (option.selected) {
                                  // If the option is selected, add both the key and text to the array
                                  temp.push({ key: option.key, text: option.text });
                                } else {
                                  // If the option is deselected, remove it from the array
                                  const index = temp.findIndex((item: { key: string | number; }) => item.key === option.key);
                                  if (index !== -1) {
                                    temp.splice(index, 1);
                                  }
                                }
                            
                                this.setState({ attachmentSelected: temp }, () => console.log(this.state.attachmentSelected));
                              }}
                            multiSelect
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <button  className="btn btn-primary" onClick={() => this.saveOfferReport()}>
                        Submit
                    </button>
                    <button className="btn btn-secondary ms-2 text-white " onClick={()=>this.props.closeButtonNewOffer()}> 
                        Close
                    </button>
                </div>


            </>
        )
    }

}