import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { LoadingText } from "../../components/Loaders";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/userApi";
import { CustomError } from "../../types/api-types";
import { RootState, User } from "../../types/types";
import { responseToast } from "../../utils/features";
import { MdDeleteForever, MdEdit } from "react-icons/md";

const Coupons = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [list, setList] = useState<User[]>([]);

  const {
    data: allUsersData,
    isError: allUsersIsError,
    error: allUsersError,
    isLoading: allUsersIsLoading,
  } = useAllUsersQuery(user?._id || "");

  if (allUsersIsError) toast.error((allUsersError as CustomError).data.message);

  const [
    deleteUser,
    {
      isError: deleteUserIsError,
      error: deleteUserError,
      isLoading: deleteUserIsLoading,
    },
  ] = useDeleteUserMutation();

  const [
    updateUser,
    {
      isError: userUpdateIsError,
      error: userUpdateError,
      isLoading: userUpdateLoading,
    },
  ] = useUpdateUserMutation();

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminUserId: user?._id || "" });

    if (deleteUserIsError)
      toast.error((deleteUserError as CustomError).data.message);

    responseToast(res, null, "");
  };

  const updateHandler = async (userId: string) => {
    const res = await updateUser({ userId, adminUserId: user?._id || "" });

    if (userUpdateIsError)
      toast.error((userUpdateError as CustomError).data.message);

    responseToast(res, null, "");
  };

  useEffect(() => {
    const getUsers = () => {
      if (allUsersData) {
        setList(allUsersData.users);
      }
    };

    if (!allUsersIsLoading) getUsers();
  }, [allUsersData, allUsersIsLoading]);

  return allUsersIsLoading ? (
    <>
      <LoadingText text="Getting all users ..." />
    </>
  ) : (
    <>
      <p className="mb-6 text-2xl text-center">All Coupons</p>
      <div className="flex flex-col gap-2">
        {/* list table title */}
        <div className="hidden md:grid grid-cols-[1.5fr_1.3fr_2fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b className="text-center text-[16px]">Coupon code</b>
          <b className="text-center text-[16px]">Amount</b>
          <b className="text-center text-[16px]">Date Created</b>
          <b className="text-center text-[16px]">Actions</b>
        </div>

        {/* Product list */}
        {list.map((user, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[0.5fr_1.3fr_0.5fr_1.8fr_0.5fr_1.4fr] items-center py-1 px-2 border bg-gray-100 text-sm"
            key={index}
          >
            <img
              className="w-12 rounded-full block mx-auto"
              src={user.photo}
              alt=""
            />
            <p className="text-center text-[14px] capitalize">{user.name}</p>
            <p className="text-center text-[14px] capitalize">{user.gender}</p>
            <p className="text-center text-[14px]">{user.email}</p>
            <p className="text-center text-[14px] capitalize">{user.role}</p>
            <div className="flex items-center gap-2 justify-end md:justify-center my-1.5">
              <button
                onClick={() => updateHandler(user._id)}
                className="cursor-pointer flex gap-1 px-2 border-1 rounded-full border-black p-0.5"
                disabled={userUpdateLoading}
              >
                <span className="text-[14px]">
                  {user.role === "admin"
                    ? "Demote to User"
                    : "Promote to Admin"}
                </span>
                <MdEdit size={20} color="black" />
              </button>
              <button
                onClick={() => deleteHandler(user._id)}
                className="cursor-pointer right-0"
                disabled={deleteUserIsLoading}
              >
                <MdDeleteForever size={26} color="red" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Coupons;
