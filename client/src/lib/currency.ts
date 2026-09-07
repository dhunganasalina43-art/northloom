
export const formatPrice = (amount: number): string => {

  return `Rs. ${amount.toLocaleString("en-IN", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  })}`;

};

