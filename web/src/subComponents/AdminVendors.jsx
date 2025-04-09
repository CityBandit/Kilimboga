import DataTable from 'react-data-table-component';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import Database from '../js/db.js'

const db = new Database()

function AdminVendors(){
    const [showTable, setShowTable] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(
        {
            "_id": "67dc5d07bb2d7175a2b4d65e",
            "firstName": "John",
            "lastName": "Doe",
            "email": "johndoe@gmail.com",
            "phoneNumber": "0712345678",
            "location": {
              "type": "Point",
              "coordinates": [34.75229, 0.28422],
              "_id": "67dc5d07bb2d7175a2b4d65f"
            },
            "role": "expert",
            "isVerified": true,
            "isSpecial": true,
            "isApproved": true,
            "documents": "https://res.cloudinary.com/dqrw1zi7d/image/upload/v1742494984/kilimboga/iajwnt3lyvxro1vuprvg.pdf",
            "imageUrl": null,
            "joined": "2025-03-20T18:16:50.535Z",
            "__v": 0
    });
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')))
    const [tdata, setTdata] = useState([])
    const [columns, setColumns] = useState([
        {
            name: 'First Name',
            selector: row => row.firstName,
        },
        {
            name: 'Last Name',
            selector: row => row.lastName,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'id',
            selector: row => row.id,
            omit: true
        },
        {
            name: '',
            cell: row => (
                <button
                    className='bg-gray-500 cursor-pointer text-white rounded-full px-4 py-2 text-base'
                    onClick={async () => {
                        const res = await db.getAdminUser(token, row.id)
                        setFormData(res.data)
                        showFormFn()
                    }}
                >
                    Edit
                </button>
            ),
            selector: row => row.action,
        },
    ])
    const [approved, setApproved] = useState(true)

    function showTableFn(){
        setShowTable(true)
        setShowForm(false)
    }

    function showFormFn(){
        setShowTable(false)
        setShowForm(true)
    }

    useEffect(()=>{
        async function getData(){
            const res = await db.getAdminUsers(token, 'vendor', approved)
            console.log(res)
            setTdata( res.data.users.map((item)=>{
                return {
                    firstName: item.firstName,
                    lastName: item.lastName,
                    email: item.email,
                    id: item._id
                }
            })) 
        }
        getData()
    },[])

  
    const [selectedRows, setSelectedRows] = useState([]);
	const [toggleCleared, setToggleCleared] = useState(false);
	const [data, setData] = useState(tdata);

    const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

    const contextActions = useMemo(() => {
		const handleDelete = () => {

			// TO DO: Delete selected rows from the database

			if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.title)}?`)) {
				setToggleCleared(!toggleCleared);
				setData(differenceBy(data, selectedRows, 'name'));
			}
		};

		return (
			<button key="delete" onClick={handleDelete} className='bg-red-500 text-white rounded px-5 py-1 mr-3 cursor-pointer'>
				Delete
			</button>
		);
	}, [data, selectedRows, toggleCleared]);

    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#D1D5DB',
            },
        },
        headCells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: '#D1D5DB',
                    fontSize: '16px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: '#D1D5DB',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                    fontSize: '16px',
                },
            },
        },
    };

    const handleVendorEditForm = (e) => {
        e.preventDefault()
        const { name, value } = e.target;

        // TO DO: validate form data

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleVendor = (action) => {
        switch(action){
            case 'approve':
                // TO DO: approve vendor
                showTableFn()
                break;
            case 'delete':
                // TO DO: delete vendor
                showTableFn()
                break;
            case 'suspend':
                // TO DO: suspend vendor
                showTableFn()
                break;
            default:
                showTableFn()
                break;
        }
    }

    return (
        <>
            {showTable ? (
                
                    <div className="px-10 py-3 bg-white">
                        <DataTable
                            className=''
                            title={'Vendors'}
                            columns={columns}
                            data={tdata}
                            pagination
                            selectableRows
                            contextActions={contextActions}
                            onSelectedRowsChange={handleRowSelected}
                            clearSelectedRows={toggleCleared}
                            customStyles={customStyles}
                            dense
                        />
                    </div>
                
            ):(null)}

            {showForm ? (
                <>
                <button className='mt-3 ml-10 mb-3 rounded-full ring-1 ring-gray-300 cursor-pointer p-1' onClick={showTableFn}><IoMdArrowRoundBack /></button>
                
                <div className="mt-3 mx-10 ring-1 ring-gray-300 p-5 rounded">
                    <h3 className='text-base font-semibold'>Documents</h3>
                    <ol className='mb-3'>
                        <li><a href={formData.documents} className='text-sm cursor-pointer text-blue-600' target='_blank'>KRA certificate</a></li>
                    </ol>

                    <form className="w-full grid grid-cols-2 gap-4 text-sm" action="">
                        <div className="flex flex-col">
                            <label htmlFor="firstName">First Name</label>
                            <input value={formData.firstName} onChange={handleVendorEditForm} className="rounded p-1 px-3 mt-2 border-1 border-gray-300 outline-0" type="text" id="firstName" name="firstName" />
                            <p className="error text-red-500 mt-2"></p>
                        </div>
        
                        <div className="flex flex-col">
                            <label htmlFor="lastName">Last Name</label>
                            <input value={formData.lastName} onChange={handleVendorEditForm} className="rounded p-1 px-3 mt-2 border-1 border-gray-300 outline-0" type="text" id="lastName" name="lastName" />
                            <p className="error text-red-500 mt-2"></p>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email">Email</label>
                            <input value={formData.email} onChange={handleVendorEditForm} className="rounded p-1 px-3 mt-2 border-1 border-gray-300 outline-0" type="text" id="email" name="email" />
                            <p className="error text-red-500 mt-2"></p>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input value={formData.phoneNumber} onChange={handleVendorEditForm} className="rounded p-1 px-3 mt-2 border-1 border-gray-300 outline-0" type="text" id="phoneNumber" name="phoneNumber" />
                            <p className="error text-red-500 mt-2"></p>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="longitude">Longitude</label>
                            <input value={formData.location.coordinates[1]} onChange={handleVendorEditForm} className="rounded p-1 px-3 mt-2 border-1 border-gray-300 outline-0" type="text" id="longitude" name="longitude" />
                            <p className="error text-red-500 mt-2"></p>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="latitude">Latitude</label>
                            <input value={formData.location.coordinates[0]} onChange={handleVendorEditForm} className="rounded p-1 px-3 mt-2 border-1 border-gray-300 outline-0" type="text" id="latitude" name="latitude" />
                            <p className="error text-red-500 mt-2"></p>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="documents">Supporting document</label>
                            <input className="rounded p-1 px-3 mt-2 border-1 border-gray-300 outline-0" type="file" id="documents" name="documents" accept="jpg" />
                            <p className="error text-red-500 mt-2"></p>
        
                        </div>
        
                        <div className="flex flex-col">
                            <label htmlFor="role">Role</label>
                            <select value={formData.role} onChange={handleVendorEditForm} className="rounded p-1 px-3 mt-2 border-1 border-gray-300 outline-0" name="role" id="role">
                                <option value="vendor">Vendor</option>
                                <option value="farmer">Farmer</option>
                                <option value="expert">Expert</option>
                            </select>
                            <p className="error text-red-500 mt-2"></p>
                        </div>
                    </form>
                    <div className="flex justify-between items-center">
                        <button onClick={() => {handleVendor('delete')}} className="mt-5 px-6 py-1 cursor-pointer bg-red-800 hover:bg-red-700 text-white text-sm rounded">Delete</button>
                        <div>
                            <button onClick={() => {handleVendor('suspend')}} className="mt-5 mr-5 px-6 py-1 cursor-pointer bg-gray-800 hover:bg-gray-700 text-white text-sm rounded">Suspend</button>
                            <button onClick={() => {handleVendor('approve')}} className="mt-5 px-6 py-1 cursor-pointer bg-green-800 hover:bg-green-700 text-white text-sm rounded">Approve</button>
                        </div>
                    </div>
                </div>
                </>

                
            ):(null)}
        </>
    );
}

export default AdminVendors