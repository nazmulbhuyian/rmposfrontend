import MiniSpinner from '@/shared/MiniSpinner/MiniSpinner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { RxCross1 } from 'react-icons/rx'
import { Button } from '../ui/button'

const UpdateBankInfo = ({
  setBankAccountUpdateModal,
  bankAccountUpdateData,
}) => {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit } = useForm()

  //Hndle Data post
  const handleDataPost = (data) => {
    console.log(data)
  }
  return (
    <div>
      <div>
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative overflow-hidden text-left bg-white rounded-lg shadow-xl w-[850px] p-6 max-h-[100vh] overflow-y-auto scrollbar-thin'>
            <div className='flex items-center justify-between mt-4'>
              <h3
                className='text-[26px] font-bold text-gray-800 capitalize'
                id='modal-title '
              >
                Update Bank Info
              </h3>
              <button
                type='button'
                className='btn p-1 absolute right-3 rounded-full top-3 text-white bg-error-100 hover:bg-error-50'
                onClick={() => setBankAccountUpdateModal(false)}
              >
                {' '}
                <RxCross1 size={20}></RxCross1>
              </button>
            </div>

            <hr className='mt-2 mb-6' />

            <form onSubmit={handleSubmit(handleDataPost)} className=''>
              <div>
                <label
                  htmlFor=''
                  className='block text-xs font-medium text-gray-700'
                >
                  Account Name 
                </label>

                <input
                  {...register('account_name', {
                    required: 'Account name is required',
                  })}
                  type='text'
                  placeholder='Account Name'
                  className='mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2'
                />
              </div>
              <div className='mt-2'>
                <label
                  htmlFor=''
                  className='block text-xs font-medium text-gray-700'
                >
                  Account Name
                </label>

                <input
                  {...register('account_no', {
                    required: 'Account no is required',
                  })}
                  type='text'
                  placeholder='Account No'
                  className='mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2'
                />
              </div>
              <div className='mt-2'>
                <label
                  htmlFor=''
                  className='block text-xs font-medium text-gray-700'
                >
                  Bank Name 
                </label>

                <input
                  {...register('bank_name', {
                    required: 'Bank name is required',
                  })}
                  type='text'
                  placeholder='Bank Name'
                  className='mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2'
                />
              </div>
              <div className='mt-2'>
                <label className='block text-xs font-medium text-gray-700'>
                  Bank Balance 
                </label>

                <input
                  {...register('bank_balance', {
                    required: ' Bank Balance is required',
                    validate: (value) => {
                      if (value < 0) {
                        return 'Balance must be greater than 0 or equal 0'
                      }
                    },
                  })}
                  type='number'
                  placeholder='Enter Bank Balance'
                  className='mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2'
                />
              </div>
              <div className='mt-2'>
                <label className='block text-xs font-medium text-gray-700'>
                  Bank Status
                </label>
                <select
                  {...register('bank_status', {
                    required: 'Bank Status is required',
                  })}
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
                  <Button type='submit'>Update</Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateBankInfo
