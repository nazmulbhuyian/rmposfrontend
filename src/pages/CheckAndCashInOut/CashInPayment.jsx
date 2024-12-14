
import CashInPaymentTable from "@/components/CheckAndCashInOut/CashInPaymentTable";
import { AuthContext } from "@/context/AuthProvider";
import useDebounced from "@/hooks/useDebounced";
import { BASE_URL } from "@/utils/baseURL";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

const CashInPayment = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);

  const searchText = useDebounced({ searchQuery: searchValue, delay: 500 });
  useEffect(() => {
    setSearchTerm(searchText);
  }, [searchText]);

  // handle item search function....
  const handleSearchValue = (value) => {
    setSearchValue(value);
    setLimit(10);
    setPage(1);
  };

  //Fetch customer check in data
  const {
    data: CashInPaymentData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      `/api/v1/check/check_or_cash_in_payment?payment_method=cash&page=${page}&limit=${limit}&searchTerm=${searchTerm}&role_type=cash_in_payment_show`,
    ],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/check/check_or_cash_in_payment?payment_method=cash&page=${page}&limit=${limit}&searchTerm=${searchTerm}&role_type=cash_in_payment_show`,
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

  return (
    <div className="bg-white rounded-lg py-6 px-4 shadow">
        {/* customer payment list */}
          <div className="flex justify-between mt-6">
            <div>
              <h1 className="text-2xl">All Customer Cash In Payment</h1>
            </div>
          </div>
          {/* search CashInPaymentData... */}
          <div className="mt-3">
            <input
              type="text"
              defaultValue={searchTerm}
              onChange={(e) => handleSearchValue(e.target.value)}
              placeholder="Search income..."
              className="w-full sm:w-[350px] px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
          {/*Cash in Data Show and update and delete operation file */}
          <CashInPaymentTable
            CashInPaymentData={CashInPaymentData}
            setPage={setPage}
            setLimit={setLimit}
            page={page}
            limit={limit}
            totalData={CashInPaymentData?.totalData}
            refetch={refetch}
            user={user}
            isLoading={isLoading}
          />
    </div>
  );
};

export default CashInPayment;
