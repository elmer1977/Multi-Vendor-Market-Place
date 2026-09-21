import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllSellers());
  };

  const handleOpenEdit = (seller) => {
    setSelectedSeller(seller);
    setName(seller.name || "");
    setEmail(seller.email || "");
    setDescription(seller.description || "");
    setAddress(seller.address || "");
    setPhoneNumber(seller.phoneNumber || "");
    setZipCode(seller.zipCode || "");
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${server}/shop/admin/update-seller/${selectedSeller._id}`,
        { name, email, description, address, phoneNumber, zipCode },
        { withCredentials: true }
      );
      toast.success("Seller updated successfully");
      setOpenEdit(false);
      dispatch(getAllSellers());
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },

    {
      field: "edit",
      flex: 1,
      minWidth: 130,
      headerName: "Edit Seller",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleOpenEdit(params.row.seller)}>
          <AiOutlineEdit size={20} />
        </Button>
      ),
    },
    {
      field: "name",
      headerName: "name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "address",
      headerName: "Seller Address",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "joinedAt",
      headerName: "joinedAt",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "  ",
      flex: 1,
      minWidth: 150,
      headerName: "Preview Shop",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/shop/preview/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Delete Seller",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpen(true)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        seller: item,
        name: item?.name,
        email: item?.email,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Users</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you wanna delete this user?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => setOpen(false) || handleDelete(userId)}
                >
                  confirm
                </div>
              </div>
            </div>
          </div>
        )}
        {openEdit && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[55%] max-h-[90vh] overflow-y-auto bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpenEdit(false)} />
              </div>
              <h3 className="text-[25px] text-center pb-5 font-Poppins">
                Edit Seller
              </h3>
              <div className="grid grid-cols-1 800px:grid-cols-2 gap-3">
                <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
                <input className={styles.input} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
                <input className={styles.input} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone number" />
                <input className={styles.input} value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP code" />
                <textarea className={`${styles.input} 800px:col-span-2`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
              </div>
              <div className="flex justify-center mt-5">
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
