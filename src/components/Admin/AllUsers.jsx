import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const refreshUsers = () => {
    dispatch(getAllUsers());
  };

  const handleDelete = async (record) => {
    if (record?.isProtectedAdmin) {
      toast.error("The oldest admin cannot be deleted");
      return;
    }

    try {
      const deletePath =
        record.entityType === "seller"
          ? `/shop/delete-seller/${record.entityId}`
          : `/user/delete-user/${record.entityId}`;
      const { data } = await axios.delete(`${server}${deletePath}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      refreshUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber || "");
    setAddress(user.address || "");
    setZipCode(user.zipCode || "");
    setDescription(user.description || "");
    setRole(user.entityType === "seller" ? "user" : user.actualRole || "user");
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    try {
      const isSeller = selectedUser.entityType === "seller";
      const updatePath = isSeller
        ? `/shop/admin/update-seller/${selectedUser.entityId}`
        : `/user/admin/update-user/${selectedUser.entityId}`;
      const updates = isSeller
        ? { name, email, phoneNumber, address, zipCode, description }
        : { name, email, phoneNumber, role };
      await axios.put(`${server}${updatePath}`, updates, {
        withCredentials: true,
      });
      toast.success(isSeller ? "Seller updated successfully" : "User updated successfully");
      setOpenEdit(false);
      refreshUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("role", role);
    if (avatar) {
      formData.append("file", avatar);
    }

    try {
      const { data } = await axios.post(`${server}/user/admin/create-user`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("User created successfully");
      setOpenAdd(false);
      setName("");
      setEmail("");
      setPhoneNumber("");
      setRole("user");
      setPassword("");
      setAvatar(null);
      refreshUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Create failed");
    }
  };

  const columns = [
    { field: "id", headerName: "Account ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "edit",
      flex: 0.8,
      minWidth: 130,
      headerName: "Edit Account",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleOpenEdit(params.row)}>
          <AiOutlineEdit size={20} />
        </Button>
      ),
    },
    {
      field: "delete",
      flex: 0.8,
      minWidth: 150,
      headerName: "Delete Account",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button
          disabled={params.row.isProtectedAdmin}
          title={
            params.row.isProtectedAdmin
              ? "The oldest admin cannot be deleted"
              : "Delete user"
          }
          onClick={() => {
            setSelectedRecord(params.row);
            setOpenDelete(true);
          }}
        >
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const row = [];
  users &&
    users.forEach((item) => {
      row.push({
        id: `${item.entityType}-${item._id}`,
        entityId: item._id,
        entityType: item.entityType,
        name: item.name,
        email: item.email,
        role: item.displayRole,
        actualRole: item.role,
        isProtectedAdmin: item.isProtectedAdmin,
        phoneNumber: item.phoneNumber || "",
        address: item.address || "",
        zipCode: item.zipCode || "",
        description: item.description || "",
        joinedAt: item.createdAt?.slice(0, 10) || "",
      });
    });

  const filteredRows = row.filter((item) =>
    [item.name, item.email, item.role]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-4">
          <h3 className="text-[22px] font-Poppins">All Accounts</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="px-3 py-2 border border-gray-300 rounded w-full sm:w-64"
            />
            <button
              className={`${styles.button} text-white text-[16px] !h-[42px]`}
              onClick={() => setOpenAdd(true)}
            >
              Add User
            </button>
          </div>
        </div>

        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>

        {openDelete && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpenDelete(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you want to delete this {selectedRecord?.entityType === "seller" ? "seller" : "user"}?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpenDelete(false)}
                >
                  cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => {
                    setOpenDelete(false);
                    handleDelete(selectedRecord);
                  }}
                >
                  confirm
                </div>
              </div>
            </div>
          </div>
        )}

        {openEdit && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpenEdit(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Edit {selectedUser?.entityType === "seller" ? "Seller" : "User"}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                {selectedUser?.entityType === "seller" ? (
                  <>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="ZIP Code"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </>
                ) : selectedUser?.isProtectedAdmin ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <input
                      type="text"
                      value="Super Admin"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                    />
                  </div>
                ) : (
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="user">Customer</option>
                    <option value="Admin">Admin</option>
                  </select>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    className={`${styles.button} text-white text-[16px] !h-[42px]`}
                    onClick={() => setOpenEdit(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${styles.button} text-white text-[16px] !h-[42px]`}
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {openAdd && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpenAdd(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">Add User</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="user">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="w-full"
                />
                <div className="flex justify-end gap-3">
                  <button
                    className={`${styles.button} text-white text-[16px] !h-[42px]`}
                    onClick={() => setOpenAdd(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${styles.button} text-white text-[16px] !h-[42px]`}
                    onClick={handleAdd}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
