import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import { BASE_URL } from "../../utils/baseURL";
import { toast } from "react-toastify";
import MiniSpinner from "../../shared/MiniSpinner/MiniSpinner";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Button } from "../ui/button";

const AddAllStaff = ({
  setOpenAddStaffModal,
  refetch,
  roleData,
  isLoading,
  user,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDataPost = async (data) => {
    setLoading(true);

    if (!data?.user_phone) {
      setLoading(false);
      return toast.error(
        "Please fill up Phone number fields for Register new Staff",
        {
          autoClose: 1000,
        }
      );
    }

    const sendData = {
      user_name: data?.user_name,
      user_salary: data?.user_salary,
      user_status: data?.user_status,
      user_phone: data?.user_phone,
      user_password: data?.user_password,
      user_address: data?.user_address,
      user_role_id: data?.user_role_id,
      panel_owner_id: user?.panel_owner_id?._id
        ? user?.panel_owner_id?._id
        : user?._id,
      user_publisher_id: user?._id,
    };

    try {
      const response = await fetch(`${BASE_URL}/user?role_type=staff_create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify(sendData),
      });
      const result = await response.json();
      if (result?.statusCode == 200 && result?.success == true) {
        toast.success(
          result?.message ? result?.message : "New Staff created successfully",
          {
            autoClose: 1000,
          }
        );
        refetch();
        setLoading(false);
        setOpenAddStaffModal(false);
        reset();
      } else {
        toast.error(result?.message || "Something went wrong", {
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Network error or server is down", {
        autoClose: 1000,
      });
      console.log(error);
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
              Add Staff
            </h3>
            <button
              type="button"
              className="btn p-1 absolute right-3 rounded-full top-3 text-white bg-error-100 hover:bg-error-50"
              onClick={() => setOpenAddStaffModal(false)}
            >
              {" "}
              <RxCross1 size={20}></RxCross1>
            </button>
          </div>

          <hr className="mt-2 mb-6" />

          <form onSubmit={handleSubmit(handleDataPost)} className="">
            <div>
              <label
                htmlFor="user_name"
                className="block text-xs font-medium text-gray-700"
              >
                User Name
              </label>

              <input
                {...register("user_name", {
                  required: "User name is required",
                })}
                type="text"
                id="user_name"
                placeholder="Enter user name"
                className="mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2"
              />
              {errors.user_name && (
                <p className="text-red-600 text-sm">
                  {errors.user_name?.message}
                </p>
              )}
            </div>
            <div className="mt-2">
              <label
                htmlFor="user_address"
                className="block text-xs font-medium text-gray-700"
              >
                User Address
              </label>

              <textarea
                {...register("user_address")}
                type="text"
                id="user_address"
                placeholder="Enter user Address"
                className="mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2"
              />
            </div>
            <div>
              <label
                htmlFor="user_phone"
                className="block text-xs font-medium text-gray-700 mt-2"
              >
                User Phone
              </label>

              <input
                {...register("user_phone", {
                  required: "User phone is required",
                  validate: {
                    isPhone: (value) =>
                      !value ||
                      (value.length >= 7 && value.length <= 14) ||
                      "Invalid phone number",
                  },
                })}
                type="number"
                id="user_phone"
                placeholder="Enter user phone"
                className="mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2"
              />
              {errors.user_phone && (
                <p className="text-red-600 text-sm">
                  {errors.user_phone?.message}
                </p>
              )}
            </div>
            <div className="mt-4">
              <label
                htmlFor="user_salary"
                className="block text-xs font-medium text-gray-700 mt-2"
              >
                User Salary
              </label>

              <input
                {...register("user_salary", {
                  required: "User salary is required",
                })}
                type="number"
                min={1}
                id="user_salary"
                placeholder="Enter user Salary"
                className="mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2"
              />
              {errors.user_salary && (
                <p className="text-red-600 text-sm">
                  {errors.user_salary?.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="user_password"
                className="block text-sm font-medium text-gray-700 mt-2"
              >
                Password
              </label>

              <input
                {...register("user_password", {
                  validate: {
                    isPassword: (value) =>
                      value.length >= 4 ||
                      " Password must be at least 4 characters",
                  },
                  required: "User Password is required",
                })}
                type={showPassword ? "text" : "password"} // Dynamic type based on state
                id="user_password"
                placeholder="Enter user password"
                className="mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2"
              />
              {errors.user_password && (
                <p className="text-red-600 text-sm">
                  {errors.user_password?.message}
                </p>
              )}

              {/* Eye icon for toggling password visibility */}
              <div
                className="absolute top-9 right-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaRegEye size={20} />
                ) : (
                  <FaRegEyeSlash size={20} />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="mt-4 flex-1">
                <label
                  htmlFor="user_role_id"
                  className="block text-xs font-medium text-gray-700"
                >
                  Staff Role <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("user_role_id", {
                    required: " User Role is required",
                  })}
                  id="user_role_id"
                  className=" mt-2 rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2 w-full"
                >
                  {isLoading ? (
                    <MiniSpinner />
                  ) : (
                    <>
                      {" "}
                      {roleData?.map((role) => (
                        <option key={role?._id} value={role?._id}>
                          {role?.role_name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {errors.user_role_id && (
                  <p className="text-red-600 text-sm">
                    {errors.user_role_id?.message}
                  </p>
                )}
              </div>
              <div className="mt-4 flex-1">
                <label
                  htmlFor="user_status"
                  className="block text-xs font-medium text-gray-700"
                >
                  Staff Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("user_status", {
                    required: "Staff Status is required",
                  })}
                  className="mt-2 rounded-md border-gray-200 shadow-sm sm:text-sm p-2 border-2 w-full"
                >
                  <option value="active">Active</option>
                  <option value="in-active">In-Active</option>
                </select>
                {errors.user_status && (
                  <p className="text-red-600 text-sm">
                    {errors.user_status.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-6 mt-6 justify-end">
              {loading ? (
                <div className="px-10 py-2  bg-primary hover:bg-blue-500 duration-200 text-white rounded">
                  <MiniSpinner />
                </div>
              ) : (
                <Button type="submit">Create</Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAllStaff;
