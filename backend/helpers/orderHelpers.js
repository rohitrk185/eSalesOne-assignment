const { MailtrapClient } = require("mailtrap");

const client = new MailtrapClient({
  token: process.env.MAIL_TRAP_API_TOKEN,
});

const orderStatus = {
  Success: "Success",
  Declined: "Declined",
  Failure: "Failure",
};

const emailTemplateUuids = {
  // "e03a0833-6e71-437f-aa8c-af60731ab90c"
  Success: "935c5fa6-6f5c-448b-b599-89fc69e8e895",
  // "b710be60-6a02-429f-a6e6-d4bc644002ee"
  Declined: "60ffd77d-3b42-4fcd-9f90-5bc5172fb058",
  // "f9d2d0c0-10d5-4685-99e8-e1c9da0c0a6e"
  Failure: "5e3fcfc5-dd3b-404a-acaf-b8a6d183ec83",
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
        template_uuid: emailTemplateUuids.Success,
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
        template_uuid: emailTemplateUuids.Declined,
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
        template_uuid: emailTemplateUuids.Failure,
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
