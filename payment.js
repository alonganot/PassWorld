const showRelevantPaymentButtons = (ul) => {
  if (ul === userLevels.find((ul) => ul.value === "free").code) {
    paypal
      .Buttons({
        style: {
          layout: "horizontal",
          shape: "pill",
        },
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                description: "PassWorld GOLD membership",
                amount: {
                  value: "2.99",
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then((details) => {
            localStorage.setItem(
              "ul",
              CryptoJS.AES.encrypt(
                userLevels.find((ul) => ul.value === "gold").code,
                key
              ).toString()
            );
            window.open("golduser.html");
          });
        },
        onCancel: function (data) {
          alertify.error("You have canceled your order. Try again!");
        },
      })
      .render("#paypal-gold-button");
  }
  if (ul !== userLevels.find((ul) => ul.value === "platinum").code) {
    paypal
      .Buttons({
        style: {
          layout: "horizontal",
          color: "blue",
          shape: "pill",
        },
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                description: "PassWorld PLATINUM membership",
                amount: {
                  value: "4.99",
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then((details) => {
            localStorage.setItem(
              "ul",
              CryptoJS.AES.encrypt(
                userLevels.find((ul) => ul.value === "platinum").code,
                key
              ).toString()
            );
            window.open("platinumuser.html");
          });
        },
        onCancel: function (data) {
          alertify.error("You have canceled your order. Try again!");
        },
      })
      .render("#paypal-platinum-button");
  }
};
