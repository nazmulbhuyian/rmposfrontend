import NoDataFound from "@/shared/NoDataFound/NoDataFound";
import Pagination from "../common/pagination/Pagination";

import { useEffect, useState } from "react";
import TableLoadingSkeleton from "../common/loadingSkeleton/TableLoadingSkeleton";
import { CiMenuKebab } from "react-icons/ci";
import { BASE_URL } from "@/utils/baseURL";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import {
  FaDownload,
  FaEye,
  FaFileDownload,
  FaRegFilePdf,
} from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import OrderUpDateModal from "./OrderUpDateModal";
import { CSVLink } from "react-csv";
import { DateTimeFormat } from "@/utils/dateTimeFormet";
import {
  Document as PDFDocument,
  Page,
  StyleSheet,
  Text,
  View,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import MiniSpinner from "@/shared/MiniSpinner/MiniSpinner";

const styles = StyleSheet.create({
  totalText: {
    fontWeight: "semibold",
    fontSize: "10px",
    color: "black",
  },
});

const OrderTable = ({
  setPage,
  setLimit,
  page,
  limit,
  totalData,
  refetch,
  user,
  isLoading,
  orders,
}) => {
  const [serialNumber, setSerialNumber] = useState();
  const [orderDocumentModal, setOrderDocumentModal] = useState(null);
  const [orderUpdateModal, setOrderUpdateModal] = useState(false);
  const [orderUpdateModalData, setOrderUpdateModalData] = useState({});

  useEffect(() => {
    const newSerialNumber = (page - 1) * limit;
    setSerialNumber(newSerialNumber);
  }, [page, limit]);

  const handleShowDocumentModal = (id) => {
    setOrderDocumentModal((prevId) => (prevId === id ? null : id));
  };

  // Close modal on outside click
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleOutsideClick = (event) => {
  //       if (!event.target.closest(".modal-container")) {
  //         setOrderDocumentModal(null);
  //       }
  //     };
  //     document.addEventListener("mousedown", handleOutsideClick);
  //     return () => {
  //       document.removeEventListener("mousedown", handleOutsideClick);
  //     };
  //   }
  // }, []);

  //Handle Order update  Function

  const handleOrderUpdate = (order) => {
    setOrderUpdateModal(true);
    setOrderUpdateModalData(order);
  };

  //   handle order status
  const handleOrderStatus = async (
    order_status,
    _id,
    orders,
    customer_id,
    grand_total_amount
  ) => {
    try {
      const sendData = {
        _id: _id,
        order_status: order_status,
        order_updated_by: user?._id,
        order_status_update: true,
        customer_id: customer_id,
        grand_total_amount: grand_total_amount,
        order_orders: orders?.map((item) => ({
          order_id: item?.order_id?._id,
          order_quantity: item?.order_quantity,
          product_price: item?.product_price,
          product_buying_price: item?.product_buying_price,
          product_total_price: item?.product_total_price,
        })),
      };

      const response = await fetch(`${BASE_URL}/order?role_type=order_update`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      const result = await response.json();
      if (result?.statusCode === 200 && result?.success === true) {
        toast.success(
          result?.message ? result?.message : "Status Update successfully",
          {
            autoClose: 1000,
          }
        );
        refetch();
      } else {
        toast.error(result?.message || "Something went wrong", {
          autoClose: 1000,
        });
        refetch();
      }
    } catch (error) {
      toast.error(error?.message, {
        autoClose: 1000,
      });
      refetch();
    } finally {
      refetch();
    }
  };

  // Handle CSV Download data
  const csvData =
    orders?.data?.map((order) => ({
      Date: DateTimeFormat(order?.createdAt),
      Customer_Name: order?.customer_id?.customer_name,
      Customer_Phone: order?.customer_id?.customer_phone,
      Customer_Address: order?.customer_id?.customer_address,
      Order_ID: order?.order_id,
      Order_Status: order?.order_status,
      Sub_Total: order?.sub_total_amount,
      Discount_Percent: order?.discount_percent_amount,
      Grand_Total: order?.grand_total_amount,
      Order_Note: order?.order_note,
    })) || [];

  // Handle PDF Download data
  const document = (
    <PDFDocument>
      <Page size={"A4"}>
        <View style={{ margin: "10px" }}>
          {/* to header */}
          <View style={{ marginBottom: "20px" }}>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "24px",
                margin: "20px 0",
                letterSpacing: "1px",
              }}
            >
              Classic It
            </Text>
            <Text style={{ fontSize: "10px", textAlign: "center" }}>
              Classic It Limited, 238/1 Uttara Sector 13, Dhaka-1207,
              Bangladesh,
            </Text>
            <Text style={{ fontSize: "10px", textAlign: "center" }}>
              +8801746544488, +88017465449, classicit.com
            </Text>
          </View>
          <View>
            {/* Column Headers */}
            <View
              style={{
                flexDirection: "row",
                borderTop: "1px",
                borderLeft: "1px",
                borderRight: "1px",
                borderBottom: "1px",
                padding: "10px 0",
                backgroundColor: "#000F24",
                borderColor: "#F5F7F8",
                color: "white",
              }}
            >
              <View
                style={{
                  width: "80px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "0 5px",
                }}
              >
                <Text>#SL</Text>
              </View>
              <View
                style={{ width: "100px", fontSize: "10px", fontWeight: "bold" }}
              >
                <Text>Date</Text>
              </View>
              <View
                style={{ width: "100px", fontSize: "10px", fontWeight: "bold" }}
              >
                <Text>Customer Name</Text>
              </View>
              <View
                style={{ width: "100px", fontSize: "10px", fontWeight: "bold" }}
              >
                <Text>Customer Contract</Text>
              </View>
              <View
                style={{ width: "100px", fontSize: "10px", fontWeight: "bold" }}
              >
                <Text>Customer Address</Text>
              </View>
              <View
                style={{ width: "100px", fontSize: "10px", fontWeight: "bold" }}
              >
                <Text>Order ID</Text>
              </View>
              <View
                style={{ width: "100px", fontSize: "10px", fontWeight: "bold" }}
              >
                <Text>Order Status</Text>
              </View>
              <View
                style={{ width: "100px", fontSize: "10px", fontWeight: "bold" }}
              >
                <Text>Sub Total</Text>
              </View>
              <View
                style={{ width: "100px", fontSize: "10px", fontWeight: "bold" }}
              >
                <Text>Percent Amount</Text>
              </View>
              <View
                style={{ width: "100px", fontSize: "10px", fontWeight: "bold" }}
              >
                <Text>Grand Total</Text>
              </View>
            </View>

            {/* Data Row */}
            {orders?.data?.map((order, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  borderBottom: "1px",
                  borderLeft: "1px",
                  borderRight: "1px",
                  padding: "10px 0",
                  borderColor: "#F5F7F8",
                  backgroundColor: i % 2 === 0 ? "#F5F7F8" : "white",
                }}
              >
                <View
                  style={{
                    width: "80px",
                    fontSize: "10px",
                    textAlign: "left",
                    paddingLeft: "10px",
                  }}
                >
                  <Text>{i + 1}</Text>
                </View>
                <View style={{ width: "100px", fontSize: "10px" }}>
                  <Text style={styles.totalText}>
                    {DateTimeFormat(order?.createdAt)}
                  </Text>
                </View>
                <View style={{ width: "100px" }}>
                  <Text style={styles.totalText}>
                    {order?.customer_id?.customer_name}
                  </Text>
                </View>
                <View style={{ width: "100px" }}>
                  <Text style={styles.totalText}>
                    {order?.customer_id?.customer_phone}
                  </Text>
                </View>
                <View style={{ width: "100px", fontSize: "10px" }}>
                  <Text style={styles.totalText}>
                    {order?.customer_id?.customer_address}
                  </Text>
                </View>
                <View style={{ width: "100px", fontSize: "10px" }}>
                  <Text style={styles.totalText}>{order?.order_id}</Text>
                </View>
                <View style={{ width: "100px", fontSize: "10px" }}>
                  <Text style={styles.totalText}>{order?.order_status}</Text>
                </View>
                <View style={{ width: "100px", fontSize: "10px" }}>
                  <Text style={styles.totalText}>
                    {order?.sub_total_amount}
                  </Text>
                </View>
                <View style={{ width: "100px", fontSize: "10px" }}>
                  <Text style={styles.totalText}>
                    {order?.discount_percent_amount}
                  </Text>
                </View>
                <View style={{ width: "100px", fontSize: "10px" }}>
                  <Text style={styles.totalText}>
                    {order?.grand_total_amount}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={{ marginBottom: "20px", marginTop: "20px" }}>
            <Text style={{ fontSize: "10px", textAlign: "left" }}>
              All information generated from Classic It at{" "}
              {DateTimeFormat(new Date())}
            </Text>
          </View>
        </View>
      </Page>
    </PDFDocument>
  );

  return (
    <>
      <div className="flex justify-end gap-4">
        <CSVLink
          filename="order-list.csv"
          className="flex items-center gap-2 text-sm font-semibold bg-secondary-400 text-text-default shadow-sm hover:bg-secondary-400/80 px-4 rounded-lg py-2"
          type="button"
          data={csvData}
        >
          <FaFileDownload /> Export CSV
        </CSVLink>

        <div>
          <PDFDownloadLink document={document} fileName="order-list">
            {({ loading }) =>
              loading ? (
                <MiniSpinner />
              ) : (
                <button className="flex items-center gap-2 text-sm font-semibold bg-primary text-white shadow-sm hover:bg-primaryVariant-400 px-4 rounded-lg py-2">
                  <FaDownload className="text-xl text-textColor group-hover:text-secondary" />
                  <span className="text-[10px] text-textColor">Download</span>
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
      {isLoading === true ? (
        <TableLoadingSkeleton />
      ) : (
        <div>
          <div className="rounded-lg border border-gray-200 mt-6">
            {orders?.data?.length > 0 ? (
              <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                  <thead className="ltr:text-left rtl:text-right bg-[#fff9ee]">
                    <tr className="divide-x divide-gray-300  font-semibold text-center text-gray-900">
                      <td className="whitespace-nowrap p-4 ">SL No</td>
                      <td className="whitespace-nowrap p-4 ">Customer Name</td>
                      <td className="whitespace-nowrap p-4 ">Phone</td>
                      <td className="whitespace-nowrap p-4 ">
                        Customer Status
                      </td>
                      <td className="whitespace-nowrap p-4 ">Order Id</td>
                      <td className="whitespace-nowrap p-4 ">Sub Total</td>
                      <td className="whitespace-nowrap p-4 ">Discount(%)</td>
                      <td className="whitespace-nowrap p-4 ">Grand Total</td>
                      <td className="whitespace-nowrap p-4 ">Order Status</td>
                      <td className="whitespace-nowrap p-4 ">Created By</td>
                      <td className="whitespace-nowrap p-4 ">Updated By</td>
                      <td className="whitespace-nowrap p-4 ">Action</td>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-center">
                    {orders?.data?.map((order, i) => (
                      <tr
                        key={order?._id}
                        className={`divide-x divide-gray-200 ${
                          i % 2 === 0 ? "bg-white" : "bg-tableRowBGColor"
                        }`}
                      >
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {serialNumber + i + 1}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {order?.customer_id?.customer_name}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {order?.customer_id?.customer_phone}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {order?.customer_id?.customer_status === "active"
                            ? "Active"
                            : "In-Active"}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {order?.order_id}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {order?.sub_total_amount}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {order?.discount_percent_amount}%
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {order?.grand_total_amount}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700 uppercase">
                          {order?.order_status}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {order?.order_publisher_id?.user_name}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {order?.order_updated_by?.user_name}
                        </td>
                        <td className="whitespace-nowrap py-1.5 px-2 text-gray-700 flex items-center justify-between">
                          {/* handle order status */}
                          <select
                            onChange={(e) =>
                              handleOrderStatus(
                                e.target.value,
                                order?._id,
                                order?.order_orders,
                                order?.customer_id?._id,
                                order?.grand_total_amount
                              )
                            }
                            id="order_status"
                            className="block w-full px-1 py-1 text-gray-700 bg-white border border-gray-200 rounded-xl cursor-pointer"
                          >
                            <option selected value={order?.order_status}>
                              {order?.order_status}
                            </option>
                            {order?.order_status !== "pending" &&
                              order?.order_status !== "processing" &&
                              order?.order_status !== "confirmed" &&
                              order?.order_status !== "cancelled" &&
                              order?.order_status !== "returned" && (
                                <option value="pending">Pending</option>
                              )}
                            {order?.order_status == "pending" && (
                              <option value="processing">Processing</option>
                            )}
                            {order?.order_status == "processing" && (
                              <option value="confirmed">Confirmed</option>
                            )}
                            {order?.order_status !== "cancelled" &&
                              order?.order_status !== "returned" &&
                              order?.order_status !== "confirmed" && (
                                <option value="cancelled">Cancelled</option>
                              )}
                            {order?.order_status == "confirmed" && (
                              <option value="returned">Returned</option>
                            )}
                          </select>
                          <div>
                            <div>
                              <button
                                className="ml-[8px]"
                                onClick={() =>
                                  handleShowDocumentModal(order?._id)
                                }
                              >
                                <CiMenuKebab
                                  size={30}
                                  className="cursor-pointer text-gray-500 hover:text-gray-300 font-bold"
                                />
                              </button>
                              {orderDocumentModal == order?._id && (
                                <div className=" bg-bgray-200 shadow-xl w-[150px] flex flex-col gap-2 py-2 modal-container absolute right-14 z-30">
                                  <Link to={`/order-details/${order?._id}`}>
                                    {" "}
                                    <button className="w-full px-3 py-2 hover:bg-sky-400 hover:text-white flex justify-center items-center gap-2 font-medium">
                                      <FaEye size={16} /> View
                                    </button>
                                  </Link>

                                  <button
                                    className="w-full px-3 py-2 hover:bg-sky-400 hover:text-white flex justify-center items-center gap-2 font-medium "
                                    onClick={() => handleOrderUpdate(order)}
                                  >
                                    <FiEdit size={18} />
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <NoDataFound />
            )}
          </div>

          {totalData > 10 && (
            <Pagination
              setPage={setPage}
              setLimit={setLimit}
              totalData={totalData}
              page={page}
              limit={limit}
            />
          )}
        </div>
      )}

      {orderUpdateModal && (
        <OrderUpDateModal
          setOrderUpdateModal={setOrderUpdateModal}
          orderUpdateModalData={orderUpdateModalData}
          refetch={refetch}
          user={user}
        />
      )}
    </>
  );
};

export default OrderTable;
