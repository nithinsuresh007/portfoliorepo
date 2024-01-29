import * as React from "react";



// Now you can use fsPromises.readFile(), fsPromises.writeFile(), etc.


import { DetailsList, DetailsListLayoutMode, IColumn, CommandBarButton, DetailsRow, Modal, mergeStyleSets, getTheme, FontWeights } from '@fluentui/react';
// import { Pagination } from "../../../../Shared/Components/Pagination";


window['jQuery'] = jQuery;

window['jQuery'] = jQuery;
window['$'] = jQuery;
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net';

const TableDetails = [
    {
        fieldName: "ID",
        ListColumn: "ID",
        headerName: "Vendor ID",
        lookupColumn: "",
        lookup: 0
    },
    {
        fieldName: "vendorName",
        ListColumn: "Vendor_x002f_Branch_x0020_Name",
        headerName: "Vendor Name",
        lookupColumn: "",
        lookup: 0
    },
    {
        fieldName: "group",
        ListColumn: "Group",
        headerName: "Group Name",
        lookupColumn: "groupName",
        lookup: 1
    },
    {
        fieldName: "vendoremail",
        ListColumn: "VendorContactEmail",
        headerName: "Vendor Email",
        lookupColumn: "",
        lookup: 0
    },
    {
        fieldName: "vendortelephone",
        ListColumn: "VendrOfficeTel",
        headerName: "Vendor Office Telephone",
        lookupColumn: "",
        lookup: 0
    },
    {
        fieldName: "creationdate",
        ListColumn: "Created",
        headerName: "Creation Date",
        lookupColumn: "",
        lookup: 2
    },
    {
        fieldName: "requestedby",
        ListColumn: "Author",
        headerName: "Requested By",
        lookupColumn: "Title",
        lookup: 1
    },
    {
        fieldName: "status",
        ListColumn: "Status",
        headerName: "Status",
        lookupColumn: "",
        lookup: 0
    },
    {
        fieldName: "Active",
        ListColumn: "Active",
        headerName: "Active",
        lookupColumn: "",
        lookup: 0
    }
]




export interface IVendorListState {
    FinalVendors: any,
    DetailsListColumns: any,
    DetailsListItems: any,
    page: number;
    rowsPerPage: number;

    NewOfferModal: boolean,

    columnToExport: any,

}

export interface VendorListProps {
    siteurl: string,
    serviceObject: any,
    setViewEditFunction: any,
}
//TABLE Details >>>>>Map Header and list values >>>>>.




export default class VendorList extends React.Component<
    VendorListProps,
    IVendorListState>
{

    private tmpthis;
    constructor(props: VendorListProps, state: IVendorListState) {
        super(props)
        this.state = {
            FinalVendors: [],
            DetailsListColumns: [],
            DetailsListItems: [],
            rowsPerPage: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 8 : 20,
            page: 1,
            NewOfferModal: false,

            columnToExport: [],



        }
        this.LoadEditPage = this.LoadEditPage.bind(this);
        this.deleteOffer = this.deleteOffer.bind(this);
        this.setViewEditPageLoadData = this.setViewEditPageLoadData.bind(this);

        this.tmpthis = this;


    }
    async componentDidMount(): Promise<void> {
        const VendorList = await this.props.serviceObject.getPrivilegeFinalVendors();
        await this.setState({ FinalVendors: VendorList })

        console.log(this.state.FinalVendors);

        const OfferItemsColumn = await this.props.serviceObject.renderColumn(TableDetails);
        const OfferItemsRow = await this.props.serviceObject.renderRows(this.state.FinalVendors, TableDetails);
        await this.setState({
            DetailsListColumns: OfferItemsColumn,
            DetailsListItems: OfferItemsRow
        })
        $('#vendorDataTable').DataTable(
            { columnDefs: [
                {
                  targets: [7], // Column index to disable sorting
                  orderable: false,
                },
              ]}
        );

        this.setState({ columnToExport: OfferItemsColumn });

        // let Columnlength = OfferItemsColumn.length
        // console.log(OfferItemsColumn)
        // OfferItemsColumn.push({
        //     key: `column ${Columnlength + 1}`, name: "Edit/Copy", fieldName: 'edit-copy', minWidth: 100, maxWidth: 200, isResizable: true,
        //     onRender: (item: any) => (

        //         <>

        //             <button onClick={() => this.setViewEditPageLoadData(item.id, 1)}>
        //                 View
        //             </button>
        //             <button onClick={() => this.setViewEditPageLoadData(item.id, 2)}>
        //                 Edit
        //             </button>
        //             <button >
        //                 Active
        //             </button>
        //         </>
        //     ),
        // })

        
        console.log('jQuery version:', $.fn.jquery);
        console.log('DataTable initialized?', $.fn.DataTable.isDataTable('#vendorDataTable'));
        console.log(this.state.DetailsListItems)
        console.log(this.state.DetailsListItems)
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
        await this.props.serviceObject.exportToExcelWorkBook(this.state.DetailsListItems, this.state.columnToExport, 'QF Maktabi - PrivilegeAdmin')
    }

    public setViewEditPageLoadData = async (Id, pageCondition) => {

        await this.props.setViewEditFunction(this.state.FinalVendors, Id, pageCondition);
    }

    public ChangeActive= async(id,status) =>{
        const userConfirmation = window.confirm(`Are You Sure You Want to ${(status)?"Deactivate":"Activate"}?`)

        if(userConfirmation){
            const datachanged=await this.props.serviceObject.setVendorInactive(id,status);
        const tempArray=[];
        $('#vendorDataTable').DataTable().destroy();
        const catchvalue=await this.state.DetailsListItems.map((item,index)=>{
            if(id===item.ID){
                tempArray.push({
                    ...item,
                    Active:!status
                })
            }
            else{
                tempArray.push(item)
            }
        })
        this.setState({DetailsListItems:tempArray})
        $('#vendorDataTable').DataTable(
            { columnDefs: [
                {
                  targets: [7], // Column index to disable sorting
                  orderable: false,
                },
              ]}
        );
        }
        
    }



    public render(): React.ReactElement<VendorListProps> {

        const filteredItems = this.state.DetailsListItems ? this.paginateFn(this.state.DetailsListItems) : [];
        return (
            <>
                
                <div className="container-fluid" style={{marginTop:'20px', fontSize:'12px'}}>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <button className="btn btn-primary btn-sm btn-success" onClick={() => this.exportExcelOnclick()} id='btnGetOffers'>
                                Export
                        </button>
                    </div>
                </div>

                    <table className="table table-hover" id="vendorDataTable">
                        <thead>
                            <tr>
                                <th>Vendor Name</th>
                                <th>Group Name</th>
                                <th>Vendor Email</th>
                                <th>Vendor Office Telephone</th>
                                <th>Creation Date</th>
                                <th>Created By</th>
                                <th>Status</th>
                                <th>Edit/Copy</th>
                            </tr>
                        </thead>
                        <tbody className="text-break">
                            {
                                this.state.DetailsListItems.map((item, index) => {
                                    return (
                                        <tr>                                        
                                            <td>{item.vendorName}</td>
                                            <td>{item.group}</td>
                                            <td>{item.vendoremail}</td>
                                            <td>{item.vendortelephone}</td>
                                            <td>{item.creationdate}</td>
                                            <td>{item.requestedby}</td>
                                            <td>{item.status}</td>
                                            <td>
                                                <button title="View" className="me-1 mb-1 btn btn-primary btn-sm " onClick={() => this.setViewEditPageLoadData(item.ID, 1)}>
                                                <i className="ms-Icon ms-Icon--RedEye" aria-label="DropIcon"></i>
                                                </button>
                                                <button title="Edit" className="me-1 mb-1 btn btn-primary btn-sm" onClick={() => this.setViewEditPageLoadData(item.ID, 2)}>
                                                <i className="ms-Icon ms-Icon--Edit" aria-label="DropIcon"></i>
                                                </button>
                                                <button title={(item.Active)?"Deactivate":"Activate"} onClick={()=>this.ChangeActive(item.ID,item.Active)} className={(item.Active)?"me-1 mb-1 btn btn-primary btn-sm btn-danger":"me-1 mb-1 btn btn-primary btn-sm btn-success" }>
                                                <i className="nav-icon icon-power" aria-label="DropIcon"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )

                                })
                            }
                        </tbody>
                    </table>
                </div>
               

            </>
        )
    }
}






const theme = getTheme();

function FinalVendors(FinalVendors: any, VendorList: any) {
    throw new Error("Function not implemented.");
}
