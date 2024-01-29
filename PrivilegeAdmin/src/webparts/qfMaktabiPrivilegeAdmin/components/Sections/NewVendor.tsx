import { ComboBox } from "@fluentui/react";
import { last } from "lodash";
import React from "react";

export interface NewVendorListProps {
    siteurl: string,
    serviceObject: any,

    loadExisiting: boolean,
    dataSelected: any,
    viewOrEdit: number,
    closeButtonVendor: any,
}
export interface INewVendorListState {
    AllGroups: any,
    GroupSelected: any,

    VendorTitle: any,

    allCountries: any,
    selectedCountry: any


    imageLogo: any,

    contactName: any,
    contactPosition: any,
    contactEmail: any,
    city: any,
    officeTelNo: any,
    mobileNo: any,
    inforMail: any,
    webSite: any,
    Address: any,

    showDocumentInvalid: boolean
    attachments: any,
    documents: any,
    VendorID: null,
    submitclicked: boolean
    Branches: any,

    imageSource: any,
}

export default class NewVendorList extends React.Component<
    NewVendorListProps,
    INewVendorListState>{
    constructor(state: INewVendorListState, props: NewVendorListProps) {
        super(props);
        this.state = {
            AllGroups: [{ key: 'value0', text: '       ' }],
            GroupSelected: "",


            VendorTitle: "",
            allCountries: [{ key: 'value0', text: '       ' }],
            selectedCountry: "",

            imageLogo: [],


            contactName: "",
            contactPosition: "",
            contactEmail: "",
            city: "",
            officeTelNo: "",
            mobileNo: "",
            inforMail: "",
            webSite: "",
            Address: "",


            attachments: [],
            documents: [],
            showDocumentInvalid: false,

            submitclicked: false,
            VendorID: null,

            Branches: [],
            imageSource: ""
        }
    }
    async componentDidMount() {
        const Groups = await this.props.serviceObject.getGroups();
        const GroupsToComboBox = await this.props.serviceObject.ToComboBox(Groups, "groupName");
        this.setState({ AllGroups: GroupsToComboBox });

        const Country = await this.props.serviceObject.getCountries();
        const CountryToComboBox = await this.props.serviceObject.ToComboBoxCountry(Country, "Title");
        this.setState({ allCountries: CountryToComboBox });
        console.log(this.state.allCountries)


        if (this.props.loadExisiting) {
            const dataLOADED = await this.props.serviceObject.getVendorBYID(this.props.dataSelected);
            const GroupSelected = { key: dataLOADED.Group.Id, text: dataLOADED.Group.groupName }
            const countrySelected = { key: dataLOADED.VendorCity, text: dataLOADED.VendorCity }

            console.log(dataLOADED)
            this.setState({
                GroupSelected: GroupSelected,
                VendorTitle: dataLOADED.Vendor_x002f_Branch_x0020_Name,
                selectedCountry: countrySelected,
                contactName: dataLOADED.VendorContactName,
                contactPosition: dataLOADED.VendorContactPosition,

                contactEmail: dataLOADED.VendorContactEmail,
                city: dataLOADED.City,
                officeTelNo: dataLOADED.VendrOfficeTel,

                mobileNo: dataLOADED.VendorofficeTel,
                    
                inforMail: dataLOADED.VendorEmail,
                webSite: dataLOADED.Website,
                Address: dataLOADED.Address,

                VendorID: dataLOADED.ID,
                documents: dataLOADED.AttachmentFiles

            })
            const Branches = await this.props.serviceObject.getBranchesbyID(this.state.VendorID);
            const selectedCountry = dataLOADED.selectedCountry
            await CountryToComboBox.map((item, index) => {
                if (item.text === selectedCountry) {
                    this.setState({ selectedCountry: item })
                }
            })
            const BranchestoForm = []
            await Branches.map((item, index) => {
                BranchestoForm.push({
                    ID: item.ID,
                    brname: item.branchName,
                    lat: item.Latitude,
                    lon: item.Longitude,
                    alreadyExist:true
                })
            })
            this.setState({ Branches: BranchestoForm })
            const documentMapping = [];
            const logoImage = [];
            await this.state.documents.map((item, index) => {
                if (item.FileName !== dataLOADED.logo?.Description)
                    documentMapping.push({
                        ...item,
                        name: item.FileName,
                        alreadyExist: true
                    })
                else {
                    logoImage.push({
                        ...item,
                        name: item.FileName,
                        alreadyExist: true
                    })
                    const siteUrl = this.props.siteurl
                    const rootUrl = siteUrl.split("/")[0] + "//" + siteUrl.split("/")[2];
                    const url = encodeURI(`${rootUrl}${item.ServerRelativeUrl}`);
                    this.setState({ imageSource: url });

                }
            })

            this.setState({ documents: documentMapping });
            this.setState({ imageLogo: logoImage });
            console.log(this.state.documents)


        }
    }
    private UploadDocuments = async () => {
        const files: any = (document.querySelector("#atDocs") as HTMLInputElement)
            .files;
        console.log(files)
        let showDocumentInvalid = false;
        let documents = this.state.documents;
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
                console.log(files[i])
            }
        }
        this.setState({ documents, showDocumentInvalid });



        console.log(documents)

    };
    private UploadimageLogo = async () => {
        const files: any = (document.querySelector("#rDocs") as HTMLInputElement)
            .files;
        const uploadedImage = document.getElementById('uploadedImage');
        let showDocumentInvalid = false;
        let documents = this.state.imageLogo;
        const allowedTypes: any = [
            "image/jpeg",
            "image/png",
            "image/gif",

            "image/jfif",
            "image/jpg",

            "image/svg+xml",


        ];
        for (let i = 0; i < files.length; i++) {
            if (!allowedTypes.includes(files[i].type)) {

                window.alert("Only Add Images")
                showDocumentInvalid = true;
                break;
            } else {
                this.setState({ imageLogo: files[i] })
                const imageSource = URL.createObjectURL(files[i])
                this.setState({ imageSource })
            }

        }
        // console.log(this.state.imageLogo); //n
    };

    public saveVendor = async () => {
        // let branchesSelected = []
        let branchValidation:boolean = false;

        await this.state.Branches.map((item) => {
            if(item.brname===""||item.lon===""||item.lat===""){
                branchValidation=true
                this.setState({submitclicked:true})
                console.log("Pleae Add branch Name")
                return;
            }
        })
        if(branchValidation){
            return;
        }
        let VendorItemID;
        const PortalFiles = await this.state.attachments.map(item => item.text).join(' ,')
        const item = {
            GroupId: this.state.GroupSelected.key,
            Vendor_x002f_Branch_x0020_Name: this.state.VendorTitle,
            VendorCity: this.state.selectedCountry.text,
            VendorContactEmail: this.state.contactEmail,
            VendorContactName: this.state.contactName,
            VendorContactPosition: this.state.contactPosition,
            Status: "Submitted",
            City: this.state.city,
            VendrOfficeTel: this.state.officeTelNo,
            VendorofficeTel: this.state.mobileNo,
            Address:this.state.Address,
            VendorEmail: this.state.inforMail,
            Website: this.state.webSite,

        }
        if(this.state.Branches.length===0){
            window.alert("Kindly Add atleast 1 Branch.");
            this.setState({ submitclicked: true });
            return
        }
        //validation
        if (this.state.GroupSelected !== "" && this.state.VendorTitle !== "" && this.state.GroupSelected !== "" && this.state.selectedCountry !== "" && this.state.contactName !== "" && this.state.contactEmail !== "" && this.state.officeTelNo !== "" && this.state.Address !== "") {
            if (this.props.loadExisiting) {
                
                const itemAdded = await this.props.serviceObject.saveVendorbyID(item, this.state.VendorID);
                console.log(this.state.imageLogo.alreadyExist)
                if(this.state.imageLogo[0].alreadyExist===undefined)
                {
                    const LogoAdded = await itemAdded.item.attachmentFiles.add(
                        this.state.imageLogo.name,
                        this.state.imageLogo,
                        
                    )
                    console.log("LogoAdded")
                    
                }
                else{
                    console.log("logoskipped")
                }
                
                // const LogoHyperLinkAdded= LogoAdded.item.add({
                //     logo:
                // })
                // await this.state.documents.map(async (attachment, index) => {
                //     if (!attachment.alreadyexist) {
                //         await itemAdded.item.attachmentFiles.add(
                //             attachment.name,
                //             attachment
                //         );
                //     }



                // })
                for (const item of this.state.documents) {
                    if (!item.alreadyExist) {
                        await itemAdded.item.itemFiles.add(
                            item.name,
                            item
                        );
                    }
                }
                // await this.state.Branches.map(async (item) => {
                //     await this.props.serviceObject.deleteBranch(item.ID);
                // })
                await this.state.Branches.map(async (item, index) => {
                    const BranchListItem = {
                        vendorId: this.state.VendorID,
                        groupId: this.state.GroupSelected?.key,
                        branchName: item.brname,
                        Latitude: item.lat,
                        Longitude: item.lon,
                    }
                    console.log(item.alreadyExist)
                    if(item.alreadyExist===true){
                        await this.props.serviceObject.updateBranch(BranchListItem,item.ID)
                    }
                    else if(item.alreadyExist===false){
                        await this.props.serviceObject.addBranch(BranchListItem)
                    }
                    
                    
                   
                    
                })

                
                window.location.reload()

            }
            else {
               
                const itemAdded = await this.props.serviceObject.saveVendor(item);
                console.log(itemAdded)
                const vendorID = itemAdded.data.ID
                // await this.state.Branches.map(async (item)=>{
                //     await this.props.serviceObject.deleteBranch(item.ID);
                // })
                await this.state.Branches.map(async (item, index) => {
                    const BranchListItem = {
                        vendorId: vendorID,
                        groupId: this.state.GroupSelected?.key,
                        branchName: item.brname,
                        Latitude: item.lat,
                        Longitude: item.lon,
                    }
                    await this.props.serviceObject.addBranch(BranchListItem)
                })
                const LogoAdded = await itemAdded.item.attachmentFiles.add(
                    this.state.imageLogo.name,
                    this.state.imageLogo
                )
                const idAdded = await this.props.serviceObject.saveVendorbyID({
                    VendorItemID: `${vendorID}`,
                    logo: {
                        Description: this.state.imageLogo.name,
                        Url: `${this.props.siteurl}/Lists/vendorMaster_LiveData/Attachments/${vendorID}/${this.state.imageLogo.name}`
                    }

                }, vendorID)
                // await this.state.documents.map(async (attachment, index) => {

                //     await idAdded.item.attachmentFiles.add(
                //         attachment.name,
                //         attachment
                //     );


                // })
                for (const item of this.state.documents) {
                    await idAdded.item.attachmentFiles.add(
                        item.name,
                        item
                    )
                }
                

                

                // const VendorItemIDAdded = await this.props.serviceObject.saveVendorbyID({
                //     VendorItemID: `${VendorItemID}`,

                // }, VendorItemID)
                // console.log(VendorItemIDAdded)
                // window.location.reload();
                window.location.reload()
            }




            this.setState({ submitclicked: false })
        }
        else {
            this.setState({ submitclicked: true });
        }



    }

    public closeButton=async ()=> {
        this.setState({
            GroupSelected: "",
            selectedCountry: "",
            imageLogo: [],
            contactName: "",
            contactPosition: "",
            contactEmail: "",
            city: "",
            officeTelNo: "",
            mobileNo: "",
            inforMail: "",
            webSite: "",
            Address: "",
            attachments: [],
            documents: [],
            imageSource: ""
        })
        const closeCompleted=await this.props.closeButtonVendor();
    }



    public render(): React.ReactElement<NewVendorListProps> {
        const formControldisable: boolean = (this.props.viewOrEdit === 1) || (this.props.viewOrEdit === 3) ? true : false
        return (
            <>
                <div className="row">
                    <div className="form-group col-sm-12">
                        <label className="mandatory-label" htmlFor="Groups">Group Name</label>
                        <ComboBox
                            disabled={formControldisable}
                            placeholder="Please Select Groups"
                            options={this.state.AllGroups}
                            id="Groups"
                            selectedKey={this.state.GroupSelected?.key}
                            onChange={(event, value?) => this.setState({ GroupSelected: value })}
                            className='form-control p-0'
                        />

                        {
                            this.state.GroupSelected === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-sm-12">
                        <label className="mandatory-label" htmlFor="VendorTitle">Vendor Name</label>
                        <input className='form-control' disabled={formControldisable} type="text" placeholder="Enter Vendor Name" name="VendorTitle" id="VendorTitle" value={this.state.VendorTitle} onChange={(e) => { this.setState({ VendorTitle: e.target.value }) }} />

                        {
                            this.state.VendorTitle === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-sm-6">
                        <label htmlFor="Countries">Country</label>
                        <ComboBox
                            disabled={formControldisable}
                            placeholder="Please Select Country"
                            options={this.state.allCountries}
                            id="Countries"
                            selectedKey={this.state.selectedCountry?.key}
                            onChange={(event, value?) => this.setState({ selectedCountry: value })}
                            className='form-control p-0'
                        />

                        {
                            this.state.selectedCountry === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="rDocs">Vendor Logo</label>

                        <input

                            type="file"
                            disabled={formControldisable}
                            className="file form-control-file"
                            multiple={false}

                            onChange={async () => { await this.UploadimageLogo(); console.log(this.state.imageLogo) }}
                            id="rDocs"
                            accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,text/plain,text/html,.xlsx, .xls,video/*,audio/*"

                        />

                        <div id="divPreview"><img src={this.state.imageSource} className="thumb-image" /></div>


                        {
                            this.state.imageLogo === [] && this.state.submitclicked &&
                            <span className="Required">
                                Upload Image Logo
                            </span>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="contactName">Contact Name</label>
                        <input className='form-control' disabled={formControldisable} type="text" placeholder="Enter contactName" name="contactName" id="contactName" value={this.state.contactName} onChange={(e) => { this.setState({ contactName: e.target.value }) }} />

                        {
                            this.state.contactName === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                    <div className="form-group col-sm-6">
                        <label htmlFor="contactPosition">Contact Position</label>
                        <input className='form-control' disabled={formControldisable} type="text" placeholder="Enter contactPosition" name="contactPosition" id="contactPosition" value={this.state.contactPosition} onChange={(e) => { this.setState({ contactPosition: e.target.value }) }} />

                        {
                            this.state.contactPosition === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="contactEmail">Contact Email</label>
                        <input className='form-control' disabled={formControldisable} type="text" placeholder="Enter contactEmail" name="contactEmail" id="contactEmail" value={this.state.contactEmail} onChange={(e) => { this.setState({ contactEmail: e.target.value }) }} />

                        {
                            this.state.contactEmail === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                    <div className="form-group col-sm-6">
                        <label htmlFor="city">City</label>
                        <input className='form-control' disabled={formControldisable} type="text" placeholder="Enter city" name="city" id="city" value={this.state.city} onChange={(e) => { this.setState({ city: e.target.value }) }} />

                        {
                            this.state.city === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-sm-6">
                        <label className="mandatory-label" htmlFor="officeTelNo">Official Tel No</label>
                        <input className='form-control' disabled={formControldisable} type="text" placeholder="Enter officeTelNo" name="officeTelNo" id="officeTelNo" value={this.state.officeTelNo} onChange={(e) => { this.setState({ officeTelNo: e.target.value }) }} />

                        {
                            this.state.officeTelNo === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                    <div className="form-group col-sm-6">
                        <label htmlFor="mobileNo">Mobile No</label>
                        <input className='form-control' disabled={formControldisable} type="text" placeholder="Enter mobileNo" name="mobileNo" id="mobileNo" value={this.state.mobileNo} onChange={(e) => { this.setState({ mobileNo: e.target.value }) }} />

                        {

                            this.state.mobileNo === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-sm-6">
                        <label htmlFor="inforMail">Info Email</label>
                        <input className='form-control' disabled={formControldisable} type="text" placeholder="Enter inforMail" name="inforMail" id="inforMail" value={this.state.inforMail} onChange={(e) => { this.setState({ inforMail: e.target.value }) }} />

                        {
                            this.state.inforMail === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                    <div className="form-group col-sm-6">
                        <label htmlFor="webSite">Website</label>
                        <input className='form-control' disabled={formControldisable} type="text" placeholder="Enter webSite" name="webSite" id="webSite" value={this.state.webSite} onChange={(e) => { this.setState({ webSite: e.target.value }) }} />

                        {
                            this.state.webSite === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-sm-12">
                        <label className="mandatory-label" htmlFor="Address">Address</label>
                        <textarea className='form-control' disabled={formControldisable}  placeholder="Enter Address" name="Address" id="Address" value={this.state.Address} onChange={(e) => { this.setState({ Address: e.target.value }) }} />
                        {
                            this.state.Address === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-sm-12">
                        <label htmlFor="atDocs">Attachments</label>
                        <input
                            disabled={formControldisable}
                            type="file"
                            className="file form-control-file"
                            multiple={true}
                            value={this.state.documents?.name}
                            onChange={() => this.UploadDocuments()}
                            id="atDocs"
                            accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,text/plain,text/html,.xlsx, .xls,video/*,audio/*"

                        />
                        { this.state.documents.map((item, index) => {
                            const siteUrl = this.props.siteurl
                            const rootUrl = siteUrl.split("/")[0] + "//" + siteUrl.split("/")[2];
                            const url = encodeURI(`${rootUrl}${item.ServerRelativeUrl}`)


                            console.log(rootUrl)
                            return <p><a href={url} target="_blank">{item.name}</a>{index < this.state.documents.length - 1 && ', '}</p>





                        })}
                    </div>

                </div>
                <div className="row">
                    <div className="col">
                        <button className="btn btn-primary btn-new-Offer" disabled={formControldisable} onClick={() => {
                            const temp = this.state.Branches
                            temp.push({ brname: "", lat: "", lon: "" ,alreadyExist:false})
                            this.setState({ Branches: temp })
                        }}>Add Branch</button>
                    </div>
                </div>
                <div>
                    {
                        this.state.Branches.map((item, index) => {
                            return (
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <label htmlFor="BranchName">Branch Name</label>
                                        <input className='form-control' disabled={formControldisable} id="BranchName" type="text" value={item.brname} placeholder="Branch Name"
                                            onChange={(e) => {
                                                const temp = this.state.Branches
                                                temp[index] = {
                                                    ...temp[index],
                                                    brname: e.target.value
                                                }
                                                this.setState({ Branches: temp })
                                            }} />
                                            {
                           item.brname === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                                    </div>

                                    <div className="form-group col-sm-3">
                                        <label htmlFor="Latitude">Latitude</label>
                                        <input className='form-control' disabled={formControldisable} id="Latitude" type="text" value={item.lat} placeholder="Latitude"
                                            onChange={(e) => {
                                                const temp = this.state.Branches
                                                temp[index] = {
                                                    ...temp[index],
                                                    lat: e.target.value
                                                }
                                                this.setState({ Branches: temp })
                                            }} />
                                            {
                           item.lat === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <label htmlFor="Longitude">Longitude</label>
                                        <input className='form-control' disabled={formControldisable} id="Longitude" type="text" value={item.lon} placeholder="Longitude"
                                            onChange={(e) => {
                                                const temp = this.state.Branches
                                                temp[index] = {
                                                    ...temp[index],
                                                    lon: e.target.value
                                                }
                                                this.setState({ Branches: temp })
                                            }} />
                                            {
                           item.lon === "" && this.state.submitclicked &&
                            <span className="Required">
                                This field is required
                            </span>
                        }
                                    </div>
                                    <div className="form-group col-sm-3">
                                        {(formControldisable)?null:<><label htmlFor="DeleteUpdate">Actions</label><div className="row">
                                            <div className="col">
                                                <button className='btn btn-danger btn-new-Offer' id='DeleteUpdate' onClick={async () => {
                                                    const temp = [];
                                                    await this.state.Branches.map((item, Deleteindex) => {
                                                        if (Deleteindex !== index) {
                                                            temp.push(item);
                                                        }
                                                    });
                                                    this.setState({ Branches: temp });
                                                    await this.props.serviceObject.deleteBranch(item.ID)
                                                } }>Delete</button>
                                                {(this.props.loadExisiting)?<button className='btn btn-primary btn-new-Offer ms-1' id='DeleteUpdate'>Update</button>:null}
                                            </div>
                                        </div></>}

                                    </div>
                                </div>



                            )
                        })
                    }
                </div>
                <div className="d-flex justify-content-end">
                    <button disabled={formControldisable} className="btn btn-primary" onClick={() => this.saveVendor()}>
                        Submit
                    </button>
                    <button  className="btn btn-secondary ms-2 text-white" onClick={() => this.closeButton()}>
                        Close
                    </button>
                </div>

            </>
        )
    }
}