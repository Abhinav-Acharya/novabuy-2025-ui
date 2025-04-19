import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/userApi";
import { CustomError } from "../../types/api-types";
import { RootState, User } from "../../types/types";
import { responseToast } from "../../utils/features";
import { LoadingText } from "../../components/Loaders";

const Users = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [list, setList] = useState<User[]>([]);

  const {
    data: allUsersData,
    isError: allUsersIsError,
    error: allUsersError,
    isLoading: allUsersIsLoading,
  } = useAllUsersQuery(user?._id!);

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

  const getUsers = () => {
    if (allUsersData) {
      setList(allUsersData.users);
    }
  };

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminUserId: user?._id! });

    if (deleteUserIsError)
      toast.error((deleteUserError as CustomError).data.message);

    responseToast(res, null, "");
  };

  const updateHandler = async (userId: string) => {
    const res = await updateUser({ userId, adminUserId: user?._id! });

    if (userUpdateIsError)
      toast.error((userUpdateError as CustomError).data.message);

    responseToast(res, null, "");
  };

  useEffect(() => {
    if (!allUsersIsLoading) getUsers();
  }, [allUsersData, allUsersIsLoading]);

  return allUsersIsLoading ? (
    <>
      <LoadingText text="Getting all users ..." />
    </>
  ) : (
    <>
      <p className="mb-6 text-2xl text-center">All Users</p>
      <div className="flex flex-col gap-2">
        {/* list table title */}
        <div className="hidden md:grid grid-cols-[0.8fr_1.5fr_0.8fr_1.6fr_0.8fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b className="text-center text-lg">Image</b>
          <b className="text-center text-lg">Name</b>
          <b className="text-center text-lg">Gender</b>
          <b className="text-center text-lg">Email</b>
          <b className="text-center text-lg">Role</b>
          <b className="text-center text-lg">Actions</b>
        </div>

        {/* Product list */}
        {list.map((user, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[0.8fr_1.5fr_0.8fr_1.6fr_0.8fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm"
            key={index}
          >
            <img
              className="w-12 rounded-full block mx-auto"
              src={user.photo}
              alt=""
            />
            <p className="text-center text-base capitalize">{user.name}</p>
            <p className="text-center text-base capitalize">{user.gender}</p>
            <p className="text-center text-base">{user.email}</p>
            <p className="text-center text-base capitalize">{user.role}</p>
            <div className="flex gap-2 justify-end md:justify-center">
              <button
                onClick={() => updateHandler(user._id)}
                className="cursor-pointer text-lg"
                disabled={userUpdateLoading}
              >
                ✏️
              </button>
              <button
                onClick={() => deleteHandler(user._id)}
                className="cursor-pointer text-lg"
                disabled={deleteUserIsLoading}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Users;
