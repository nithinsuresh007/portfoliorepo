import * as React from 'react';
// import styles from './QfMaktabiPrivilegeApproval.module.scss';
import { IQfMaktabiPrivilegeApprovalProps } from './IQfMaktabiPrivilegeApprovalProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Rating } from '@fluentui/react';
import { sp } from '@pnp/sp';
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPService } from '../../../Shared/Common/Service_dataAccess';
import { Service_Business_Ar } from '../../../Shared/Common/Service_Business';
import { Web } from '@pnp/sp/webs';
import './style.css'
export interface IQfMaktabiPrivilegeApprovalState {
  OfferData: any,
  breadcrumbNavArray: any;
  categoryArray: any;

  isModalOpen: boolean,
  L1Access: boolean,
  L2Access: boolean,
  VendorData: any,

  allowVendorNotification: boolean,
  allowEnduserNotification: boolean,

  comments: any,

}
export default class QfMaktabiPrivilegeApproval extends React.Component<IQfMaktabiPrivilegeApprovalProps, IQfMaktabiPrivilegeApprovalState, {}> {

  private _services_Business: Service_Business_Ar;
  constructor(props: IQfMaktabiPrivilegeApprovalProps, state: IQfMaktabiPrivilegeApprovalState) {
    super(props);
    this.state = {
      OfferData: [],
      breadcrumbNavArray: [],
      categoryArray: [],
      isModalOpen: false,
      VendorData: [],
      L1Access: false,
      L2Access: false,
      comments: "",
      allowVendorNotification: false,
      allowEnduserNotification: false,
    }

    sp.setup({
      spfxContext: this.context as any,
    });
    this._services_Business = new Service_Business_Ar(
      this.props.context as any
    );
  }
  async componentDidMount(): Promise<void> {
    const url: string = window.location.search;
    const offerId = new URLSearchParams(url).get('offerID')

    const web = Web(`${this.props.context.pageContext.site.absoluteUrl}/Privilegeportal`);
    const selectedData = await this._services_Business.getOfferItem(web, parseInt(offerId));
    this.setState({ OfferData: selectedData })

    const currentUser = this.props.context.pageContext.user.email
    if (this.state.OfferData.Status === "Renewed") {
      this.setState({
        OfferData: {
          ...this.state.OfferData,
          Status: "Submitted"
        }
      })
    }
    console.log(currentUser);
    console.log(this.state.OfferData);
    const VendorData = this.state.OfferData.Vendor
    this.setState({ VendorData });
    await SPComponentLoader.loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC1W_DFBh_CQpP8xNBHSz5PLHO6QESWprw"
    ).then(() => {
      this.BindCoordinates(this.state.OfferData, 'map');
    });
    await this.checkUserAuth(currentUser)
  }
  public async checkUserAuth(userEmail: string) {
    const L1Access = await this._services_Business.checkL1Access(userEmail);
    const L2Access = await this._services_Business.checkL2Access(userEmail);
    console.log(L1Access, L2Access)
    this.setState({ L1Access, L2Access })
  }

  private GetAttachmentFiles = (offerItem) => {
    try {
      let fileHtml = '';
      offerItem.AttachmentFiles.map((item, index) => {
        if (offerItem.PortalAttachments && (offerItem.PortalAttachments.indexOf(item.FileName) > -1 ||
          decodeURIComponent(offerItem.PortalAttachments).indexOf(item.FileName) > -1)) {
          fileHtml += "<div class='divAttachment'><a target='_blank' href='" + item
            .ServerRelativeUrl + "'>" + item.FileName + "</a></div>";
        }
      });

      return fileHtml
    }
    catch (e) {
      return '';
    }
  }

  private BindCoordinates = (oItem, mapElement) => {
    //split
    let uluru = [];
    oItem.Branches.map((item, index) => {
      uluru.push({
        lat: parseFloat(item.Latitude),
        lng: parseFloat(item.Longitude)
      })
    });
    if (mapElement)
      this.initMap(uluru, mapElement);
  }
  /* render Google coordinates */
  private initMap = (uluru, mapElement) => {
    const google = (window as any).google;
    if (uluru !== null && uluru !== undefined && mapElement !== null && mapElement !== undefined) {
      if (uluru.length > 0) {
        const map = new google.maps.Map(
          document.getElementById(mapElement), {
          zoom: 10,
          center: uluru[0]
        });
        // The marker, positioned at Uluru
        for (let i = 0; i < uluru.length; i++) {
          const vUrl = 'https://maps.google.com/?q=' + uluru[i].lat + ',' + uluru[i].lng;

          const marker = new google.maps.Marker({
            position: uluru[i],
            map: map,
            url: vUrl
          });

          google.maps.event.addListener(marker, 'click', function (e) {
            window.open(this.url);
          });
        }
      }
    }
  }

  public async changeOfferStatus(response: string) {
    if (response === 'Approve') {
      const nextStatus = (this.state.OfferData.Status === 'Submitted') ? (this.state.OfferData.Offer_x0020_Title !== 'Special Offer') ? 'Approved' : 'L1Approved' : (this.state.OfferData.Status === 'L1Approved') ? 'Approved' : (this.state.OfferData.Status === 'L2Approved') ? 'Approved' : null;
      console.log(nextStatus);
      const passData = {
        Status: nextStatus,
        ReturnComments: (this.state.comments === "") ? "N/A" : this.state.comments,
        vendorEmailChecked: this.state.OfferData.vendorEmailChecked,
        EndUserEmailChecked: this.state.OfferData.EndUserEmailChecked
      }
      const notificationData = {
        Title: "Offer",
        ListID: this.state.OfferData.ID,
        Status: nextStatus
      }


      const updatesItem = await this._services_Business.updateStatusbyId(passData, this.state.OfferData.ID)


      const updateNotification = await this._services_Business.AddNotification(notificationData)

      window.location.reload()
      console.log(updatesItem)
    }
    else {
      const passData = {
        Status: response,
        ReturnComments: (this.state.comments === "") ? "N/A" : this.state.comments,
      }
      const notificationData = {
        Title: "Offer",
        ListID: this.state.OfferData.ID,
        Status: response
      }
      const updatesItem = await this._services_Business.updateStatusbyId(passData, this.state.OfferData.ID);
      const updateNotification = await this._services_Business.AddNotification(notificationData)
      window.location.reload()
      console.log(updatesItem)
    }
  }


  public render(): React.ReactElement<IQfMaktabiPrivilegeApprovalProps> {



    const { data } = this.state.OfferData;
    const { breadcrumbNavArray, categoryArray } = this.state;
    return (
      <>

        <div className="container jood-home" id="scrolloffset">
          <section className={"col-md-12 d-none d-sm-none d-md-block d-lg-block"}>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb p-0 my-3">
                <li className="breadcrumb-item hand-cursor text-capitalize"><a href="#">JOOD</a></li>
                {breadcrumbNavArray.map((item, index) =>
                (
                  <li className="breadcrumb-item hand-cursor text-capitalize"><a href={`${item}`}>{categoryArray[index]}</a></li>
                )
                )}
                <li className="breadcrumb-item active text-capitalize" aria-current="page">{this.state.OfferData.Vendor?.Vendor_x002f_Branch_x0020_Name}</li>
              </ol>
            </nav>
          </section>
          <section className="jood-details" >
            <div className="row">
              <div className="col-md-6">
              <div className="row">
              {/* details */}
              <div className='col-md-12'>
                <a href="#" className="automotive-tags px-2 py-1
                      rounded-pill">{this.state.OfferData.L1Category?.Categories}</a>
                <h2 className="mt-3">{this.state.OfferData.Vendor?.Vendor_x002f_Branch_x0020_Name}</h2>
                <div className="star-rating d-flex
                      align-items-center mb-2">
                  <div className="star">
                    <ul className="m-0 d-flex
                              list-unstyled">
                      {this.state.OfferData.Rating ? <Rating rating={this.state.OfferData.Rating} max={5} size={1}
                        disabled={false} onChange={(event: React.FormEvent<HTMLElement>, rating?: number) => { this.setState({ isModalOpen: true }); }}
                        allowZeroStars /> : <Rating rating={0} max={5} size={1}
                          disabled={false}
                          allowZeroStars onChange={(event: React.FormEvent<HTMLElement>, rating?: number) => { this.setState({ isModalOpen: true }); }} />}
                    </ul>
                  </div>
                  <div className="rating">
                    <span className="me-2 ms-2">{this.state.OfferData.Rating === 0 ? '' : Math.round(this.state.OfferData.Rating)}</span>
                  </div>
                </div>
                <p className="mt-3" dangerouslySetInnerHTML={{ __html: this.state.OfferData.Offer }}/>
              </div>
                {/* attachment     */}
              <div className="col-md-12">
                    <div className="offer-detials
                                        align-items-center mb-2">
                        <img className="float-start" src={require('../../../Shared/Assets/icons/file_present.svg')} alt="" />
                        <h6 className="f-links">Offer details</h6>
                        <div id="secAttachments" dangerouslySetInnerHTML={{ __html: this.GetAttachmentFiles(this.state.OfferData) }}/>
                      </div>
                      <div className="date-range-offer d-flex
                                        align-items-center">
                        <img src={require('../../../Shared/Assets/icons/date_range.svg')} alt="" />
                        <h6 className="f-links">Valid until: {new Date(this.state.OfferData.offer_x0020_end_x0020_date).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        }).replace(/ /g, ' ')}</h6>
                      </div>
                </div>
              </div>
            </div>
              <div className="col-md-6">
                  <div className="row">
                  <div className="col-md-12">
                <div className="section mt-5 mb-5">
                  <div className="row">
                    
                    {
                ((this.state.L1Access && (this.state.OfferData.Status === 'Submitted')) || (this.state.L2Access && (this.state.OfferData.Status === 'L1Approved'))) ?



                  
                    <div className="col-md-12">
                      <div className="row my-3">
                        <div className="col-md-4"><label className="pe-3" htmlFor="comments">Reason For Return</label></div>
                        <div className="col-md-8 d-flex">

                          <input className='comments w-100' type="text" id="comments" value={this.state.comments} onChange={(e) => this.setState({ comments: e.target.value })} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-check">
                            <input value={this.state.OfferData.vendorEmailChecked} onChange={(e) => this.setState({
                              OfferData: {
                                ...this.state.OfferData,
                                vendorEmailChecked: !this.state.OfferData.vendorEmailChecked
                              }
                            })} id="vendorNotification" type="checkbox" />
                            <label htmlFor="vendorNotification">Allow notification for Vendor</label>
                          </div>
                          <div className="form-check">
                            <input value={this.state.OfferData.EndUserEmailChecked} onChange={(e) => this.setState({
                              OfferData: {
                                ...this.state.OfferData,
                                EndUserEmailChecked: !this.state.OfferData.EndUserEmailChecked
                              }
                            })} type="checkbox" />
                            <label htmlFor="enduserNotification">Allow notification for End User</label>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button className='btn btn-success m-1' onClick={async () => { await this.changeOfferStatus('Approve') }}>Approve</button>
                          <button onClick={async () => { await this.changeOfferStatus('Returned') }} className='btn btn-info m-1'>Return</button>
                          <button onClick={async () => { await this.changeOfferStatus('Rejected') }} className='btn btn-danger m-1'>Reject</button>
                          
                        </div>
                      </div>
                    </div>
                  


                  : null
              }
                  </div>

                </div>
                  </div>
                  </div>
              </div>
            </div>
            

            {/* map */}
            <div className="row">
              
              
              <div className="col-md-12">
                <section className="jood-location mb-5">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="location-wrapper">
                        <div className="location mt-5">
                          <div className="content"></div>
                          <div id="googleMap" className="container-map">
                            <div id="map"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>




      </>

    );
  }
}
