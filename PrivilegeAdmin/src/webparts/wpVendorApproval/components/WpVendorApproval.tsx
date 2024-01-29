import * as React from 'react';

import { IWpVendorApprovalProps } from './IWpVendorApprovalProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp';
import { SPComponentLoader } from "@microsoft/sp-loader";
import { Web } from '@pnp/sp/webs';
import { Service_Business_Ar } from '../../../Shared/Common/Service_Business';
import './style.css'
export interface wpVendorApprovalState {
  VendorData: any,
  // breadcrumbNavArray: any,
  categoryArray: any;

  isModalOpen: boolean,
  L1Access: boolean,
  L2Access: boolean,
  //  VendorData:any,
  branches: any,
  allowVendorNotification: boolean,
  allowEnduserNotification: boolean,
  attachmentHtml: any,
  comments: any,
}
export default class WpVendorApproval extends React.Component<IWpVendorApprovalProps, wpVendorApprovalState, {}> {
  private _services_Business: Service_Business_Ar;
  constructor(props: IWpVendorApprovalProps, state: wpVendorApprovalState) {
    super(props);
    this.state = {
      branches: [],
      categoryArray: [],
      isModalOpen: false,
      VendorData: [],
      L1Access: false,
      L2Access: false,
      attachmentHtml: "",
      allowVendorNotification: false,
      allowEnduserNotification: false,
      comments: ""
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
    const vendorID = new URLSearchParams(url).get('vendorID')

    const web = Web(`${this.props.context.pageContext.site.absoluteUrl}/Privilegeportal`);
    const selectedData = await this._services_Business.getvendorItem(web, parseInt(vendorID));
    this.setState({ VendorData: selectedData })
    console.log(selectedData)
    const Branches = await this._services_Business.getBranchesbyID(vendorID);
    this.setState({ branches: Branches })


    const currentUser = this.props.context.pageContext.user.email


    await SPComponentLoader.loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC1W_DFBh_CQpP8xNBHSz5PLHO6QESWprw"
    ).then(async () => {
      console.log(this.state.VendorData)
      await this.BindCoordinates(this.state.branches, 'map');
    });

    await this.checkUserAuth(currentUser);

  }
  public async checkUserAuth(userEmail: string) {
    const L1Access = await this._services_Business.checkL1Access(userEmail);
    const L2Access = await this._services_Business.checkL2Access(userEmail);
    console.log(L1Access, L2Access)
    this.setState({ L1Access, L2Access })
  }
  private BindCoordinates = async (oItem, mapElement) => {
    //split
    const uluru = []

    await oItem.map((item, index) => {
      uluru.push({
        lat: parseFloat(item.Latitude),
        lng: parseFloat(item.Longitude)
      })
    })

    console.log(uluru)
    // oItem.Branches.map((item, index) => {
    //     uluru.push({
    //         lat: parseFloat(item.Latitude),
    //         lng: parseFloat(item.Longitude)
    //     })
    // });
    if (mapElement)
      this.initMap(uluru, mapElement);
  }
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
      const nextStatus = (this.state.VendorData.Status === 'Submitted') ? 'Approved' : "";
      console.log(nextStatus);
      const passData = {
        Status: nextStatus,
        ReturnComments: (this.state.comments === "") ? "N/A" : this.state.comments,
      }
      const updatesItem = await this._services_Business.updateVendorStatusbyId(passData, this.state.VendorData.ID)
      const notificationData = {
        Title: "Vendor",
        ListID: this.state.VendorData.ID,
        Status: nextStatus
      }
      const updateNotification = await this._services_Business.AddNotification(notificationData)
      window.location.reload()
      console.log(updatesItem)
    }
    else {
      const nextStatus = {
        Status: response,
        ReturnComments: (this.state.comments === "") ? "N/A" : this.state.comments,
      }
      const notificationData = {
        Title: "Vendor",
        ListID: this.state.VendorData.ID,
        Status: response
      }
      const updatesItem = await this._services_Business.updateVendorStatusbyId(nextStatus, this.state.VendorData.ID)
      const updateNotification = await this._services_Business.AddNotification(notificationData)
      window.location.reload()
      console.log(updatesItem)
    }
  }
  private GetAttachmentFiles = (offerItem) => {
    try {
      let fileHtml = '';
      offerItem.AttachmentFiles.map((item, index) => {

        fileHtml += "<div class='divAttachment maktabi-blue'><a target='_blank' href='" + item
          .ServerRelativeUrl + "'>" + item.FileName + "</a></div>";

      });

      return fileHtml
    }
    catch (e) {
      return '';
    }
  }

  public render(): React.ReactElement<IWpVendorApprovalProps> {
    const logoSrc=`${this.props.siteUrl}/EYo2KzNbUNNDmBWH98miSNEBtfg-ZfxhUuUaj9RyOL2k6A?e=mToeHn`
    return (
      <div className="container jood-home" id="scrolloffset">
        <section className="jood-details text-break" >
          {/* <h2 className="mt-3">{this.state.VendorData.Vendor?.Vendor_x002f_Branch_x0020_Name}</h2> */}


          <div className="row">
          <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <picture>
                    <img className='img-fluid' src={logoSrc} alt="" />
                  </picture>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <section className="jood-location">
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
            </div>
            <div className="col-md-6">
              <div className="section mt-5 mb-5">
                <div className="row">
                  
                  <div className="col-md-12">
                    <h4 className='maktabi-blue'>{this.state.VendorData.Group?.groupName}</h4>

                    <h4 className='maktabi-blue'>{this.state.VendorData.Vendor_x002f_Branch_x0020_Name}</h4>
                    <h6 className='maktabi-blue'>{this.state.VendorData.VendrOfficeTel}</h6>
                    <h6 className='maktabi-blue'>{this.state.VendorData.Address}</h6>
                    <h6 className='maktabi-blue'>{this.state.VendorData.VendorContactEmail}</h6>
                    <h6 className='maktabi-blue'>{this.state.VendorData.Address}</h6>

                  </div>
                  <div className="col-md-12 mt-3">
                    <div className="offer-detials
                                        align-items-center mb-2">
                      <img className="float-start" src={require('../../../Shared/Assets/icons/file_present.svg')} alt="" />
                      <h6 className="f-links">Attachments</h6>
                      <div id="secAttachments" dangerouslySetInnerHTML={{ __html: this.GetAttachmentFiles(this.state.VendorData) }}></div>
                    </div>
                  </div>
                  
                </div>


              </div>
              {
                ((this.state.L1Access && (this.state.VendorData.Status === 'Submitted')) || (this.state.L2Access && (this.state.VendorData.Status === 'L1Approved'))) ?

                  <>
                    <div className="row">
                      <div className="col-md-12 d-flex">
                        <label className="pe-3" htmlFor="comments">Reason For Return</label>
                        <input className='comments w-100' type="text" id="comments" value={this.state.comments} onChange={(e) => this.setState({ comments: e.target.value })} />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12 mt-2">

                        <button className='btn btn-success m-1' onClick={async () => { await this.changeOfferStatus('Approve') }}>Approve</button>
                        <button onClick={async () => { await this.changeOfferStatus('Returned') }} className='btn btn-info m-1'>Return</button>
                        <button onClick={async () => { await this.changeOfferStatus('Rejected') }} className='btn btn-danger m-1'>Reject</button>
                        
                        

                      </div>

                    </div>
                  </>
                  : null
              }
            </div>
            
          </div>


        </section >

      </div >
    );
  }
}
