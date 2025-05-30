const { MailtrapClient } = require("mailtrap");

const client = new MailtrapClient({
  token: process.env.MAIL_TRAP_API_TOKEN,
});

const orderStatus = {
  Success: "Success",
  Declined: "Declined",
  Failure: "Failure",
};

const sendOrderStatusEmail = async (
  orderId,
  productData,
  userData,
  quantity,
  totalAmount,
  status
) => {
  const sender = {
    email: "hi@demomailtrap.co",
    name: "Mailtrap Team",
  };

  const recipients = [
    {
      email: userData.email,
    },
  ];

  if (status === orderStatus["Success"]) {
    client
      .send({
        from: sender,
        to: recipients,
        template_uuid: "e03a0833-6e71-437f-aa8c-af60731ab90c",
        template_variables: {
          orderId,
          customerName: userData.fullName,
          itemTitle: productData.title,
          quantity,
          pricePerItem: productData.price,
          totalAmount,
        },
      })
      .then(console.log, console.error);
  } else if (status === orderStatus["Declined"]) {
    client
      .send({
        from: sender,
        to: recipients,
        template_uuid: "b710be60-6a02-429f-a6e6-d4bc644002ee",
        template_variables: {
          orderId,
          customerName: userData.fullName,
          itemTitle: productData.title,
          quantity,
          totalAmount,
          supportMail: process.env.SUPPORT_EMAIL,
        },
      })
      .then(console.log, console.error);
  } else if (status === orderStatus["Failure"]) {
    client
      .send({
        from: sender,
        to: recipients,
        template_uuid: "f9d2d0c0-10d5-4685-99e8-e1c9da0c0a6e",
        template_variables: {
          orderId,
          customerName: userData.fullName,
          itemTitle: productData.title,
          quantity,
          totalAmount,
          supportMail: process.env.SUPPORT_EMAIL,
        },
      })
      .then(console.log, console.error);
  }
};

module.exports = {
  sendOrderStatusEmail,
};
