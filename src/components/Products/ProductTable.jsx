import { FiEdit } from "react-icons/fi";
import Pagination from "../common/pagination/Pagination";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import TableLoadingSkeleton from "../common/loadingSkeleton/TableLoadingSkeleton";
import NoDataFound from "@/shared/NoDataFound/NoDataFound";

import { SettingContext } from "@/context/SettingProvider";
import UpdatePriceModal from "./UpdatePriceModal";
import { CiMenuKebab } from "react-icons/ci";
import { MdOutlineHistory } from "react-icons/md";

const ProductTable = ({
  setPage,
  setLimit,
  page,
  limit,
  totalData,
  refetch,
  user,
  isLoading,
  products,
}) => {
  const { settingData } = useContext(SettingContext);

  const [updatePriceModal, setUpdatePriceModal] = useState(false);
  const [updatePriceModalValue, setUpdatePriceModalValue] = useState({});

  const [serialNumber, setSerialNumber] = useState();
  useEffect(() => {
    const newSerialNumber = (page - 1) * limit;
    setSerialNumber(newSerialNumber);
  }, [page, limit]);

  // handle document modal open for edit view
  const [bankDocumentModal, setBankDocumentModal] = useState(null);

  const handleShowDocumentModal = (id) => {
    setBankDocumentModal((prevId) => (prevId === id ? null : id));
  };

  // Close modal on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".modal-container")) {
        setBankDocumentModal(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      {isLoading === true ? (
        <TableLoadingSkeleton />
      ) : (
        <div>
          <div className="rounded-lg border border-gray-200 mt-6">
            {products?.data?.length > 0 ? (
              <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                  <thead className="ltr:text-left rtl:text-right bg-[#fff9ee]">
                    <tr className="divide-x divide-gray-300  font-semibold text-center text-gray-900">
                      <td className="whitespace-nowrap p-4 ">SL No</td>
                      <td className="whitespace-nowrap p-4 ">Name</td>
                      <td className="whitespace-nowrap p-4 ">Image</td>
                      <td className="whitespace-nowrap p-4 ">Product Id</td>
                      <td className="whitespace-nowrap p-4 ">Price</td>
                      <td className="whitespace-nowrap p-4 ">Buying Price</td>
                      <td className="whitespace-nowrap p-4 ">Quantity</td>
                      <td className="whitespace-nowrap p-4 ">Alert Quantity</td>
                      <td className="whitespace-nowrap p-4 ">Messurement</td>
                      <td className="whitespace-nowrap p-4 ">Category</td>
                      <td className="whitespace-nowrap p-4 ">Brand</td>
                      <td className="whitespace-nowrap p-4 ">Status</td>
                      <td className="whitespace-nowrap p-4 ">Created by</td>
                      <td className="whitespace-nowrap p-4 ">Updated By</td>
                      <td className="whitespace-nowrap p-4 ">Action</td>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-center">
                    {products?.data?.map((product, i) => (
                      <tr
                        key={product?._id}
                        className={`divide-x divide-gray-200 ${
                          i % 2 === 0 ? "bg-white" : "bg-tableRowBGColor"
                        }`}
                      >
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {serialNumber + i + 1}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.product_name}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700 flex items-center justify-center">
                          <img
                            src={product?.product_image}
                            alt={product?.product_name}
                            className="h-20 w-28"
                          />
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.product_id}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.product_price}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.product_buying_price}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.product_quantity}{" "}
                          {product?.product_unit_id?.product_unit_name}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.product_stock_low_alert}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {"1"} {product?.product_unit_id?.product_unit_name}
                          {" = "}
                          {product?.product_unit_id?.product_unit_value}{" "}
                          {settingData?.unit_name}
                          <br />
                          <p className="underline">Total</p>
                          <br />
                          {product?.product_quantity}{" "}
                          {product?.product_unit_id?.product_unit_name}
                          {" = "}
                          {product?.product_unit_id?.product_unit_value *
                            product?.product_quantity}{" "}
                          {settingData?.unit_name}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.category_id?.category_name}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.brand_id?.brand_name}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.product_status === "active"
                            ? "Active"
                            : "In-Active"}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.product_publisher_id?.user_name}
                        </td>
                        <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                          {product?.product_updated_by?.user_name}
                        </td>

                        <td className="whitespace-nowrap py-1.5 px-2 text-gray-700">
                          <button
                            className="ml-[8px]"
                            onClick={() =>
                              handleShowDocumentModal(product?._id)
                            }
                          >
                            <CiMenuKebab
                              size={30}
                              className="cursor-pointer text-gray-500 hover:text-gray-300 font-bold"
                            />
                          </button>
                          {bankDocumentModal == product?._id && (
                            <div className=" bg-bgray-200 shadow-xl w-[200px] flex flex-col gap-2 py-2 modal-container absolute right-14 z-30">
                              <button
                                className="w-full px-3 py-2 hover:bg-sky-400 hover:text-white flex justify-center items-center gap-2 font-medium "
                                onClick={() => {
                                  setUpdatePriceModalValue(product);
                                  setUpdatePriceModal(true);
                                }}
                              >
                                <FiEdit size={18} />
                                Edit
                              </button>
                              <Link
                                to={`/price-update-history/${product?._id}`}
                              >
                                <button className="w-full px-3 py-2 hover:bg-sky-400 hover:text-white flex justify-center items-center gap-2 font-medium ">
                                  <MdOutlineHistory size={18} />
                                  Price Update History
                                </button>
                              </Link>
                              <Link to={`/purchage-history/${product?._id}`}>
                                {" "}
                                <button className="w-full px-3 py-2 hover:bg-sky-400 hover:text-white flex justify-center items-center gap-2 font-medium ">
                                  <MdOutlineHistory size={18} />
                                  Purchage History
                                </button>
                              </Link>
                              <Link to={`/order-history/${product?._id}`}>
                                {" "}
                                <button className="w-full px-3 py-2 hover:bg-sky-400 hover:text-white flex justify-center items-center gap-2 font-medium ">
                                  <MdOutlineHistory size={18} />
                                  Order History
                                </button>
                              </Link>
                            </div>
                          )}
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
      {/* update price modal open */}
      {updatePriceModal && (
        <UpdatePriceModal
          user={user}
          refetch={refetch}
          updatePriceModalValue={updatePriceModalValue}
          setUpdatePriceModal={setUpdatePriceModal}
        />
      )}
    </>
  );
};

export default ProductTable;
