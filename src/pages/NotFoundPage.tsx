import { MdError } from "react-icons/md";

const NotFoundPage = () => {
  return (
    <>
      <div className="container not-found">
        <MdError />
        <h1>Page not found</h1>
      </div>
    </>
  );
};

export default NotFoundPage;
