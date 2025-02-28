import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";

import MiniSpinner from "../../shared/MiniSpinner/MiniSpinner";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { BASE_URL } from "@/utils/baseURL";

const AddSupplier = ({ setOpenAddModal, refetch, user }) => {
  const [loading, setLoading] = useState(false);
  const [amountType, setAmountType] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleDataPost = async (data) => {
    setLoading(true);
    try {
      if(!amountType){
        toast.error("Please select amount type", {
          autoClose: 1000,
        })
        setLoading(false);
        return;
      }
      if(amountType === "toReceive"){
        data.supplier_wallet_amount = parseFloat(data?.supplier_wallet_amount * -1)
      }
      const sendData = {
        supplier_publisher_id: user?._id,
        supplier_name: data?.supplier_name,
        supplier_phone: data?.supplier_phone,
        supplier_address: data?.supplier_address,
        supplier_wallet_amount: parseFloat(data?.supplier_wallet_amount),
      };

      const response = await fetch(
        `${BASE_URL}/supplier?role_type=supplier_create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );
      const result = await response.json();
      if (result?.statusCode === 200 && result?.success === true) {
        toast.success(
          result?.message ? result?.message : "supplier created successfully",
          {
            autoClose: 1000,
          }
        );
        refetch();
        setLoading(false);
        setOpenAddModal(false);
      } else {
        toast.error(result?.message || "Something went wrong", {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.message, {
        autoClose: 1000,
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative overflow-hidden text-left bg-white rounded-lg shadow-xl w-[550px] p-6 max-h-[100vh] overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between mt-4">
            <h3
              className="text-[26px] font-bold text-gray-800 capitalize"
              id="modal-title"
            >
              Add Supplier
            </h3>
            <button
              type="button"
              className="btn p-1 absolute right-3 rounded-full top-3 text-white bg-error-100 hover:bg-error-50"
              onClick={() => setOpenAddModal(false)}
            >
              {" "}
              <RxCross1 size={20}></RxCross1>
            </button>
          </div>

          <hr className="mt-2 mb-6" />

          <form onSubmit={handleSubmit(handleDataPost)} className="">
            <div>
              <label
                htmlFor="supplier_name"
                className="block text-xs font-medium text-gray-700"
              >
                Supplier Name
              </label>

              <input
                {...register("supplier_name", {
                  required: "Supplier name is required",
                })}
                type="text"
                id="supplier_name"
                placeholder="Enter Supplier name"
                className="mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2"
              />
              {errors.supplier_name && (
                <p className="text-red-600 text-sm">
                  {errors.supplier_name?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="supplier_phone"
                className="block text-xs font-medium text-gray-700 mt-2"
              >
                Supplier Phone
              </label>

              <input
                {...register("supplier_phone", {
                  required: "Supplier phone is required",
                  validate: {
                    isPhone: (value) =>
                      !value ||
                      (value.length >= 7 && value.length <= 14) ||
                      "Invalid phone number",
                  },
                })}
                type="number"
                id="supplier_phone"
                placeholder="Enter Supplier phone"
                className="mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2"
              />
              {errors.supplier_phone && (
                <p className="text-red-600 text-sm">
                  {errors.supplier_phone?.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="supplier_address"
                className="block text-sm font-medium text-gray-700 mt-2"
              >
                Supplier Address
              </label>
              <textarea
                rows="5"
                {...register("supplier_address",{
                  required: "Supplier address is required",
                })}
                id="supplier_address"
                placeholder="Enter supplier Address"
                className="mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2"
              />
              {errors.supplier_address && (
                <p className="text-red-600 text-sm">
                  {errors.supplier_address?.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <p>Opening Balance Type :</p>
              <div className="flex items-center gap-1 mt-2">
                <div
                  onClick={() => setAmountType("toPay")}
                  className="relative"
                >
                  <input
                    className="absolute top-[11px] left-5 peer"
                    id="toPay"
                    type="radio"
                    tabIndex="-1"
                    name="payment"
                  />
                  <label
                    htmlFor="toPay"
                    className="w-full rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-black peer-checked:border-yellowColor peer-checked:bg-logoColor flex justify-between items-center"
                    tabIndex="0"
                  >
                    <span className="lg:text-sm text-[10px] pl-10">
                      To Pay{" "}
                    </span>
                  </label>
                </div>

                <div
                  onClick={() => setAmountType("toReceive")}
                  className="relative"
                >
                  <input
                    className="absolute top-[11px] left-5 peer"
                    id="toReceive"
                    type="radio"
                    tabIndex="-1"
                    name="payment"
                  />
                  <label
                    htmlFor="toReceive"
                    className="w-full rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-black peer-checked:border-yellowColor peer-checked:bg-logoColor flex justify-between items-center"
                    tabIndex="0"
                  >
                    <span className="lg:text-sm text-[10px] pl-10">
                      To Receive
                    </span>
                  </label>
                </div>
              </div>

              <label
                htmlFor="supplier_wallet_amount"
                className="block text-xs font-medium text-gray-700 mt-4"
              >
                Supplier Wallet Amount
              </label>

              <input
                {...register("supplier_wallet_amount", {
                  required: "Supplier Wallet Amount is required",
                })}
                type="number"
                min={0}
                id="supplier_wallet_amount"
                defaultValue={0}
                placeholder="Enter Supplier Wallet Amount"
                className="mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2"
              />
              {errors.supplier_wallet_amount && (
                <p className="text-red-600 text-sm">
                  {errors.supplier_wallet_amount?.message}
                </p>
              )}
            </div>

            <div className="flex gap-6 mt-6 justify-end">
              <Button
                variant="outline"
                onClick={() => setOpenAddModal(false)}
                type="button"
              >
                Cancel
              </Button>
              {loading ? (
                <div className="px-10 py-2  bg-primary hover:bg-blue-500 duration-200  text-white text-sm rounded">
                  Loading... <MiniSpinner />
                </div>
              ) : (
                <Button type="submit">Add Supplier</Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSupplier;
