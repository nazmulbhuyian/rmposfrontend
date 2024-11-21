import { RxCross1 } from 'react-icons/rx'

import { useForm } from 'react-hook-form'
import { useState } from 'react'

import MiniSpinner from '../../shared/MiniSpinner/MiniSpinner'
import { Button } from '../ui/button'

const AddCategory = ({ setCategoryCreateModal }) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // get token
  // const token = getCookie(authKey);
  // Handle Add Category

  const handleDataPost = (data) => {
    console.log(data)
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
                Create Category
              </h3>
              <button
                type='button'
                className='btn p-1 absolute right-3 rounded-full top-3 text-white bg-error-100 hover:bg-error-50'
                onClick={() => setCategoryCreateModal(false)}
              >
                {' '}
                <RxCross1 size={20}></RxCross1>
              </button>
            </div>

            <hr className='mt-2 mb-6' />

            <form onSubmit={handleSubmit(handleDataPost)} className=''>
              <div>
                <label
                  htmlFor='UserEmail'
                  className='block text-xs font-medium text-gray-700'
                >
                  Category Name <span className='text-red-500'>*</span>
                </label>

                <input
                  {...register('category_name', {
                    required: 'category name is required',
                  })}
                  type='text'
                  placeholder='Category Name'
                  className='mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2'
                />
                {errors.category_name && (
                  <p className='text-red-600'>
                    {errors.category_name?.message}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <label className='block text-xs font-medium text-gray-700'>
                  Category Status
                </label>
                <select
                  {...register('category_status')}
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

export default AddCategory
