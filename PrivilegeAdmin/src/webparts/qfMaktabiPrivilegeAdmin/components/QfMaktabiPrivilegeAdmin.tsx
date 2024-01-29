import * as React from 'react';
// import styles from './QfMaktabiPrivilegeAdmin.module.scss';
import { IQfMaktabiPrivilegeAdminProps } from './IQfMaktabiPrivilegeAdminProps';
import { LISTS, GROUPS, PAGES } from "../../../Shared/Common/Service_Config";
import { escape } from '@microsoft/sp-lodash-subset';
import IQfMaktabiPrivilegeAdminState from './IQfMaktabiPrivilegeAdminState';  //state
import OfferList from './Sections/OfferList';
import { Service_Business_Ar } from '../../../Shared/Common/Service_Business';
import { FontWeights, getTheme, mergeStyleSets, Modal } from 'office-ui-fabric-react';
import NewOfferList from './Sections/NewOffer';
import ViewEditPage from './Sections/ViewEditPage';
import VendorList from './Sections/VendorList';
import NewVendorList from './Sections/NewVendor';
import './QfMaktabiPrivilegeAdmin.css'

import './style.css';
import './simple-line-icons.css';
// import '../components/simple-line-icons.css'
import { IButtonStyles, IconButton, IIconProps } from '@fluentui/react';

// import { ChevronDownIcon } from '@fluentui/react-icons-mdl2';


const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
  },
  header: [

    theme.fonts.xLargePlus,
    {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "12px 12px 14px 24px",
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: "inherit",
    margin: "0",
  },
  body: {
    flex: "4 4 auto",
    padding: "0 24px 24px 24px",
    overflowY: "hidden",
    selectors: {
      p: { margin: "14px 0" },
      "p:first-child": { marginTop: 0 },
      "p:last-child": { marginBottom: 0 },
    },
  },
});
const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    marginLeft: "auto",
    marginTop: "4px",
    marginRight: "2px",
  },
  rootHovered: {},
};
const cancelIcon: IIconProps = { iconName: "Cancel" };
export default class QfMaktabiPrivilegeAdmin extends React.Component<IQfMaktabiPrivilegeAdminProps, IQfMaktabiPrivilegeAdminState, {}> {
  private _services_Business: Service_Business_Ar;
  constructor(props: IQfMaktabiPrivilegeAdminProps, state: IQfMaktabiPrivilegeAdminState) {
    super(props);
    this.state = {
      //r
      VendorList: false,
      OfferList: true,
      NewOfferPage: false,
      ViewEditRenew: false,
      NewVendorPage: false,
      //r

      GroupModal: false,
      CategoriesModal: false,
      ApprovalModal: false,
      OfferTypes: false,
      Survey: false,
      Banner: false,
      OfferSummary: false,
      SupplierReq: false,
      OfferRating: false,

      dataForOfferViewEditPage: {},
      dataForVendorViewEditPage: {},
      vieworeditcondition: 2,
      vendoreditrenew: false,

      modalOpen: false,


      OfferIDtoPass: null,


      //accessControl
      ppTeam: false,
      ppAdminTeam: false,
      loadcomplete:false,
      //accessControl
    }
    this._services_Business = new Service_Business_Ar(
      this.props.context as any
    );
  }



  public async componentDidMount() {
    const ppAdminTeam = await this._services_Business.isAuthorized(GROUPS.PORTAL_PP_ADMIN_TEAM);
    const ppTeam = await this._services_Business.isAuthorized(GROUPS.PORTAL_PP_TEAM);
    this.setState({ ppAdminTeam, ppTeam });
    console.log(ppAdminTeam, ppTeam);


    const url: string = window.location.search;
    const Action = new URLSearchParams(url).get('Action');
    const RecordId = parseInt(new URLSearchParams(url).get('RecordId'));
    console.log(Action, RecordId)
    if (Action === "OfferEdit") {
      this.setState({
        OfferList: false,
        ViewEditRenew: true,
        OfferIDtoPass: RecordId,
        vieworeditcondition: 2
      })
    }
    else if (Action === "VendorEdit") {
      this.setState({
        OfferList: false,
        NewVendorPage: true,
        dataForVendorViewEditPage: RecordId,
        vieworeditcondition: 2,
        vendoreditrenew: true
      })
    }
    else if (Action === "VendorView") {
      this.setState({
        OfferList: false,
        NewVendorPage: true,
        dataForVendorViewEditPage: RecordId,
        vieworeditcondition: 1,
        vendoreditrenew: true
      })
    }
    else if (Action === "OfferView") {
      this.setState({
        OfferList: false,
        ViewEditRenew: true,
        OfferIDtoPass: RecordId,
        vieworeditcondition: 1
      })
    }
    else if (Action === null) {
      console.log("Normal Login")
    }

   this.setState({loadcomplete:true})
  }

  public renderOptions = (name) => {
    if (name === "OfferList") {
      this.setState({
        OfferList: true,
        VendorList: false,
        NewOfferPage: false,
        ViewEditRenew: false,
        NewVendorPage: false,
      })
    }
    else if (name === "VendorList") {
      this.setState({
        OfferList: false,
        VendorList: true,
        NewOfferPage: false,
        ViewEditRenew: false,
        NewVendorPage: false

      })
    }
  }

  private hideModal = () => {
    this.setState({ GroupModal: false, modalOpen: false })

    this.setState({
      CategoriesModal: false,
      ApprovalModal: false,
      OfferTypes: false,
      Survey: false,
      Banner: false,
      OfferSummary: false,
      SupplierReq: false,
      OfferRating: false,
    })
  }
  public setViewEditFunctionOffer = async (passData, Id, pageCondition) => {
    console.log(Id)
    this.setState({ vieworeditcondition: pageCondition })
    this.setState({ OfferIDtoPass: Id })
    const dataToPass = {}
    console.log(passData)
    await passData.map(async (item, index) => {
      if (item.Id === Id) {
        // let branches = []
        // let attachments = []
        // await item.Branches?.results.map((item) => {
        //   branches.push({ key: item.ID })
        // })
        //  await item.AttachmentFiles.results.push((item)=>{
        //    attachments.push({item})
        //  })
        // dataToPass = {
        //   ID: item.ID,
        //   Offer_x0020_Title: item.Offer_x0020_Title,
        //   offer0: item.offer0,
        //   Group: { key: item.Group.ID },
        //   Vendor: { key: item.Vendor.ID },
        //   Branches: branches,
        //   offer_x0020_end_x0020_date: item.offer_x0020_end_x0020_date,
        //   offer_x0020_start_x0020_date: item.offer_x0020_start_x0020_date,
        //   L1Category: { key: item.L1Category.ID },
        //   L2Categories: { key: item.L2Categories.ID },
        //   L3Categories: { key: item.L3Categories.ID },
        //   // moreInformation:dataLOADED
        //   OfferURL: item.OfferURL,
        //   documents:item.AttachmentFiles.results
        // }
      }
      this.setState({ dataForOfferViewEditPage: dataToPass })


    })

    this.setState({
      OfferList: false,
      VendorList: false,
      NewOfferPage: false,
      ViewEditRenew: true,
      NewVendorPage: false,

    })
    console.log(this.state.dataForOfferViewEditPage)
  }

  public setViewEditFunctionVendor = async (passData, Id, pageCondition) => {

    this.setState({ vieworeditcondition: pageCondition })
    this.setState({ dataForVendorViewEditPage: Id })
    let dataToPass = {}
    console.log(Id)

    await passData.map(async (item, index) => {

      if (item.Id === Id) {
        console.log(item)
        //vendor
        dataToPass = {
          GroupSelected: { key: item.Group.Id },
          VendorTitle: item.Vendor_x002f_Branch_x0020_Name,
          selectedCountry: item.VendorCity,
          contactName: item.VendorContactName,
          contactPosition: item.VendorContactPosition,

          contactEmail: item.VendorContactEmail,
          city: item.City,
          officeTelNo: item.VendrOfficeTel,

          mobileNo: item.VendorofficeTel,

          inforMail: item.VendorEmail,
          webSite: item.Website,
          Address: item.Address,
          ID: item.ID,
          documents: item.AttachmentFiles.results
        }
      }



    })

    this.setState({
      OfferList: false,
      VendorList: false,
      NewOfferPage: false,
      ViewEditRenew: false,
      NewVendorPage: true,
      vendoreditrenew: true,
    })


  }
  public createNewOffer = () => {
    console.log("changes to new offer")
    this.setState({ NewOfferPage: true, OfferList: false, VendorList: false, NewVendorPage: false });
  }
  public closeButtonVendor = () => {
    this.setState({
      VendorList: true,
      dataForVendorViewEditPage: "",
      NewVendorPage: false,
    })
  }
  public closeButtonNewOffer = () => {
    this.setState({
      OfferList: true,
      dataForOfferViewEditPage: "",
      NewOfferPage: false,
    })
  }
  public closeButtonEditOffer = () => {
    this.setState({
      OfferList: true,
      dataForOfferViewEditPage: "",
      NewOfferPage: false,
      ViewEditRenew: false
    })
  }
  public render(): React.ReactElement<IQfMaktabiPrivilegeAdminProps> {
    return (
      <>
        <div className='app-body container-fluid mt-5'>


          <div className='sidebar'>
            <nav className="sidebar-nav">
              <ul className="nav">
                <li className="nav-title">Privilege Admin</li>

                {this.state.ppAdminTeam || this.state.ppTeam ? <li className={(this.state.GroupModal) ? "nav-item active-item" : "nav-item "}>
                  <a className="nav-link hand-cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { this.setState({ GroupModal: true, modalOpen: true }); }}>
                    <i className="nav-icon icon-drop" aria-hidden="true" aria-label="DropIcon"/>Groups</a>
                </li> : null}
                {this.state.ppAdminTeam || this.state.ppTeam ? <li className={(this.state.VendorList && !this.state.modalOpen) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link hand-cursor" onClick={() => this.renderOptions("VendorList")} id="linkVendorList" href="#">
                    <i className="nav-icon icon-drop" aria-label="DropIcon"/> Vendor List</a>
                </li> : null}
                {this.state.ppAdminTeam || this.state.ppTeam ? <li className={(this.state.OfferList && !this.state.modalOpen) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link active-item hand-cursor" onClick={() => this.renderOptions("OfferList")} id="linkOfferList" href="#">
                    <i className="nav-icon icon-drop" aria-label="DropIcon"/> Offers List</a>
                </li> : null}
                {this.state.ppAdminTeam ? <li className={(this.state.ApprovalModal) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link hand-cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { this.setState({ ApprovalModal: true, modalOpen: true }); }}>

                    <i className="nav-icon icon-drop" aria-label="DropIcon"/>Approvals</a>
                </li> : null}



                {this.state.ppAdminTeam ? <li className={(this.state.OfferRating) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link hand-cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { this.setState({ OfferRating: true, modalOpen: true }); }}>
                    <i className="nav-icon icon-drop" aria-label="DropIcon"/>Offer Ratings</a>
                </li> : null}
                {this.state.ppAdminTeam ? <li className={(this.state.Survey) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link hand-cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { this.setState({ Survey: true, modalOpen: true }); }}>
                    <i className="nav-icon icon-drop" aria-label="DropIcon"/>Survey List </a>
                </li> : null}
                {this.state.ppAdminTeam ? <li className={(this.state.OfferTypes) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link hand-cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { this.setState({ OfferTypes: true, modalOpen: true }); }}>
                    <i className="nav-icon icon-drop" aria-label="DropIcon"/>Offer Types</a>
                </li> : null}
                {this.state.ppAdminTeam ? <li className={(this.state.CategoriesModal) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link hand-cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { this.setState({ CategoriesModal: true, modalOpen: true }); }}>
                    <i className="nav-icon icon-drop" aria-label="DropIcon"/>Categories</a>
                </li> : null}
                {this.state.ppAdminTeam ? <li className={(this.state.SupplierReq) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link hand-cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { this.setState({ SupplierReq: true, modalOpen: true }); }}>
                    <i className="nav-icon icon-drop" aria-label="DropIcon"/>Supplier Requests</a>
                </li> : null}
                {this.state.ppAdminTeam ? <li className={(this.state.Banner) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link hand-cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { this.setState({ Banner: true, modalOpen: true }); }}>
                    <i className="nav-icon icon-drop" aria-label="DropIcon"/>Banner List</a>
                </li> : null}



                {this.state.ppAdminTeam ? <li className={(this.state.OfferSummary) ? "nav-item active-item " : "nav-item"}>
                  <a className="nav-link hand-cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { this.setState({ OfferSummary: true }); }}>
                    <i className="nav-icon icon-drop" aria-label="DropIcon"/>Offers Summary</a>
                </li> : null}




              </ul>

            </nav>


          </div>


          <main className="main" id="main">
            <div className='container-fluid'>
              <div className='ui-view'>
                <div className="row">
                  <div className='col-sm-12'>
                    <div className='card'>


                      <div className='card-header'>
                        {(this.state.OfferList) ? 'Offer List' : (this.state.VendorList) ? 'Vendor List' : (this.state.NewOfferPage) ? "Offer Entry" : (this.state.NewVendorPage) ? "Vendor Entry" : ""}
                      </div>


                      <div className='card-body'>
                        {

                          this.state.NewOfferPage &&
                          <div className='specific' id='offerEntry'>
                            <NewOfferList closeButtonNewOffer={this.closeButtonNewOffer} siteurl={this.props.context.pageContext.web.absoluteUrl} serviceObject={this._services_Business} />
                          </div>

                        }
                        {this.state.ViewEditRenew &&
                          <div className='specific' id='offerEntry'>
                            <ViewEditPage closeButtonNewOffer={this.closeButtonEditOffer} isRenew={false} viewOrEdit={this.state.vieworeditcondition} dataSelected={this.state.OfferIDtoPass} siteurl={this.props.context.pageContext.web.absoluteUrl} serviceObject={this._services_Business} rootUrl={this.props.context.pageContext.site.absoluteUrl} />
                          </div>


                        }
                        {this.state.NewVendorPage &&
                          <div className='specific' id='vendorForm'>

                            <NewVendorList viewOrEdit={this.state.vieworeditcondition} closeButtonVendor={this.closeButtonVendor} dataSelected={this.state.dataForVendorViewEditPage} loadExisiting={this.state.vendoreditrenew} siteurl={this.props.context.pageContext.web.absoluteUrl} serviceObject={this._services_Business} />
                          </div>
                        }
                        {
                          (this.state.OfferList && (this.state.ppAdminTeam || this.state.ppTeam)) &&
                          <div className='divOfferList'>
                            {/* <div style={{ textAlign: 'right' }}>
                              <button className='btn btn-primary btn-new-Offer' style={{ marginLeft: 'auto' }} onClick={() => this.setState({ NewOfferPage: true, OfferList: false, VendorList: false, NewVendorPage: false })}>Create New Offer</button>
                            </div> */}



                            <OfferList setViewEditFunction={this.setViewEditFunctionOffer} createNewOffer={this.createNewOffer} serviceObject={this._services_Business} siteurl={this.props.context.pageContext.web.absoluteUrl} />
                          </div>

                        }

                        {
                          (!this.state.ppAdminTeam && !this.state.ppTeam && this.state.loadcomplete) &&
                          <div>
                            <h1>You Dont Have Access To this Site</h1>
                          </div>

                        }

                        {
                          this.state.VendorList &&
                          <div className='divOfferList'>
                            <div style={{ textAlign: 'right' }}>
                              <button style={{ marginLeft: 'auto' }} className='btn btn-primary btn-new-vendor' onClick={() => this.setState({ NewOfferPage: false, OfferList: false, VendorList: false, NewVendorPage: true })}>Create New Vendor</button>
                            </div>



                            <VendorList setViewEditFunction={this.setViewEditFunctionVendor} serviceObject={this._services_Business} siteurl={this.props.context.pageContext.web.absoluteUrl} />
                          </div>
                        }

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>






        </div>
        {/* group */}

        <div className="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" style={(this.state.CategoriesModal) ? { width: "100%" } : (this.state.Banner) ? { maxWidth: "1200px", width: "100%" } : (this.state.OfferSummary) ? {maxWidth: "1200px",width: "80%"} : (this.state.ApprovalModal)?{maxWidth: "1200px",width: "90%"}:(this.state.OfferRating)?{maxWidth: "1200px",width: "90%"}:(this.state.Survey)?{maxWidth: "1200px",width: "70%"}:(this.state.SupplierReq)?{maxWidth: "1200px",width: "80%"}:(this.state.GroupModal)?{maxWidth: "1200px",width: "70%"}:null}>
            <div className="modal-content">
              <div className="modal-header">
                {(this.state.GroupModal) ?
                  <h5> Groups</h5>
                  : null}
                {
                  (this.state.CategoriesModal) ?
                    <h5> Categories</h5>
                    : null
                }
                {
                  (this.state.ApprovalModal) ? <h5> Approvals</h5> : null
                }
                {
                  (this.state.OfferTypes) ? <h5> Offer Types</h5> : null
                }
                {
                  (this.state.Survey) ? <h5>Survey</h5> : null
                }
               
                
                {
                  (this.state.SupplierReq) ? <h5> Supplier Request</h5> : null
                }
                {
                  (this.state.OfferRating) ? <h5> Offer Rating</h5>
                    : null
                }


                <button type="button" onClick={() => this.hideModal()} className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
              </div>
              <div className="modal-body">
                {(this.state.GroupModal) ?
                  <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/GroupsModal.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "100%", height: "400px" }}/>
                  : null}
                {
                  (this.state.CategoriesModal) ?
                    <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/Categoriesv2.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "100%", height: "400px" }}/>
                    : null
                }
                {
                  (this.state.ApprovalModal) ? <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/Approvalsv2.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "100%", height: "400px" }}/> : null
                }
                {
                  (this.state.OfferTypes) ? <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/OfferTypesv2.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "400px" }}/> : null
                }
                {
                  (this.state.Survey) ? <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/SurveyList.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "100%", height: "400px" }}/> : null
                }
                {
                  (this.state.Banner) ? <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={encodeURI(this.props.context.pageContext.web.absoluteUrl + '/Lists/SliderItems/AllItems.aspx?&IsDlg=1&mode=nomenu')} frameBorder="0" style={{ width: "100%", height: "400px" }}/> : null
                }
                {
                  (this.state.OfferSummary) ? <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/OfferSummary.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "100%", height: "400px" }}/> : null
                }
                {
                  (this.state.SupplierReq) ? <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/SuppierRequest.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "100%", height: "400px" }}/> : null
                }
                {
                  (this.state.OfferRating) ? <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/OfferRatingv2.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "100%", height: "400px" }}/>
                    : null
                }

              </div>

            </div>
          </div>
        </div>
        {/* group */}

        {/* <Modal titleAriaId="New OFfer" isOpen={this.state.GroupModal} onDismiss={()=>this.hideModal()} isBlocking={false} containerClassName={contentStyles.container}>
        <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.hideModal()}
            />
          <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/Lists/groupMaster_LiveData/AllItems.aspx?viewid=597947dc-6056-44da-a73f-03300dbea082&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "490px" }}></iframe>

        </Modal> */}

        {/* <Modal titleAriaId="New OFfer" isOpen={this.state.CategoriesModal} onDismiss={() => this.setState({ CategoriesModal: false,modalOpen:false })} isBlocking={false} containerClassName={contentStyles.container}>
        <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.setState({ CategoriesModal: false,modalOpen:false })}
            />
          <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/Categoriesv2.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "490px" }}></iframe>

        </Modal> */}
        {/* <Modal titleAriaId="New OFfer" isOpen={this.state.ApprovalModal} onDismiss={() => this.setState({ ApprovalModal: false ,modalOpen:false})} isBlocking={false} containerClassName={contentStyles.container}>

        <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.setState({ ApprovalModal: false ,modalOpen:false})}
            />
          <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/Approvalsv2.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "490px" }}></iframe>

        </Modal> */}
        {/* <Modal titleAriaId="New OFfer" isOpen={this.state.OfferTypes} onDismiss={() => this.setState({ OfferTypes: false ,modalOpen:false})} isBlocking={false} containerClassName={contentStyles.container}>

        <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.setState({ OfferTypes: false ,modalOpen:false})}
            />
          <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/Lists/offerTypes/AllItems.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "490px" }}></iframe>

        </Modal> */}
        {/* <Modal titleAriaId="New OFfer" isOpen={this.state.Survey} onDismiss={() => this.setState({ Survey: false,modalOpen:false })} isBlocking={false} containerClassName={contentStyles.container}>

        <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.setState({ Survey: false,modalOpen:false })}
            />
          <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/Lists/PrivilegePolls/AllItems.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "490px" }}></iframe>

        </Modal> */}
        {/* <Modal titleAriaId="New OFfer" isOpen={this.state.Banner} onDismiss={() => this.setState({ Banner: false ,modalOpen:false})} isBlocking={false} containerClassName={contentStyles.container}>

        <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.setState({ Banner: false ,modalOpen:false})}
            />
          <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/BannerModal.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "490px" }}></iframe>

        </Modal> */}
        {/* <Modal titleAriaId="New OFfer" isOpen={this.state.OfferSummary} onDismiss={() => this.setState({ OfferSummary: false,modalOpen:false })} isBlocking={false} containerClassName={contentStyles.container}>

        <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.setState({ OfferSummary: false,modalOpen:false })}
            />
          <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/OfferSummary.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "490px" }}></iframe>

        </Modal> */}
        {/* <Modal titleAriaId="New OFfer" isOpen={this.state.SupplierReq} onDismiss={() => this.setState({ SupplierReq: false ,modalOpen:false})} isBlocking={false} containerClassName={contentStyles.container}>

        <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.setState({ SupplierReq: false ,modalOpen:false})}
            />
          <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/Lists/Supplier%20Requests/AllItems.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "490px" }}></iframe>

        </Modal> */}
        {/* <Modal titleAriaId="New OFfer" isOpen={this.state.OfferRating} onDismiss={() => this.setState({ OfferRating: false, modalOpen: false })} isBlocking={false} containerClassName={contentStyles.container}>

          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={() => this.setState({ OfferRating: false, modalOpen: false })}
          />
          <iframe id="DlgFrame1c900ec2-fe80-4c35-9872-bed0d4a6b015" src={this.props.context.pageContext.web.absoluteUrl + '/SitePages/OfferRatingv2.aspx?&IsDlg=1&mode=nomenu'} frameBorder="0" style={{ width: "710px", height: "490px" }}></iframe>

        </Modal> */}
        <div>

          {/* {this.state.ViewEditRenew &&
            <ViewEditPage viewOrEdit={this.state.vieworeditcondition} dataSelected={this.state.dataForOfferViewEditPage} siteurl={this.props.context.pageContext.web.absoluteUrl} serviceObject={this._services_Business} />} */}



        </div>
        
      </>
    );
  }

}


