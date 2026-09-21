import React, { useEffect, useState } from "react";
import { AiOutlineBell, AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { backend_url } from "../../../server";
import { imageUrl } from "../../../utils/imageUrl";
import { getAllOrdersOfShop } from "../../../redux/actions/order";

const DashboardHeader = () => {
    const dispatch = useDispatch();
    const { seller } = useSelector((state) => state.seller);
    const { orders } = useSelector((state) => state.order);
    const [openNotifications, setOpenNotifications] = useState(false);

    useEffect(() => {
        if (seller && seller._id) {
            dispatch(getAllOrdersOfShop(seller._id));
        }
    }, [dispatch, seller]);

    const notificationCount = orders
        ? orders.filter((order) => order.status !== "Processing").length
        : 0;

    return (
        <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
            <div>
                <Link to="/dashboard">
                    <img
                        src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                        alt=""
                    />
                </Link>
            </div>
            <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <Link to="/dashboard/cupouns" className="800px:block hidden">
                        <AiOutlineGift
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to="/dashboard-events" className="800px:block hidden">
                        <MdOutlineLocalOffer
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to="/dashboard-products" className="800px:block hidden">
                        <FiShoppingBag
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to="/dashboard-orders" className="800px:block hidden">
                        <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
                    </Link>
                    <div
                        className="800px:block hidden relative"
                        onClick={() => setOpenNotifications((value) => !value)}
                    >
                        <AiOutlineBell color="#555" size={30} className="mx-5 cursor-pointer" />
                        {notificationCount > 0 ? (
                            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#3bc177] px-1.5 text-[12px] text-white">
                                {notificationCount}
                            </span>
                        ) : null}
                        {openNotifications && (
                            <div className="absolute right-0 top-10 z-50 w-80 rounded-md bg-white p-3 text-gray-800 shadow-lg">
                                <h3 className="border-b pb-2 font-semibold">Notifications</h3>
                                {orders && orders.length > 0 ? orders.slice(0, 6).map((order) => (
                                    <Link
                                        key={order._id}
                                        to="/dashboard-orders"
                                        onClick={() => setOpenNotifications(false)}
                                        className="block border-b py-2 text-sm hover:bg-gray-50"
                                    >
                                        Order {order._id.slice(-6)}: {order.status}
                                    </Link>
                                )) : (
                                    <p className="py-3 text-sm text-gray-500">No notifications yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                    <Link to="/dashboard-messages" className="800px:block hidden">
                        <BiMessageSquareDetail
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to={`/shop/${seller._id}`}>
                        <img
                            src={imageUrl(seller.avatar)}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;