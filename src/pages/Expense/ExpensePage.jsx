import ExpensesTable from "@/components/Expenses/ExpensesTable";
import { AuthContext } from "@/context/AuthProvider";
import useDebounced from "@/hooks/useDebounced";
import MiniSpinner from "@/shared/MiniSpinner/MiniSpinner";
import { BASE_URL } from "@/utils/baseURL";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

const ExpensePage = () => {
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

  //Fetch expense Data
  const {
    data: expenses = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      `/api/v1/expense?page=${page}&limit=${limit}&searchTerm=${searchTerm}&role_type=expense_show`,
    ],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/expense?page=${page}&limit=${limit}&searchTerm=${searchTerm}&role_type=expense_show`,
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
      <div className="flex justify-between mt-6">
        <div>
          <h1 className="text-2xl">Expenses</h1>
        </div>
      </div>
      {/* search Expenses... */}
      <div className="mt-3">
        <input
          type="text"
          defaultValue={searchTerm}
          onChange={(e) => handleSearchValue(e.target.value)}
          placeholder="Search Customers..."
          className="w-full sm:w-[350px] px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        />
      </div>
      {/*Expenses Data Show and update and delete operation file */}
      <ExpensesTable
        expenses={expenses}
        setPage={setPage}
        setLimit={setLimit}
        page={page}
        limit={limit}
        totalData={expenses?.totalData}
        refetch={refetch}
        user={user}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ExpensePage;
