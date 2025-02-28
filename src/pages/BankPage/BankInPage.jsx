import BankIn from "@/components/Bank/BankIn";
import { AuthContext } from "@/context/AuthProvider";
import useDebounced from "@/hooks/useDebounced";
import { BASE_URL } from "@/utils/baseURL";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BankInPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useContext(AuthContext)

  const searchText = useDebounced({ searchQuery: searchValue, delay: 500 })
  useEffect(() => {
    setSearchTerm(searchText)
  }, [searchText])

  // handle item search function....
  const handleSearchValue = (value) => {
    setSearchValue(value)
    setLimit(10)
    setPage(1)
  }

  //Fetch Bank Data
  const {
    data: bankInData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      `/api/v1/bank_in?bank_id=${id}&page=${page}&limit=${limit}&searchTerm=${searchTerm}&role_type=bank_in_show`,
    ],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/bank_in?bank_id=${id}&page=${page}&limit=${limit}&searchTerm=${searchTerm}&role_type=bank_in_show`,
          {
            credentials: 'include',
          }
        )

        if (!res.ok) {
          const errorData = await res.text()
          throw new Error(
            `Error: ${res.status} ${res.statusText} - ${errorData}`
          )
        }

        const data = await res.json()
        return data
      } catch (error) {
        console.error('Fetch error:', error)
        throw error
      }
    },
  })
  return (
    <div className="bg-white rounded-lg py-6 px-4 shadow">
      {/* search Bank Account... */}
      <div className='mt-3'>
        <input
          type='text'
          defaultValue={searchTerm}
          onChange={(e) => handleSearchValue(e.target.value)}
          placeholder='Search ref no...'
          className='w-full sm:w-[350px] px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
        />
      </div>
      <BankIn bankInData={bankInData}
        setPage={setPage}
        setLimit={setLimit}
        page={page}
        limit={limit}
        totalData={bankInData?.totalData}
        refetch={refetch}
        user={user}
        isLoading={isLoading} />
    </div>
  );
};

export default BankInPage;
