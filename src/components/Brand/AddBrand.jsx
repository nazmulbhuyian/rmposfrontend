import MiniSpinner from '@/shared/MiniSpinner/MiniSpinner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { RxCross1 } from 'react-icons/rx'
import { Button } from '../ui/button'
import { toast } from 'react-toastify'
import { BASE_URL } from '@/utils/baseURL'

const AddBrand = ({ setBrandCreateModal, refetch, user }) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  //handle Data post
  const handleDataPost = async(data) => {
    setLoading(true)
    try {
      const sendData = {
        brand_publisher_id: user?._id,
        brand_name: data?.brand_name,
        brand_status: data?.brand_status,
      }

      const response = await fetch(
        `${BASE_URL}/brand?role_type=brand_create`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendData),
        }
      )
      const result = await response.json()
      if (result?.statusCode === 200 && result?.success === true) {
        toast.success(
          result?.message ? result?.message : 'Brand created successfully',
          {
            autoClose: 1000,
          }
        )
        refetch()
        setLoading(false)
        setBrandCreateModal(false)
      } else {
        toast.error(result?.message || 'Something went wrong', {
          autoClose: 1000,
        })
        setLoading(false)
      }
    } catch (error) {
      toast.error(error?.message, {
        autoClose: 1000,
      })
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative overflow-hidden text-left bg-white rounded-lg shadow-xl w-[550px] p-6 max-h-[100vh] overflow-y-auto scrollbar-thin'>
            <div className='flex items-center justify-between mt-4'>
              <h3
                className='text-[26px] font-bold text-gray-800 capitalize'
                id='modal-title '
              >
                Create Brand
              </h3>
              <button
                type='button'
                className='btn p-1 absolute right-3 rounded-full top-3 text-white bg-error-100 hover:bg-error-50'
                onClick={() => setBrandCreateModal(false)}
              >
                {' '}
                <RxCross1 size={20}></RxCross1>
              </button>
            </div>

            <hr className='mt-2 mb-6' />

            <form onSubmit={handleSubmit(handleDataPost)} className=''>
              <div>
                <label className='block text-xs font-medium text-gray-700'>
                  Brand Name <span className='text-red-500'>*</span>
                </label>

                <input
                  {...register('brand_name', {
                    required: 'Brand name is required',
                  })}
                  type='text'
                  placeholder='Brand Name'
                  className='mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2'
                />
                {errors.brand_name && (
                  <p className='text-red-600'>{errors.brand_name?.message}</p>
                )}
              </div>
              <div className='mt-2'>
                <label className='block text-xs font-medium text-gray-700'>
                  Brand Status
                </label>
                <select
                  {...register('brand_status')}
                  className='mt-2 rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2 w-full'
                >
                  <option value='active'>Active</option>
                  <option value='in-active'>In-Active</option>
                </select>
              </div>

              <div className='flex justify-end mt-3'>
                {loading == true ? (
                  <div className='px-10 py-2 flex items-center justify-center  bg-primaryColor text-white rounded'>
                    <MiniSpinner />
                  </div>
                ) : (
                  <Button type='submit'>Create</Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBrand
