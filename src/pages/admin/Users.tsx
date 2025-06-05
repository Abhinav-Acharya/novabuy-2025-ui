import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import DeleteModal from "../../components/admin/DeleteModal";
import { LoadingText } from "../../components/Loaders";
import {
  useAllUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApi";
import { CustomError } from "../../types/api-types";
import { RootState, User } from "../../types/types";
import { responseToast } from "../../utils/features";

const Users = () => {
  const { user: loggedInUser } = useSelector(
    (state: RootState) => state.userReducer
  );

  const [list, setList] = useState<User[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingUserId, setDeletingUserId] = useState<User["_id"] | null>(
    null
  );

  const {
    data: allUsersData,
    isError: allUsersIsError,
    error: allUsersError,
    isLoading: allUsersIsLoading,
  } = useAllUsersQuery(loggedInUser?._id || "");

  if (allUsersIsError) toast.error((allUsersError as CustomError).data.message);

  const [
    updateUser,
    {
      isError: userUpdateIsError,
      error: userUpdateError,
      isLoading: userUpdateLoading,
    },
  ] = useUpdateUserMutation();

  const deleteHandler = async (userId: string) => {
    setDeletingUserId(userId);
    setDeleteModalOpen(true);
  };

  const updateHandler = async (userId: string) => {
    const res = await updateUser({
      userId,
      adminUserId: loggedInUser?._id || "",
    });

    if (userUpdateIsError)
      toast.error((userUpdateError as CustomError).data.message);

    responseToast(res);
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
      <p className="mb-6 text-2xl text-center">All Users</p>
      <div className="flex flex-col gap-2">
        {/* list table title */}
        <div className="hidden md:grid grid-cols-[0.5fr_1.3fr_0.5fr_2fr_0.8fr_1.4fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b className="text-center text-[16px]">Image</b>
          <b className="text-center text-[16px]">Name</b>
          <b className="text-center text-[16px]">Gender</b>
          <b className="text-center text-[16px]">Email</b>
          <b className="text-center text-[16px]">Role</b>
          <b className="text-center text-[16px]">Actions</b>
        </div>

        {/* Product list */}
        {list.map((user, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[0.5fr_1.3fr_0.5fr_2fr_0.8fr_1.4fr] items-center py-1 px-2 border bg-gray-100 text-sm min-h-[50px] max-h-auto"
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
            <div
              className="flex gap-2 my-1.5 justify-center items-center"
              hidden={loggedInUser?._id === user._id}
            >
              <button
                onClick={() => updateHandler(user._id)}
                className="cursor-pointer flex gap-1 px-2 border-1 rounded-full border-black p-0.5 mx-2"
                disabled={userUpdateLoading}
              >
                <span className="text-[14px]">
                  {user.role === "admin" ? "Remove as Admin" : "Make Admin"}
                </span>
                <MdEdit size={20} color="black" />
              </button>
              <button
                onClick={() => {
                  deleteHandler(user._id);
                }}
                className="cursor-pointer right-0"
              >
                <MdDeleteForever size={26} color="red" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {deletingUserId && (
        <DeleteModal
          isOpen={deleteModalOpen}
          userId={loggedInUser?._id || ""}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingUserId(null);
          }}
          type="user"
          id={deletingUserId}
        />
      )}
    </>
  );
};

export default Users;
