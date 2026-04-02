import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DashBoardContext } from "../context/DashboardContext";
import { nanoid } from "nanoid";

const TransactionForm = ({ closeForm }) => {
  const { setTransactions, editUser, setEditUser } = useContext(DashBoardContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      orderNumber: "",
      customer: "",
      category: "",
      price: "",
      date: "",
      payment: "Cash",
      status: "new",
    },
  });

  // prefill on edit
  useEffect(() => {
    if (editUser) {
      reset(editUser);
    }
  }, [editUser, reset]);

  const onSubmit = (data) => {
    if (editUser) {
      setTransactions((prev) =>
        prev.map((val) =>
          val.id === editUser.id ? { ...val, ...data } : val
        )
      );
      setEditUser(null);
    } else {
      setTransactions((prev) => [...prev, { ...data, id: nanoid() }]);
    }

    reset();
    closeForm && closeForm();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-black">
        {editUser ? "Update Order" : "Add Order"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        {/* Order Number */}
        <div>
          <input
            placeholder="Order Number"
            {...register("orderNumber", { required: "orderNumber Required"})}
            className={`w-full border-2 p-3 rounded text-black placeholder-gray-500 focus:outline-none transition-all ${
              errors.orderNumber ? "border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          />
          {errors.orderNumber && <p className="text-red-600 text-sm mt-1">{errors.orderNumber.message}</p>}
        </div>

        {/* Customer */}
        <div>
          <input
            placeholder="Customer Name"
            {...register("customer", { required: "customer name required" })}
            className={`w-full border-2 p-3 rounded text-black placeholder-gray-500 focus:outline-none transition-all ${
              errors.customer ? "border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          />
          {errors.customer && <p className="text-red-600 text-sm mt-1">{errors.customer.message}</p>}
        </div>

        {/* Category */}
        <div>
          <input
            placeholder="Category"
            {...register("category", {required : "category required"})}
            className={`w-full border-2 p-3 rounded text-black placeholder-gray-500 focus:outline-none transition-all ${
              errors.category ? "border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          />
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
        </div>

        {/* Price */}
        <div>
          <input
            type="number"
            placeholder="Price"
            {...register("price", { required: "Price required" })}
            className={`w-full border-2 p-3 rounded text-black placeholder-gray-500 focus:outline-none transition-all ${
              errors.price ? "border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
        </div>

        {/* Date */}
        <div>
          <input
            type="date"
            {...register("date" , {required : "date required"})}
            className={`w-full border-2 p-3 rounded text-black placeholder-gray-500 focus:outline-none transition-all ${
              errors.date ? "border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          />
          {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
        </div>

        {/* Payment */}
        <div>
          <select 
            {...register("payment" , {required : "Payment mode required"})} 
            className={`w-full border-2 p-3 rounded text-black placeholder-gray-500 focus:outline-none transition-all ${
              errors.payment ? "border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="PayPal">PayPal</option>
          </select>
          {errors.payment && <p className="text-red-600 text-sm mt-1">{errors.payment.message}</p>}
        </div>

        {/* Status */}
        <div>
          <select 
            {...register("status" , {required : "Show a status"})} 
            className={`w-full border-2 p-3 rounded text-black placeholder-gray-500 focus:outline-none transition-all ${
              errors.status ? "border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          >
            <option value="new">New</option>
            <option value="on way">On Way</option>
            <option value="delivered">Delivered</option>
            <option value="await">Await</option>
          </select>
          {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-all mt-4 ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {editUser ? "Update Order" : "Add Order"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;