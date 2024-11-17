import { useQuery } from '@tanstack/react-query'
import { BASE_URL } from '../utils/baseURL'

const UseGetUser = (page, limit, searchTerm, panel_owner_id) => {
  return useQuery({
    queryKey: [
      `/api/v1/coupon/specific_user?page=${page}&limit=${limit}&searchTerm=${searchTerm}&panel_owner_id=${panel_owner_id}&role_type=coupon_create`,
    ],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/coupon/specific_user?page=${page}&limit=${limit}&searchTerm=${searchTerm}&panel_owner_id=${panel_owner_id}&role_type=coupon_create`
      )
      const data = await res.json()
      return data
    },
  })
}

export default UseGetUser
