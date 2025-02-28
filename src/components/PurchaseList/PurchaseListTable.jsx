import { useEffect, useState } from "react";
import Pagination from "../common/pagination/Pagination";
import TableLoadingSkeleton from "../common/loadingSkeleton/TableLoadingSkeleton";
import NoDataFound from "@/shared/NoDataFound/NoDataFound";

const PurchaseListTable = ({
  purchaseLists,
  isLoading,
  totalData,
  setPage,
  setLimit,
  page,
  limit,
}) => {
  const [serialNumber, setSerialNumber] = useState();

  useEffect(() => {
    const newSerialNumber = (page - 1) * limit;
    setSerialNumber(newSerialNumber);
  }, [page, limit]);

  return (
    <>
      {isLoading === true ? (
        <TableLoadingSkeleton />
      ) : (
        <div>
          {purchaseLists?.data?.length > 0 ? (
            <div className="mt-5 overflow-x-auto rounded">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm border rounded">
                <thead className=" bg-[#fff9ee] ">
                  <tr className="divide-x divide-gray-300  font-semibold text-center text-gray-900">
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      SL
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      Product Name
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      Product Id
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      Purchase Quantity
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      Purchase Price
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      Set Selling Price
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      Note
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      Supplier Name
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      Supplier Phone
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5   text-gray-800 ">
                      Created By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-center ">
                  {purchaseLists?.data?.map((purchaselist, i) => (
                    <tr
                      key={purchaselist?._id}
                      className={`divide-x divide-gray-200 ${
                        i % 2 === 0 ? "bg-white" : "bg-tableRowBGColor"
                      }`}
                    >
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {serialNumber + i + 1}
                      </td>
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {purchaselist?.product_id?.product_name}
                      </td>
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {purchaselist?.product_id?.product_id}
                      </td>
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {purchaselist?.product_quantity}
                      </td>
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {purchaselist?.product_buying_price}
                      </td>
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {purchaselist?.product_selling_price}
                      </td>
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {purchaselist?.product_note}
                      </td>
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {purchaselist?.supplier_id?.supplier_name}
                      </td>
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {purchaselist?.supplier_id?.supplier_phone}
                      </td>
                      <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                        {purchaselist?.stock_publisher_id?.user_name}
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
      )}
      <Pagination
        setPage={setPage}
        setLimit={setLimit}
        totalData={totalData}
        page={page}
        limit={limit}
      />
    </>
  );
};

export default PurchaseListTable;
