import { BASE_URL } from "@/utils/baseURL";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pagination from "../common/pagination/Pagination";
import NoDataFound from "@/shared/NoDataFound/NoDataFound";
import TableLoadingSkeleton from "../common/loadingSkeleton/TableLoadingSkeleton";

const PurchageHistory = () => {
  const { product_id } = useParams();
   const [serialNumber, setSerialNumber] = useState();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(30);
   // const { user } = useContext(AuthContext);

   //Fetch Bank Data
   const {
     data: purchaseHistory = [],
     isLoading,
     // refetch,
   } = useQuery({
     queryKey: [
       `/api/v1/stock_manage/${product_id}?page=${page}&limit=${limit}`,
     ],
     queryFn: async () => {
       try {
         const res = await fetch(
           `${BASE_URL}/stock_manage/${product_id}?page=${page}&limit=${limit}`,
           {
             credentials: "include",
           }
         );

         if (!res.ok) {
           const errorData = await res.text();
           throw new Error(
             `Error: ${res.status} ${res.statusText} - ${errorData}`
           );
         }

         const data = await res.json();
         return data;
       } catch (error) {
         console.error("Fetch error:", error);
         throw error;
       }
     },
   });

   useEffect(() => {
     const newSerialNumber = (page - 1) * limit;
     setSerialNumber(newSerialNumber);
   }, [page, limit]);
  
  console.log(purchaseHistory);
  
  return (
    <>
      {/* search Supplier Payment History... */}

      {isLoading === true ? (
        <TableLoadingSkeleton />
      ) : (
        <>
          <div className=" mt-4">
            <h3 className="text-[26px] font-bold text-gray-800 capitalize">
              Purchase History
            </h3>
            <div className="flex items-center justify-between my-5 mx-28">
              <div className="text-[26px] font-bold text-gray-800">
                <p>
                  Product Name :{" "}
                  {purchaseHistory?.data?.productDetails?.product_name}
                </p>
                <p>
                  Product Id :{" "}
                  {purchaseHistory?.data?.productDetails?.product_id}
                </p>
              </div>
              <div className="text-[26px] font-bold text-gray-800">
                <p>
                  Product Quantity:{" "}
                  {purchaseHistory?.data?.productDetails?.product_quantity}
                </p>
                <p>
                  Product Total Sale:{" "}
                  {purchaseHistory?.data?.productDetails?.total_sale}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 mt-6">
            {purchaseHistory?.data?.stockDetails?.length > 0 ? (
              <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                  <thead className="ltr:text-left rtl:text-right bg-[#fff9ee]">
                    <tr className="divide-x  divide-gray-300  font-semibold text-center text-gray-900">
                      <td className="whitespace-nowrap p-4 ">SL No</td>
                      <td className="whitespace-nowrap p-4 ">Supplier Name</td>
                      <td className="whitespace-nowrap p-4 ">Quantity</td>
                      <td className="whitespace-nowrap p-4 ">Purchase Price</td>
                      <td className="whitespace-nowrap p-4 ">Selling Price</td>
                      <td className="whitespace-nowrap p-4 ">
                        Stock PubLisher Name
                      </td>
                      <td className="whitespace-nowrap p-4 ">
                        Stock PubLisher Phone
                      </td>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-center">
                    {purchaseHistory?.data?.stockDetails?.map(
                      (stockDetails, i) => (
                        <tr
                          key={stockDetails?._id}
                          className={`divide-x divide-gray-200 ${
                            i % 2 === 0 ? "bg-white" : "bg-tableRowBGColor"
                          }`}
                        >
                          <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                            {serialNumber + i + 1}
                          </td>
                          <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                            {stockDetails?.supplier_id?.supplier_name}
                          </td>
                          <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                            {stockDetails?.product_quantity}
                          </td>
                          <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                            {stockDetails?.product_buying_price}
                          </td>
                          <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                            {stockDetails?.product_selling_price}
                          </td>
                          <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                            {stockDetails?.stock_publisher_id?.user_name}
                          </td>
                          <td className="whitespace-nowrap py-1.5 font-medium text-gray-700">
                            {stockDetails?.stock_publisher_id?.user_phone}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <NoDataFound />
            )}
          </div>
          <Pagination
            setPage={setPage}
            setLimit={setLimit}
            totalData={purchaseHistory?.totalData}
            page={page}
            limit={limit}
          />
        </>
      )}
    </>
  );
};

export default PurchageHistory;
