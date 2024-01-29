import * as React from "react";



// Now you can use fsPromises.readFile(), fsPromises.writeFile(), etc.


import { DetailsList, DetailsListLayoutMode, IColumn, CommandBarButton, DetailsRow, Modal, mergeStyleSets, getTheme, FontWeights, DayOfWeek, DatePicker } from '@fluentui/react';
// import { Pagination } from "../../../../Shared/Components/Pagination";


import * as jQuery from 'jquery';
window['jQuery'] = jQuery;

window['jQuery'] = jQuery;
window['$'] = jQuery;
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net';
import { left } from "@popperjs/core";
import moment from "moment";



const TableDetails = [
    {
        fieldName: "id",
        ListColumn: "ID",
        headerName: "Offer ID",
        lookupColumn: "",
        lookup: 0
    },
    {
        fieldName: "offerType",
        ListColumn: "Offer_x0020_Title",
        headerName: "Offer Type",
        lookupColumn: "",
        lookup: 0
    },
    {
        fieldName: "offerTitle",
        ListColumn: "offer0",
        headerName: "Offer Title",
        lookupColumn: "",
        lookup: 0
    },
    {
        fieldName: "startdate",
        ListColumn: "offer_x0020_start_x0020_date",
        headerName: "Offer Start Date",
        lookupColumn: "",
        lookup: 2
    },
    {
        fieldName: "enddate",
        ListColumn: "offer_x0020_end_x0020_date",
        headerName: "Offer End Date",
        lookupColumn: "",
        lookup: 2
    },
    {
        fieldName: "group",
        ListColumn: "Group",
        headerName: "Group",
        lookupColumn: "groupName",
        lookup: 1
    },
    {
        fieldName: "vendor",
        ListColumn: "Vendor",
        headerName: "Vendor",
        lookupColumn: "Vendor_x002f_Branch_x0020_Name",
        lookup: 1
    },
    {
        fieldName: "category",
        ListColumn: "L1Category",
        headerName: "Category",
        lookupColumn: "Categories",
        lookup: 1
    },
    {
        fieldName: "subcategory",
        ListColumn: "L2Categories",
        headerName: "Sub Category",
        lookupColumn: "subCategories",
        lookup: 1
    },
    {
        fieldName: "subsubcategory",
        ListColumn: "L3Categories",
        headerName: "Sub Sub Category",
        lookupColumn: "subSubCategories",
        lookup: 1
    },
    {
        fieldName: "created",
        ListColumn: "Created",
        headerName: "Creation Date",
        lookupColumn: "",
        lookup: 2
    },
    {
        fieldName: "status",
        ListColumn: "Status",
        headerName: "Status",
        lookupColumn: "",
        lookup: 0
    },






]




export interface IOfferListState {
    FinalOffers: any,
    DetailsListColumns: any,
    DetailsListItems: any,
    page: number;
    rowsPerPage: number;

    NewOfferModal: boolean,

    columnToExport: any,


    filterStartDate:any,
    filterEndDate:any

}

export interface OfferListProps {
    siteurl: string,
    serviceObject: any,
    setViewEditFunction: any,
    createNewOffer:any,
}
//TABLE Details >>>>>Map Header and list values >>>>>.




export default class OfferList extends React.Component<
    OfferListProps,
    IOfferListState>
{

    private tmpthis;
    constructor(props: OfferListProps, state: IOfferListState) {
        super(props)
        this.state = {
            FinalOffers: [],
            DetailsListColumns: [],
            DetailsListItems: [],
            rowsPerPage: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 8 : 20,
            page: 1,
            NewOfferModal: false,

            columnToExport: [],

            filterStartDate:"",
    filterEndDate:""

        }
        this.LoadEditPage = this.LoadEditPage.bind(this);
        this.deleteOffer = this.deleteOffer.bind(this);
        this.setViewEditPageLoadData = this.setViewEditPageLoadData.bind(this);

        this.tmpthis = this;


    }
    async componentDidMount(): Promise<void> {
        const OFFERLIST = await this.props.serviceObject.getPrivilegeFinalOffers();
        await this.setState({ FinalOffers: OFFERLIST })

        console.log(this.state.FinalOffers);

        const OfferItemsColumn = await this.props.serviceObject.renderColumn(TableDetails);
        const OfferItemsRow = await this.props.serviceObject.renderRows(this.state.FinalOffers, TableDetails)
        this.setState({
            DetailsListColumns: OfferItemsColumn,
            DetailsListItems: OfferItemsRow
        })
        $('#offerDataTable').DataTable(
           { columnDefs: [
                {
                  targets: [11], // Column index to disable sorting
                  orderable: false,
                },
              ],

              "lengthMenu": [10, 15, 20, 25],
              
             
            }
              

        );
        console.log('jQuery version:', $.fn.jquery);
        console.log('DataTable initialized?', $.fn.DataTable.isDataTable('#offerDataTable'));
        console.log(this.state.DetailsListItems)

        this.setState({ columnToExport: OfferItemsColumn });


        
       

        
    }

    private paginateFn = (filteredItem: any[]) => {
        const { rowsPerPage, page } = this.state;
        return rowsPerPage > 0
            ? filteredItem.slice(
                (page - 1) * rowsPerPage,
                (page - 1) * rowsPerPage + rowsPerPage
            )
            : filteredItem;
    };

    private handlePaginationChange(pageNo: number, rowsPerPage: number) {
        this.setState({ page: pageNo, rowsPerPage: rowsPerPage });

        //this.scrollDown();
    }

    public LoadEditPage = (Id: number) => {
        // load edit modal and load the data

    }
    public async deleteOffer(Id: number) {
        const userConfirmation = window.confirm("Are You Sure You Want to Delete?")

        if (userConfirmation) {
            await this.props.serviceObject.deleteOffer(Id);
        }
    }


    public exportExcelOnclick = async () => {
        console.log("exporting data>>>")
        await this.props.serviceObject.exportToExcelWorkBook(this.state.DetailsListItems, this.state.columnToExport, 'QF Maktabi - PrivilegeAdmin')
    }

    public setViewEditPageLoadData = async (Id, pageCondition) => {

        await this.props.setViewEditFunction(this.state.FinalOffers, Id, pageCondition);
    }

    public setFilteredArray = async()=>{

         $('#offerDataTable').DataTable().destroy();
        
        if(this.state.filterStartDate===""||this.state.filterEndDate===""){
            return
        }

        const filteredArray= await this.props.serviceObject.filterByDateRange(this.state.DetailsListItems,this.state.filterStartDate,this.state.filterEndDate,"enddate");
        

        this.setState({DetailsListItems:filteredArray});
        $('#offerDataTable').DataTable(
            { columnDefs: [
                {
                  targets: [11], // Column index to disable sorting
                  orderable: false,
                },
              ]}
        );
        console.log(this.state.DetailsListItems)
       
    }






    public render(): React.ReactElement<OfferListProps> {

        const filteredItems = this.state.DetailsListItems ? this.paginateFn(this.state.DetailsListItems) : [];



        return (
            <>
                
                <div className="container-fluid" style={{marginTop:'20px', fontSize:'12px'}}>
                
                <div className="row get-offer-row">
                <div className="col-sm-12">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <p className="m-0 pe-2 ">
                            Offer End Date - From
                            </p>
                            <DatePicker
                                    firstDayOfWeek={DayOfWeek.Sunday}
                                    placeholder=""
                                    ariaLabel="Select a date"
                                    onSelectDate={(date) => {
                                        { this.setState({ filterStartDate: date }, () => console.log(`${moment(this.state.filterStartDate).format('YYYY-MM-DD')}T00:00:00Z`)) }
                                    }}
                                    value={this.state.filterStartDate}
                                    formatDate={(date)=>`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`}
                                    id="startDate"
                        
                        
                                />
                                <p className="m-0 px-2">
                                To
                            </p>
                            <DatePicker
                                        firstDayOfWeek={DayOfWeek.Sunday}
                                        placeholder=""
                                        ariaLabel="Select a date"
                                        onSelectDate={(date) => {
                                            { this.setState({ filterEndDate: date }, () => console.log(`${moment(this.state.filterEndDate).format('YYYY-MM-DD')}T00:00:00Z`)) }
                                        }}
                                        value={this.state.filterEndDate}
                                        formatDate={(date)=>`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`}
                                        id="startDate"
                                        style={{border:1}}
                                        minDate={this.state.filterStartDate}
                                    />
                                    <button className="btn btn-primary ms-2" onClick={ ()=> this.setFilteredArray()}>
                                Get Offers
                            </button>
                        </div>
                        <div>
                        <button className='btn btn-primary btn-new-Offer' onClick={()=>this.props.createNewOffer()}>Create New Offer</button>
                        </div>
                    </div>
                </div>
                
                
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <button className="btn btn-primary btn-sm btn-success" style={{marginBottom:'20px'}} onClick={()=>this.exportExcelOnclick()} id='btnGetOffers'>
                             Export
                        </button>
                    </div>
                </div>
                    <table className="table table-hover" id="offerDataTable">
                        <thead>
                            <tr>
                                
                                <th>Offer Type</th>
                                <th>Offer Title</th>
                                <th>Offer Start Date</th>
                                <th>Offer End Date</th>
                                <th>Group</th>
                                <th>Vendor</th>
                                <th>Category</th>
                                <th>Sub Category</th>
                                <th>Sub Sub Category</th>
                                <th>Creation Date</th>
                                <th>Status</th>
                                <th>Edit/Copy</th>
                            </tr>
                        </thead>
                        <tbody className="text-break">
                            {
                                (this.state.DetailsListItems)?
                                this.state.DetailsListItems.map((item, index) => {
                                    return (
                                        <tr>
                                            
                                            <td>{item.offerType}</td>
                                            <td>{item.offerTitle}</td>
                                            <td>{item.startdate}</td>
                                            <td>{item.enddate}</td>
                                            <td>{item.group}</td>
                                            <td>{item.vendor}</td>
                                            <td>{item.category}</td>
                                            <td>{item.subcategory}</td>
                                            <td>{item.subsubcategory?item.subsubcategory:""}</td>
                                            <td>{item.created}</td>
                                            <td>{item.status}</td>
                                            <td>
                                                <div >
                                                    <button title="View" className="me-1 mb-1 btn btn-primary btn-sm" onClick={() => this.setViewEditPageLoadData(item.id, 1)}>
                                                    <i className="ms-Icon ms-Icon--RedEye" aria-label="DropIcon"></i>
                                                    </button>
                                                    <button title="Edit" className="me-1 mb-1 btn btn-primary btn-sm" onClick={() => this.setViewEditPageLoadData(item.id, 2)}>
                                                    <i className="ms-Icon ms-Icon--Edit" aria-label="DropIcon"></i>
                                                    </button>
                                                    <button title="Renew" className="me-1 mb-1 btn btn-primary btn-sm btn-success" onClick={() => this.setViewEditPageLoadData(item.id, 3)}>
                                                    <i className="ms-Icon ms-Icon--PublicCalendar" aria-label="DropIcon"></i>
                                                    </button>
                                                    <button title="Delete" className="me-1 mb-1 btn btn-primary btn-sm btn-danger" onClick={() => this.deleteOffer(item.id)}>
                                                    <i className="ms-Icon ms-Icon--Delete" aria-label="DropIcon"></i>
                                                    </button>
                                                    
                                                    
                                                    
                                                </div>
                                            </td>
                                        </tr>
                                    )

                                }):
                                null
                            }
                        </tbody>
                    </table>
                </div>

            </>
        )
    }
}






const theme = getTheme();

function FinalOffers(FinalOffers: any, OFFERLIST: any) {
    throw new Error("Function not implemented.");
}
